import RichText from "@/atoms/RichText";
import ContainerContent from "../Common/ContentWrapper";
import useTranslation from "@/lib/useTranslations";

const WhySection: React.FC = () => {
  const { translate } = useTranslation();

  return (
    <div className="why-section">
      <ContainerContent>
        <RichText>
          <h2>{translate('landing-page', 'why-title')}</h2>
          <div className="box-container">
            <div className="box">
              <h3>{translate('landing-page', 'why-box-1-title')}</h3>
              <p>{translate('landing-page', 'why-box-1-description')}</p>
            </div>
            <div className="box">
              <h3>{translate('landing-page', 'why-box-2-title')}</h3>
              <p>{translate('landing-page', 'why-box-2-description')}</p>
            </div>
            <div className="box">
              <h3>{translate('landing-page', 'why-box-3-title')}</h3>
              <p>{translate('landing-page', 'why-box-3-description')}</p>
            </div>
            <div className="box">
              <h3>{translate('landing-page', 'why-box-4-title')}</h3>
              <p>{translate('landing-page', 'why-box-4-description')}</p>
            </div>
          </div>
        </RichText>
      </ContainerContent>
    </div>
  );
};

export default WhySection;
