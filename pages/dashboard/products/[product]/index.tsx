import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const { product } = router.query;

  return (
    <DashboardLayout>
      <div className='component component1 col-4-lg col-6-md col-12-xs'>
        <h1>PRODUKT {product}</h1>
        dwqdqw
      </div>
    </DashboardLayout>
  );
}
