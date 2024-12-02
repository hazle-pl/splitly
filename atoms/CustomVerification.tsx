import useTranslation from '@/lib/useTranslations';
import React, { useState, useEffect, useRef } from 'react';

interface CustomVerificationProps {
  onVerify: (verified: boolean) => void;
}

const CustomVerification: React.FC<CustomVerificationProps> = ({ onVerify }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [sliderValue, setSliderValue] = useState(5);
  const jsConfetti = useRef<any>(null);
  const { translate } = useTranslation();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (async () => {
        const JSConfetti = (await import('js-confetti')).default;
        jsConfetti.current = new JSConfetti();
      })();
    }
  }, []);

  const handleVerification = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setSliderValue(value);

    if (value >= 100) {
      setIsVerified(true);
      onVerify(true);
      if (jsConfetti.current) {
        jsConfetti.current.addConfetti();
      }
    } else {
      setIsVerified(false);
    }
  };

  return (
    <>
      {!isVerified ? (
        <div className="custom-verification">
        <div className="verification-container">
          <p>{translate('register', 'slideToVerify')}</p>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            className="slider"
            onChange={handleVerification}
          />
        </div>
        </div>
      ) : (
        null
      )}
      </>
  );
};

export default CustomVerification;
