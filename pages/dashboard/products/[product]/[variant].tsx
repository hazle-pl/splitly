import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const router = useRouter();
  const { variant, product } = router.query;

  // Ensure variant and product are strings, or provide default values
  const variantId = typeof variant === 'string' ? variant : '';
  const productId = typeof product === 'string' ? product : '';

  return (
    <DashboardLayout>
      <div className='component component1 col-4-lg col-6-md col-12-xs'>
        <h1>Variant: {variantId}</h1>
        <h1>Product: {productId}</h1>
      </div>
    </DashboardLayout>
  );
}
