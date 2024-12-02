import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import RichText from '@/atoms/RichText';
import useTranslation from '@/lib/useTranslations';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, ArcElement, Tooltip, Legend);

interface TopCountryShares {
  Country: number;
  CountryCode: string;
  Value: number;
}

interface Engagements {
  BounceRate: string;
  Month: string;
  Year: string;
  PagePerVisit: string;
  Visits: string;
  TimeOnSite: string;
}

interface EstimatedMonthlyVisits {
  [date: string]: number;
}

interface TrafficSources {
  Social: number;
  "Paid Referrals": number;
  Mail: number;
  Referrals: number;
  Search: number;
  Direct: number;
}

interface TopKeyword {
  Name: string;
  EstimatedValue: number;
  Volume: number;
  Cpc: number | null;
}

interface SimilarWebData {
  Version: number;
  SiteName: string;
  Description: string;
  TopCountryShares: TopCountryShares[];
  Title: string;
  Engagments: Engagements;
  EstimatedMonthlyVisits: EstimatedMonthlyVisits;
  GlobalRank: { Rank: number };
  CountryRank: { Country: number; CountryCode: string; Rank: number };
  TrafficSources: TrafficSources;
  LargeScreenshot: string;
  TopKeywords: TopKeyword[];
  SnapshotDate: string;
}

interface Props {
  domain: string;
}

const SimilarWeb: React.FC<Props> = ({ domain }) => {
  const { translate } = useTranslation();
  const [data, setData] = useState<SimilarWebData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/similarWeb?domain=${domain}`);
        if (!response.ok) {
          throw new Error(`Błąd HTTP: Status ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError("Nie udało się pobrać danych z backendu.");
      }
    };

    fetchData();
  }, [domain]);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Ładowanie danych...</div>;

  // Dane do wykresu liniowego dla liczby wejść miesięcznych
  const lineChartData = {
    labels: Object.keys(data.EstimatedMonthlyVisits),
    datasets: [
      {
        label: translate('similarweb', 'monthly_visits'),
        data: Object.values(data.EstimatedMonthlyVisits),
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // Dane do wykresu kołowego dla źródeł ruchu
  const pieChartData = {
    labels: [
      translate('similarweb', 'social'),
      translate('similarweb', 'paid_referrals'),
      translate('similarweb', 'mail'),
      translate('similarweb', 'referrals'),
      translate('similarweb', 'search'),
      translate('similarweb', 'direct'),
    ],
    datasets: [
      {
        data: [
          data.TrafficSources.Social,
          data.TrafficSources['Paid Referrals'],
          data.TrafficSources.Mail,
          data.TrafficSources.Referrals,
          data.TrafficSources.Search,
          data.TrafficSources.Direct,
        ].map((value) => Math.round(value * 100)), // Przelicz na procenty
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF9F40',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF9F40',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };

  return (
    <>
      {data.Title && (
        <>
          <RichText grid="col-12-lg col-12-md col-12-xs">
            <h1>{translate('similarweb', 'store_info')}</h1>
          </RichText>
          <div className="information-box col-3-lg col-6-md col-12-xs">
            <img src={data.LargeScreenshot} alt={`${data.SiteName} screenshot`} style={{ maxWidth: '100%', borderRadius: '8px' }} />
            <RichText>
              <p className="subtitle">{translate('similarweb', 'description')}</p>
              <p>{data.Description}</p>
              <p className="subtitle">{translate('similarweb', 'title')}</p>
              <p>{data.Title}</p>
            </RichText>
          </div>
        </>
      )}

      {Object.keys(data.EstimatedMonthlyVisits).length > 0 && (
        <div className="information-box col-3-lg col-6-md col-12-xs">
          <h3>{translate('similarweb', 'monthly_visits')}</h3>
          <Line data={lineChartData} />
        </div>
      )}

      {data.TrafficSources.Direct > 0 && (
        <div className="information-box col-3-lg col-6-md col-12-xs">
          <h3>{translate('similarweb', 'traffic_sources')}</h3>
          <Pie data={pieChartData} />
        </div>
      )}

      {data.TopCountryShares && data.TopCountryShares.length > 0 && (
        <div className="information-box col-3-lg col-6-md col-12-xs">
          <h3>{translate('similarweb', 'country_ranking')}</h3>
          <table>
            <thead>
              <tr>
                <th>{translate('similarweb', 'country')}</th>
                <th>{translate('similarweb', 'share')}</th>
              </tr>
            </thead>
            <tbody>
              {data.TopCountryShares.map((country, index) => (
                <tr key={index}>
                  <td>{country.CountryCode}</td>
                  <td>{(country.Value * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.Engagments.Visits !== '0' && (
        <div className="information-box col-3-lg col-6-md col-12-xs">
          <h3>{translate('similarweb', 'engagements')}</h3>
          <table>
            <thead>
              <tr>
                <th>{translate('similarweb', 'metric')}</th>
                <th>{translate('similarweb', 'value')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{translate('similarweb', 'visits')}</td>
                <td>{data.Engagments.Visits}</td>
              </tr>
              <tr>
                <td>{translate('similarweb', 'bounce_rate')}</td>
                <td>{Number(data.Engagments.BounceRate).toFixed(2)}</td>
              </tr>
              <tr>
                <td>{translate('similarweb', 'avg_time_on_site')}</td>
                <td>{Number(data.Engagments.TimeOnSite).toFixed(2)} {translate('similarweb', 'seconds')}</td>
              </tr>
              <tr>
                <td>{translate('similarweb', 'pages_per_visit')}</td>
                <td>{data.Engagments.PagePerVisit}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {data.GlobalRank.Rank && (
        <div className="information-box col-3-lg col-6-md col-12-xs">
          <h3>{translate('similarweb', 'global_rank')}</h3>
          <table>
            <thead>
              <tr>
                <th>{translate('similarweb', 'rank')}</th>
                <th>{translate('similarweb', 'value')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{translate('similarweb', 'global_rank')}</td>
                <td>{data.GlobalRank.Rank}</td>
              </tr>
              <tr>
                <td>{translate('similarweb', 'country_rank')}</td>
                <td>{data.CountryRank.Rank}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {data.TopKeywords && data.TopKeywords.length > 0 && (
        <div className="information-box col-3-lg col-6-md col-12-xs">
          <h3>{translate('similarweb', 'top_keywords')}</h3>
          <table>
            <thead>
              <tr>
                <th>{translate('similarweb', 'name')}</th>
                <th>{translate('similarweb', 'estimated_value')}</th>
                <th>{translate('similarweb', 'volume')}</th>
              </tr>
            </thead>
            <tbody>
              {data.TopKeywords.map((keyword, index) => (
                <tr key={index}>
                  <td>{keyword.Name}</td>
                  <td>{keyword.EstimatedValue}</td>
                  <td>{keyword.Volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default SimilarWeb;
