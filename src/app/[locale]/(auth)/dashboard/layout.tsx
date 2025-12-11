import { setRequestLocale } from 'next-intl/server';
import { ModernFooter } from '@/components/marketing/ModernFooter';
import { ModernHeader } from '@/components/marketing/ModernHeader';

export default async function DashboardLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen">
      <ModernHeader />
      {props.children}
      <ModernFooter />
    </div>
  );
}
