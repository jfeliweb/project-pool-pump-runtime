import type { Metadata } from 'next';
import type { AccordionItem } from '@/components/ui/Accordion';
import {
  Calculator,
  Check,
  Droplets,
  Layers,
  LayoutGrid,
  Ruler,
  Waves,
  Zap,
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { PoolTypeCard } from '@/components/marketing/PoolTypeCard';
import { PoolTypeComparisonTable } from '@/components/marketing/PoolTypeComparisonTable';
import { TestimonialCard } from '@/components/marketing/TestimonialCard';
import { Accordion } from '@/components/ui/Accordion';

type IPoolTypesProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: IPoolTypesProps,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'PoolTypes',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: [
      'pool types',
      'in-ground pool',
      'above-ground pool',
      'fiberglass pool',
      'concrete pool',
      'vinyl liner pool',
      'pool pump calculator',
      'which pool type saves energy',
      'pool type electricity costs',
    ],
    openGraph: {
      title: t('meta_title'),
      description: t('meta_description'),
      url: 'https://poolpumpcalc.com/pool-types',
      siteName: 'PoolPumpCalc',
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta_title'),
      description: t('meta_description'),
    },
    alternates: {
      canonical: 'https://poolpumpcalc.com/pool-types',
    },
  };
}

export default async function PoolTypes(props: IPoolTypesProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'PoolTypes',
  });

  const comparisonRows = [
    {
      poolType: t('table_concrete'),
      avgVolume: t('table_concrete_volume'),
      surfaceType: t('table_concrete_surface'),
      runtimeAdjustment: t('table_concrete_adjustment'),
      savingsPotential: t('table_concrete_savings'),
      colorClass: 'from-blue-500 to-blue-600',
    },
    {
      poolType: t('table_fiberglass'),
      avgVolume: t('table_fiberglass_volume'),
      surfaceType: t('table_fiberglass_surface'),
      runtimeAdjustment: t('table_fiberglass_adjustment'),
      savingsPotential: t('table_fiberglass_savings'),
      colorClass: 'from-cyan-500 to-cyan-600',
    },
    {
      poolType: t('table_vinyl'),
      avgVolume: t('table_vinyl_volume'),
      surfaceType: t('table_vinyl_surface'),
      runtimeAdjustment: t('table_vinyl_adjustment'),
      savingsPotential: t('table_vinyl_savings'),
      colorClass: 'from-purple-500 to-purple-600',
    },
    {
      poolType: t('table_aboveground'),
      avgVolume: t('table_aboveground_volume'),
      surfaceType: t('table_aboveground_surface'),
      runtimeAdjustment: t('table_aboveground_adjustment'),
      savingsPotential: t('table_aboveground_savings'),
      colorClass: 'from-emerald-500 to-emerald-600',
    },
  ];

  const faqItems: AccordionItem[] = [
    {
      id: 'different-pump',
      title: t('faq1_question'),
      content: <p>{t('faq1_answer')}</p>,
    },
    {
      id: 'same-runtime',
      title: t('faq2_question'),
      content: <p>{t('faq2_answer')}</p>,
    },
    {
      id: 'concrete-runtime',
      title: t('faq3_question'),
      content: <p>{t('faq3_answer')}</p>,
    },
    {
      id: 'fiberglass-efficient',
      title: t('faq4_question'),
      content: <p>{t('faq4_answer')}</p>,
    },
    {
      id: 'aboveground-manual',
      title: t('faq5_question'),
      content: <p>{t('faq5_answer')}</p>,
    },
  ];

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': 'Pool Types Guide',
            'description': 'Compare different pool types and calculate optimal pump runtime for energy savings.',
            'url': 'https://poolpumpcalc.com/pool-types',
            'mainEntity': {
              '@type': 'FAQPage',
              'mainEntity': [
                {
                  '@type': 'Question',
                  'name': t('faq1_question'),
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('faq1_answer'),
                  },
                },
                {
                  '@type': 'Question',
                  'name': t('faq2_question'),
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('faq2_answer'),
                  },
                },
                {
                  '@type': 'Question',
                  'name': t('faq3_question'),
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('faq3_answer'),
                  },
                },
                {
                  '@type': 'Question',
                  'name': t('faq4_question'),
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('faq4_answer'),
                  },
                },
                {
                  '@type': 'Question',
                  'name': t('faq5_question'),
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': t('faq5_answer'),
                  },
                },
              ],
            },
            'breadcrumb': {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                {
                  '@type': 'ListItem',
                  'position': 1,
                  'name': 'Home',
                  'item': 'https://poolpumpcalc.com',
                },
                {
                  '@type': 'ListItem',
                  'position': 2,
                  'name': 'Pool Types',
                  'item': 'https://poolpumpcalc.com/pool-types',
                },
              ],
            },
          }),
        }}
      />

      {/* Hero Section */}
      <section className="relative flex min-h-[450px] items-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-32 rounded-full bg-white/20 blur-xl" />
          <div className="absolute top-40 right-20 size-24 rounded-full bg-teal-300/30 blur-lg" />
          <div className="absolute bottom-20 left-1/3 size-40 rounded-full bg-blue-300/20 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl leading-tight font-bold text-white lg:text-5xl">
              {t('hero_title')}
            </h1>
            <p className="mt-2 text-xl font-medium text-yellow-300">
              {t('hero_subtitle')}
            </p>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 lg:text-xl">
              {t('hero_description')}
            </p>
            <div className="mt-8">
              <Link
                href="/calculator"
                className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-4 text-lg font-bold text-gray-900 shadow-xl transition-all duration-200 hover:scale-105 hover:from-yellow-300 hover:to-orange-400"
              >
                <Calculator className="mr-3 size-5" />
                {t('hero_cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pool Types Overview Section */}
      <article className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* In-Ground Pools */}
          <section className="mb-20">
            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
              {t('section_inground_title')}
            </h2>
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Concrete Pool Card */}
              <PoolTypeCard
                icon={<Layers className="size-8 text-white" />}
                title={t('concrete_title')}
                subtitle={t('concrete_subtitle')}
                gradientClass="from-blue-500 to-blue-600"
                characteristics={[
                  t('concrete_char1'),
                  t('concrete_char2'),
                  t('concrete_char3'),
                  t('concrete_char4'),
                  t('concrete_char5'),
                ]}
                runtimeImpact={t('concrete_runtime_impact')}
                bestFor={[
                  t('concrete_best1'),
                  t('concrete_best2'),
                  t('concrete_best3'),
                  t('concrete_best4'),
                ]}
                savingsRange={t('concrete_savings')}
              />

              {/* Fiberglass Pool Card */}
              <PoolTypeCard
                icon={<Waves className="size-8 text-white" />}
                title={t('fiberglass_title')}
                subtitle={t('fiberglass_subtitle')}
                gradientClass="from-cyan-500 to-cyan-600"
                characteristics={[
                  t('fiberglass_char1'),
                  t('fiberglass_char2'),
                  t('fiberglass_char3'),
                  t('fiberglass_char4'),
                  t('fiberglass_char5'),
                ]}
                runtimeImpact={t('fiberglass_runtime_impact')}
                bestFor={[
                  t('fiberglass_best1'),
                  t('fiberglass_best2'),
                  t('fiberglass_best3'),
                  t('fiberglass_best4'),
                ]}
                savingsRange={t('fiberglass_savings')}
              />

              {/* Vinyl Liner Pool Card */}
              <PoolTypeCard
                icon={<LayoutGrid className="size-8 text-white" />}
                title={t('vinyl_title')}
                subtitle={t('vinyl_subtitle')}
                gradientClass="from-purple-500 to-purple-600"
                characteristics={[
                  t('vinyl_char1'),
                  t('vinyl_char2'),
                  t('vinyl_char3'),
                  t('vinyl_char4'),
                  t('vinyl_char5'),
                ]}
                runtimeImpact={t('vinyl_runtime_impact')}
                bestFor={[
                  t('vinyl_best1'),
                  t('vinyl_best2'),
                  t('vinyl_best3'),
                  t('vinyl_best4'),
                ]}
                savingsRange={t('vinyl_savings')}
              />

              {/* General In-Ground Info */}
              <div className="flex flex-col justify-center rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-8">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('inground_general_title')}
                </h3>
                <p className="mb-6 leading-relaxed text-gray-700">
                  {t('inground_general_description')}
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="mt-0.5 mr-3 size-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{t('inground_general_point1')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mt-0.5 mr-3 size-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{t('inground_general_point2')}</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mt-0.5 mr-3 size-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{t('inground_general_point3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Above-Ground Pools */}
          <section className="mb-20">
            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
              {t('section_aboveground_title')}
            </h2>
            <div className="mx-auto max-w-2xl">
              <PoolTypeCard
                icon={<Droplets className="size-8 text-white" />}
                title={t('aboveground_title')}
                subtitle={t('aboveground_subtitle')}
                gradientClass="from-emerald-500 to-emerald-600"
                characteristics={[
                  t('aboveground_char1'),
                  t('aboveground_char2'),
                  t('aboveground_char3'),
                  t('aboveground_char4'),
                  t('aboveground_char5'),
                ]}
                runtimeImpact={t('aboveground_runtime_impact')}
                bestFor={[
                  t('aboveground_best1'),
                  t('aboveground_best2'),
                  t('aboveground_best3'),
                  t('aboveground_best4'),
                ]}
                savingsRange={t('aboveground_savings')}
              />
            </div>
          </section>

          {/* Comparison Table Section */}
          <section className="mb-20">
            <h2 className="mb-6 text-center text-4xl font-bold text-gray-900">
              {t('comparison_title')}
            </h2>
            <p className="mx-auto mb-12 max-w-3xl text-center text-lg text-gray-600">
              {t('comparison_description')}
            </p>
            <PoolTypeComparisonTable
              rows={comparisonRows}
              note={t('comparison_note')}
            />
          </section>

          {/* Why Pool Type Matters Section */}
          <section className="mb-20">
            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
              {t('why_matters_title')}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Surface Texture */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-100">
                  <Layers className="size-6 text-amber-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('surface_title')}
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {t('surface_description')}
                </p>
              </div>

              {/* Volume Considerations */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-100">
                  <Droplets className="size-6 text-blue-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('volume_title')}
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {t('volume_description')}
                </p>
              </div>

              {/* Depth Variations */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-purple-100">
                  <Ruler className="size-6 text-purple-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('depth_title')}
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {t('depth_description')}
                </p>
              </div>

              {/* Installation & Structure */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-green-100">
                  <LayoutGrid className="size-6 text-green-600" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('installation_title')}
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {t('installation_description')}
                </p>
              </div>
            </div>
          </section>

          {/* How Our Calculator Optimizes Section */}
          <section className="mb-20 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 p-8 lg:p-12">
            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
              {t('calculator_section_title')}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  1
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  {t('step1_title')}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t('step1_description')}
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-cyan-600 text-lg font-bold text-white">
                  2
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  {t('step2_title')}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t('step2_description')}
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
                  3
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  {t('step3_title')}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t('step3_description')}
                </p>
              </div>

              {/* Step 4 */}
              <div className="rounded-xl bg-white p-6 shadow-md">
                <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white">
                  4
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900">
                  {t('step4_title')}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t('step4_description')}
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/calculator"
                className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 px-8 py-4 text-lg font-bold text-white shadow-xl transition-all duration-200 hover:scale-105 hover:from-blue-500 hover:to-teal-500"
              >
                <Calculator className="mr-3 size-5" />
                {t('try_calculator_cta')}
              </Link>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="mb-20">
            <h2 className="mb-12 text-center text-4xl font-bold text-gray-900">
              {t('testimonials_title')}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              <TestimonialCard
                quote={t('testimonial1_quote')}
                text={t('testimonial1_text')}
                author={t('testimonial1_author')}
                pool={t('testimonial1_pool')}
                savings={[
                  { label: t('testimonial1_label1'), value: t('testimonial1_value1') },
                  { label: t('testimonial1_label2'), value: t('testimonial1_value2') },
                ]}
              />
              <TestimonialCard
                quote={t('testimonial2_quote')}
                text={t('testimonial2_text')}
                author={t('testimonial2_author')}
                pool={t('testimonial2_pool')}
                savings={[
                  { label: t('testimonial2_label1'), value: t('testimonial2_value1') },
                  { label: t('testimonial2_label2'), value: t('testimonial2_value2') },
                ]}
              />
              <TestimonialCard
                quote={t('testimonial3_quote')}
                text={t('testimonial3_text')}
                author={t('testimonial3_author')}
                pool={t('testimonial3_pool')}
                savings={[
                  { label: t('testimonial3_label1'), value: t('testimonial3_value1') },
                  { label: t('testimonial3_label2'), value: t('testimonial3_value2') },
                ]}
              />
              <TestimonialCard
                quote={t('testimonial4_quote')}
                text={t('testimonial4_text')}
                author={t('testimonial4_author')}
                pool={t('testimonial4_pool')}
                savings={[
                  { label: t('testimonial4_label1'), value: t('testimonial4_value1') },
                  { label: t('testimonial4_label2'), value: t('testimonial4_value2') },
                ]}
              />
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-20">
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                {t('faq_title')}
              </h2>
              <Accordion items={faqItems} />
            </div>
          </section>
        </div>
      </article>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-teal-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            {t('final_cta_title')}
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            {t('final_cta_subtitle')}
          </p>

          {/* Features List */}
          <div className="mb-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center space-x-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <Check className="size-5 flex-shrink-0 text-yellow-300" />
              <span className="text-white">{t('feature1')}</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <Check className="size-5 flex-shrink-0 text-yellow-300" />
              <span className="text-white">{t('feature2')}</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <Check className="size-5 flex-shrink-0 text-yellow-300" />
              <span className="text-white">{t('feature3')}</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <Check className="size-5 flex-shrink-0 text-yellow-300" />
              <span className="text-white">{t('feature4')}</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <Check className="size-5 flex-shrink-0 text-yellow-300" />
              <span className="text-white">{t('feature5')}</span>
            </div>
            <div className="flex items-center space-x-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
              <Zap className="size-5 flex-shrink-0 text-yellow-300" />
              <span className="text-white">{t('feature6')}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/calculator"
              className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-12 py-4 text-xl font-bold text-gray-900 shadow-2xl transition-all duration-200 hover:scale-105 hover:from-yellow-300 hover:to-orange-400"
            >
              <Calculator className="mr-3 size-6" />
              {t('final_cta_button')}
            </Link>
          </div>

          <p className="mt-6 text-sm text-blue-200">
            {t('trust_badges')}
          </p>
        </div>
      </section>
    </>
  );
}
