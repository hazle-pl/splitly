import { useState } from 'react';
import { useRouter } from 'next/router';
import CustomInput from '@/atoms/CustomInput';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import RichText from '@/atoms/RichText';
import Divider from '@/atoms/Divider';
import useTranslation from '@/lib/useTranslations';
import { useUser } from '@/context/userContext';
import Layout from '@/components/Common/Layout';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', password: '' });
  const router = useRouter();
  const { translate } = useTranslation();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { username: '', password: '' };

    if (!username) {
      newErrors.username = translate('login', 'usernameRequired');
    }

    if (!password) {
      newErrors.password = translate('login', 'passwordRequired');
    }

    setErrors(newErrors);

    if (newErrors.username || newErrors.password) {
      return;
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser({ username: data.username, plan: data.plan });
        toast.success(translate('login', 'loginSuccessful'));
        router.push('/dashboard');
      } else {
        toast.error(translate('login', 'loginFailed'));
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error(translate('login', 'unexpectedError'));
    }
  };

  return (
    <Layout>
      <form id="login" onSubmit={handleSubmit}>
        <RichText>
          <h1>{translate('login', 'signIn')}</h1>
          <p>{translate('login', 'accountDetailsPrompt')}<br />
          {translate('login', 'createAccount')} <Link href="/register">{translate('login', 'here')}</Link></p>
        </RichText>
        <Divider />
        <CustomInput
          label={translate('login', 'username')}
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          icon="fa-solid fa-user"
          error={errors.username ? 'input-error' : ''}
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
        <CustomInput
          label={translate('login', 'password')}
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          icon="fa-solid fa-lock"
          error={errors.password ? 'input-error' : ''}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
        <button type="submit">{translate('login', 'login')}</button>
      </form>
    </Layout>
  );
};

export default Login;
