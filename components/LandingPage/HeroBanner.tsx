import RichText from "@/atoms/RichText";
import ContainerContent from "../Common/ContentWrapper";
import Link from "next/link";
import useTranslation from "@/lib/useTranslations";

const HeroBanner: React.FC = () => {
  const { translate } = useTranslation();

  return (
    <div className="hero-banner">
      <ContainerContent>
        <RichText>
          <h1>{translate('landing-page', 'hero-title')}</h1>
          <h3>{translate('landing-page', 'hero-subtitle')}</h3>
          <Link href="/register" className="button contrast">{translate('landing-page', 'hero-button')}</Link>
        </RichText>
        <img src="../img/desktop-gif.gif" />
      </ContainerContent>
    </div>
  );
};

export default HeroBanner;
