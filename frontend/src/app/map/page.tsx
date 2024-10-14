// app/map/page.tsx
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/Map'), {
  loading: () => <p>Loading map...</p>,
  ssr: false
});

export default function MapPage() {
  return <DynamicMap />;
}