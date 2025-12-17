import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

type IAboutProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IAboutProps): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'About',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: [
      'pool pump calculator',
      'pool pump runtime',
      'energy savings',
      'pool optimization',
      'pool pump schedule',
      'electricity savings',
      'pool maintenance',
      'variable speed pump',
      'pool energy efficiency',
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

export default async function About(props: IAboutProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'About',
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[500px] items-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative Blobs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-32 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute top-40 right-20 size-24 rounded-full bg-teal-300/30 blur-lg"></div>
          <div className="absolute bottom-20 left-1/3 size-40 rounded-full bg-blue-300/20 blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              {/* Text Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-4xl leading-tight font-bold text-white lg:text-5xl">
                  {t('hero_title')}
                </h1>
                <p className="mt-4 text-xl leading-relaxed text-blue-100 lg:text-2xl">
                  {t('hero_subtitle')}
                </p>
              </div>

              {/* Hero Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <Image
                    src="/about-hero.png"
                    alt="Pool pump and pool illustration representing PoolCalc's mission"
                    width={600}
                    height={400}
                    className="rounded-xl shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <article className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          {/* Paragraph 1 */}
          <section className="mb-16">
            <p className="text-lg leading-relaxed text-gray-700 lg:text-xl">
              {t('paragraph_1')}
            </p>
          </section>

          {/* Savings Graphic Section */}
          <section className="mb-16">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <Image
                src="/about-savings.png"
                alt="Energy savings and cost reduction visualization"
                width={800}
                height={500}
                className="w-full"
              />
            </div>
          </section>

          {/* Paragraph 2 */}
          <section className="mb-16">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              The Problem We Solve
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 lg:text-xl">
              {t('paragraph_2')}
            </p>
          </section>

          {/* Paragraph 3 */}
          <section className="mb-16">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Our Solution
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 lg:text-xl">
              {t('paragraph_3')}
            </p>
          </section>

          {/* Climate Graphic Section */}
          <section className="mb-16">
            <div className="overflow-hidden rounded-xl shadow-lg">
              <Image
                src="/about-climate.png"
                alt="Climate optimization map showing how PoolCalc adapts to different US climate zones"
                width={800}
                height={500}
                className="w-full"
              />
            </div>
          </section>

          {/* Paragraph 4 */}
          <section className="mb-16">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Our Commitment
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 lg:text-xl">
              {t('paragraph_4')}
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
