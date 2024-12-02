import React, { useState } from 'react';
import CustomInput from '@/atoms/CustomInput';
import PasswordChecklist from '@/atoms/PasswordChecklist';
import CustomVerification from '@/atoms/CustomVerification'; 
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Divider from '@/atoms/Divider';
import RichText from '@/atoms/RichText';
import useTranslation from '@/lib/useTranslations';
import Layout from '@/components/Common/Layout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    repassword: '',
    captcha: '',
  });
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const router = useRouter();
  const { translate } = useTranslation();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

  const handleVerification = (verified: boolean) => {
    setIsCaptchaVerified(verified);
    if (!verified) {
      setErrors({ ...errors, captcha: translate('register', 'captchaRequired') });
    } else {
      setErrors({ ...errors, captcha: '' });
    }
  };

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 7,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = { username: '', email: '', password: '', repassword: '', captcha: '' };

    if (!username.trim()) {
      newErrors.username = translate('register', 'usernameRequired');
    }

    if (!email.trim()) {
      newErrors.email = translate('register', 'emailRequired');
    } else if (!emailRegex.test(email)) {
      newErrors.email = translate('register', 'invalidEmailFormat');
    }

    if (!password.trim()) {
      newErrors.password = translate('register', 'passwordRequired');
    } else if (!passwordRegex.test(password)) {
      newErrors.password = translate('register', 'passwordRequirements');
    }

    if (!repassword.trim()) {
      newErrors.repassword = translate('register', 'repasswordRequired');
    } else if (password !== repassword) {
      newErrors.repassword = translate('register', 'passwordsDoNotMatch');
    }

    if (!isCaptchaVerified) {
      newErrors.captcha = translate('register', 'captchaRequired');
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      setErrors({ username: '', email: '', password: '', repassword: '', captcha: '' });
      toast.success(translate('register', 'registerSuccessful'));
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else {
      toast.error( translate('register', 'registrationFailed'));
    }
  };

  const passwordChecklist = validatePassword(password);

  return (
    <Layout>
      <form id="register" onSubmit={handleSubmit}>
        <RichText>
          <h1>{translate('register', 'signUp')}</h1>
          <p>{translate('register', 'createAccountPrompt')}</p>
        </RichText>
        <Divider />
        <CustomInput
          label={translate('register', 'login')}
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          error={errors.username ? 'input-error' : ''}
          icon="fa-solid fa-user"
        />
        {errors.username && <p className="error-message">{errors.username}</p>}

        <CustomInput
          label={translate('register', 'email')}
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          error={errors.email ? 'input-error' : ''}
          icon="fa-solid fa-envelope"
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <CustomInput
          label={translate('register', 'password')}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          error={errors.password ? 'input-error' : ''}
          icon="fa-solid fa-lock"
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <CustomInput
          label={translate('register', 'reenterPassword')}
          name="repassword"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
          type="password"
          error={errors.repassword ? 'input-error' : ''}
          icon="fa-solid fa-lock"
        />
        {errors.repassword && <p className="error-message">{errors.repassword}</p>}
        <CustomVerification onVerify={handleVerification} />
        <Divider />
        <PasswordChecklist checklist={passwordChecklist} />
        <button type="submit">{translate('register', 'signUp')}</button>
      </form>
    </Layout>
  );
};

export default Register;
