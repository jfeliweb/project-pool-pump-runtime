import type { Metadata } from 'next';
import { SignIn } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';

type ISignInPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect_url?: string }>;
};

export async function generateMetadata(props: ISignInPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignInPage(props: ISignInPageProps) {
  const { locale } = await props.params;
  const { redirect_url } = await props.searchParams;
  setRequestLocale(locale);

  // Determine fallback redirect URL
  // If redirect_url is provided, use it; otherwise default to dashboard
  const fallbackRedirectUrl = redirect_url || getI18nPath('/dashboard', locale);

  return (
    <SignIn
      path={getI18nPath('/sign-in', locale)}
      fallbackRedirectUrl={fallbackRedirectUrl}
    />
  );
};
