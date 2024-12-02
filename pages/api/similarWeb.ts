import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Brakujący parametr domeny.' });
  }

  try {
    const response = await fetch(`https://data.similarweb.com/api/v1/data?domain=${domain}`);
    if (!response.ok) {
      const errorDetails = await response.text();
      throw new Error(`API SimilarWeb zwróciło błąd: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error: any) {
    console.error('Błąd przy pobieraniu danych z SimilarWeb:', error.message || error);
    res.status(500).json({ error: 'Nie udało się pobrać danych z SimilarWeb', details: error.message });
  }
}
