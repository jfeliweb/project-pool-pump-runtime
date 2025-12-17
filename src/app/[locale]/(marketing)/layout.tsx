import { setRequestLocale } from 'next-intl/server';
import { BaseTemplate } from '@/templates/BaseTemplate';
import { MarketingLayoutWrapper } from './MarketingLayoutWrapper';

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <MarketingLayoutWrapper
      locale={locale}
      baseTemplateContent={(
        <BaseTemplate>
          <div className="py-5 text-xl [&_p]:my-6">{props.children}</div>
        </BaseTemplate>
      )}
    >
      {props.children}
    </MarketingLayoutWrapper>
  );
}
