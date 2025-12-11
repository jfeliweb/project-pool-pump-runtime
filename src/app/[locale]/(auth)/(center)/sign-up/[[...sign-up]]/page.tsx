import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getI18nPath } from '@/utils/Helpers';

type ISignUpPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ redirect_url?: string }>;
};

export async function generateMetadata(props: ISignUpPageProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function SignUpPage(props: ISignUpPageProps) {
  const { locale } = await props.params;
  const { redirect_url } = await props.searchParams;
  setRequestLocale(locale);

  // Determine fallback redirect URL
  // If redirect_url is provided, use it; otherwise default to dashboard
  const fallbackRedirectUrl = redirect_url
    ? redirect_url
    : getI18nPath('/dashboard', locale);

  return (
    <SignUp
      path={getI18nPath('/sign-up', locale)}
      fallbackRedirectUrl={fallbackRedirectUrl}
    />
  );
};
