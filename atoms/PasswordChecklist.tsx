import React from 'react';
import useTranslation from '@/lib/useTranslations';

interface PasswordChecklistProps {
  checklist: {
    length: boolean;
    uppercase: boolean;
    number: boolean;
    specialChar: boolean;
  };
}

const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ checklist }) => {
  const { translate } = useTranslation();

  return (
    <div className="password-checklist">
      <p>{translate('register', 'checklistTitle')}</p>
      <ul>
        <li className={checklist.length ? 'valid' : 'invalid'}>
          <i className={checklist.length ? 'fa-solid fa-check' : 'fa-solid fa-xmark'} /> {translate('register', 'checklistMin')}
        </li>
        <li className={checklist.uppercase ? 'valid' : 'invalid'}>
          <i className={checklist.uppercase ? 'fa-solid fa-check' : 'fa-solid fa-xmark'} /> {translate('register', 'checklistUppercase')}
        </li>
        <li className={checklist.number ? 'valid' : 'invalid'}>
          <i className={checklist.number ? 'fa-solid fa-check' : 'fa-solid fa-xmark'} /> {translate('register', 'checklistNumber')}
        </li>
        <li className={checklist.specialChar ? 'valid' : 'invalid'}>
          <i className={checklist.specialChar ? 'fa-solid fa-check' : 'fa-solid fa-xmark'} /> {translate('register', 'checklistSpecialChar')}
        </li>
      </ul>
    </div>
  );
};

export default PasswordChecklist;
