import RichText from "@/atoms/RichText";
import ContainerContent from "../Common/ContentWrapper";
import Link from "next/link";
import useTranslation from "@/lib/useTranslations";

const JoinUs: React.FC = () => {
  const { translate } = useTranslation();

  return (
    <div className="join-us">
      <ContainerContent>
        <div className="join-us-wrapper">
          <RichText>
            <h2>{translate('landing-page', 'join-us-title')}</h2>
            <p>{translate('landing-page', 'join-us-description-1')}</p>
            <p>{translate('landing-page', 'join-us-description-2')}</p>
            <Link href="/register" className="button primary">{translate('landing-page', 'join-us-button')}</Link>
          </RichText>
        </div>
      </ContainerContent>
    </div>
  );
};

export default JoinUs;
