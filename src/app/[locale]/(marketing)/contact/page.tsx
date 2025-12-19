import type { Metadata } from 'next';
import { LinkedinIcon, Mail, Twitter } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type IContactProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: IContactProps,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Contact',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: [
      'contact pool pump calculator',
      'pool pump calculator support',
      'pool pump help',
      'pool pump questions',
    ],
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
    },
  };
}

export default async function Contact(props: IContactProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'Contact',
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[500px] items-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-32 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute top-40 right-20 size-24 rounded-full bg-teal-300/30 blur-lg"></div>
          <div className="absolute bottom-20 left-1/3 size-40 rounded-full bg-blue-300/20 blur-2xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl leading-tight font-bold text-white lg:text-5xl">
              {t('hero_title')}
            </h1>
            <p className="mt-4 text-xl leading-relaxed text-blue-100 lg:text-2xl">
              {t('hero_subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <article className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Thank You Message */}
          <section className="mb-16">
            <div className="mx-auto max-w-4xl">
              <p className="mb-6 text-lg leading-relaxed text-gray-700 lg:text-xl">
                {t('thank_you_message')}
              </p>
              <p className="text-lg leading-relaxed text-gray-700 lg:text-xl">
                {t('contact_preference')}
              </p>
            </div>
          </section>

          {/* Contact Information Cards */}
          <section className="mb-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">
                {t('reach_out_text')}
              </h2>
              <div className="grid gap-6 md:grid-cols-3">
                {/* Email Card */}
                <a
                  href="mailto:info@poolpumpcalc.com"
                  className="group rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 transition-all hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
                  aria-label={t('email_label')}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600">
                    <Mail className="size-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {t('email_label')}
                  </h3>
                  <p className="text-sm text-gray-600 transition-colors group-hover:text-blue-700">
                    {t('email_text')}
                  </p>
                </a>

                {/* Twitter/X Card */}
                <a
                  href="https://twitter.com/jfeliweb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 p-6 transition-all hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
                  aria-label={t('twitter_label')}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-r from-gray-700 to-slate-800">
                    <Twitter className="size-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {t('twitter_label')}
                  </h3>
                  <p className="text-sm text-gray-600 transition-colors group-hover:text-gray-700">
                    {t('twitter_text')}
                  </p>
                </a>

                {/* LinkedIn Card */}
                <a
                  href="https://www.linkedin.com/in/jeanfelisme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 transition-all hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg"
                  aria-label={t('linkedin_label')}
                >
                  <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700">
                    <LinkedinIcon className="size-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {t('linkedin_label')}
                  </h3>
                  <p className="text-sm text-gray-600 transition-colors group-hover:text-blue-700">
                    {t('linkedin_text')}
                  </p>
                </a>
              </div>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
