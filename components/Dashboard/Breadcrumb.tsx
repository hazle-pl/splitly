import { useRouter } from 'next/router';
import Link from 'next/link';
import useTranslation from '@/lib/useTranslations';

const Breadcrumb = () => {
  const router = useRouter();
  const pathnames = router.asPath.split('/').filter(x => x);
  const { translate } = useTranslation();
  const isDashboardOnly = pathnames.length === 1 && pathnames[0] === 'dashboard';
  const lastChild = pathnames.length > 0 ? pathnames[pathnames.length - 1] : '';

  return (
    <nav className="breadcrumb">
      <ul>
        {isDashboardOnly ? (
          <li>
            <Link href="/dashboard">{translate('pages', 'dashboard')}</Link>
          </li>
        ) : (
          <>
            {pathnames.map((value, index) => {
              if (isDashboardOnly && index === 0) return null;
              const href = `/${pathnames.slice(0, index + 1).join('/')}`;
              return (
                <li key={href}>
                  {index === pathnames.length - 1 ? (
                    translate('pages', value)
                  ) : (
                    <Link href={href}>{translate('pages', value)}</Link>
                  )}
                </li>
              );
            })}
          </>
        )}
      </ul>
      <h1>{translate('pages', lastChild)}</h1>
    </nav>
  );
};

export default Breadcrumb;
