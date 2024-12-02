import RichText from "@/atoms/RichText";
import ContainerContent from "../Common/ContentWrapper";
import useTranslation from "@/lib/useTranslations";

const SpysharkMobile: React.FC = () => {
  const { translate } = useTranslation();

  return (
    <div className="spyshark-on-mobile">
      <ContainerContent>
        <img src="../img/mobile-gif.gif" />
        <RichText>
          <h2>{translate('landing-page', 'mobile-title')}</h2>
          <p>{translate('landing-page', 'mobile-description-1')}</p>
          <p>{translate('landing-page', 'mobile-description-2')}</p>
        </RichText>
      </ContainerContent>
    </div>
  );
};

export default SpysharkMobile;
