import Dashboard from '@/components/Dashboard';
import { supabase } from '@/lib/supabaseClient';
import propertiesData from '@/data/properties.json';

// Fetch data on the server
async function getProperties() {
  const { data, error } = await supabase.from('properties').select('*');

  if (error || !data || data.length === 0) {
    console.warn('Fetching from Supabase failed or empty, falling back to JSON', error);
    return propertiesData;
  }

  // Transform snake_case to camelCase
  return data.map(p => ({
    ...p,
    saleMode: p.sale_mode,
  }));
}

export const metadata = {
  title: 'EstateMap Premium',
  description: 'Discover luxury properties on the interactive map',
};

export default async function Home() {
  const properties = await getProperties();

  return (
    <main style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <Dashboard initialProperties={properties} />
    </main>
  );
}
