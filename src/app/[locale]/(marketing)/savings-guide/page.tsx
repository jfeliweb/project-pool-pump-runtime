import type { Metadata } from 'next';
import { Calculator, Check, Clock, DollarSign, MapPin, Zap } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ClimateMap } from '@/components/marketing/ClimateMap';
import { CostComparisonChart } from '@/components/marketing/CostComparisonChart';
import { ROICalculator } from '@/components/marketing/ROICalculator';
import { SavingsCallout } from '@/components/marketing/SavingsCallout';
import { SavingsStats } from '@/components/marketing/SavingsStats';
import { ScheduleTimeline } from '@/components/marketing/ScheduleTimeline';
import { SeasonalCalendar } from '@/components/marketing/SeasonalCalendar';
import { TestimonialCard } from '@/components/marketing/TestimonialCard';

type ISavingsGuideProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  props: ISavingsGuideProps,
): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'SavingsGuide',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: [
      'pool pump savings',
      'reduce pool electricity costs',
      'pool pump energy efficiency',
      'variable speed pump savings',
      'pool pump schedule optimization',
      'lower pool maintenance costs',
      'how much money can I save with variable speed pump',
      'best pool pump schedule for energy savings',
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

export default async function SavingsGuide(props: ISavingsGuideProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const t = await getTranslations({
    locale,
    namespace: 'SavingsGuide',
  });

  // Mock data for visual components
  const heroStats = [
    {
      icon: <DollarSign className="size-8" />,
      value: t('hero_stat_savings'),
      label: t('hero_stat_savings_label'),
    },
    {
      icon: <Zap className="size-8" />,
      value: t('hero_stat_reduction'),
      label: t('hero_stat_reduction_label'),
    },
    {
      icon: <MapPin className="size-8" />,
      value: t('hero_stat_states'),
      label: t('hero_stat_states_label'),
    },
    {
      icon: <Clock className="size-8" />,
      value: t('hero_stat_runtime'),
      label: t('hero_stat_runtime_label'),
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
            '@type': 'HowTo',
            'name': 'How to Save Money on Pool Pump Electricity',
            'description': 'Complete guide to reducing pool pump electricity costs',
            'totalTime': 'PT30M',
            'estimatedCost': {
              '@type': 'MonetaryAmount',
              'currency': 'USD',
              'value': '0',
            },
            'step': [
              {
                '@type': 'HowToStep',
                'name': 'Calculate current costs',
                'text': 'Use PoolCalc to assess your current pump electricity consumption',
              },
              {
                '@type': 'HowToStep',
                'name': 'Optimize runtime schedule',
                'text': 'Implement climate-optimized schedule reducing daily runtime by 50%',
              },
              {
                '@type': 'HowToStep',
                'name': 'Consider variable-speed upgrade',
                'text': 'Evaluate ROI for variable-speed pump with utility rebates',
              },
            ],
          }),
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
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
              {
                '@type': 'Question',
                'name': t('faq6_question'),
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': t('faq6_answer'),
                },
              },
            ],
          }),
        }}
      />

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
            <div className="mt-8">
              <SavingsStats stats={heroStats} />
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Understanding Your Pool Pump Costs */}
      <article className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <section className="mb-16">
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              {t('section1_title')}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 lg:text-xl">
              {t('section1_content')}
            </p>

            <div className="mb-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
                <div className="mb-2 text-sm font-semibold text-red-600">
                  {t('section1_stat_single_label')}
                </div>
                <div className="text-2xl font-bold text-red-700">
                  {t('section1_stat_single')}
                </div>
              </div>
              <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                <div className="mb-2 text-sm font-semibold text-green-600">
                  {t('section1_stat_variable_label')}
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {t('section1_stat_variable')}
                </div>
              </div>
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                <div className="mb-2 text-sm font-semibold text-blue-600">
                  {t('section1_stat_optimized_label')}
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {t('section1_stat_optimized')}
                </div>
              </div>
            </div>

            <CostComparisonChart
              before={{
                label: 'Traditional Schedule',
                monthly: '$85/month',
                annual: '$1,020/year',
              }}
              after={{
                label: 'Optimized Schedule',
                monthly: '$50/month',
                annual: '$600/year',
              }}
              savings={{
                monthly: '$35/month',
                annual: '$420/year',
              }}
            />

            <div className="mt-8 text-center">
              <Link
                href="/calculator"
                className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-3 text-lg font-bold text-gray-900 shadow-xl transition-all duration-200 hover:scale-105 hover:from-yellow-300 hover:to-orange-400"
              >
                <Calculator className="mr-3 size-5" />
                {t('section1_cta')}
                {' '}
                →
              </Link>
            </div>
          </section>

          {/* Section 2: Three Pillars */}
          <section className="mb-16">
            <h2 className="mb-12 text-4xl font-bold text-gray-900">
              {t('section2_title')}
            </h2>

            {/* Pillar 1: Runtime Optimization */}
            <div className="mb-12 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-lg">
              <h3 className="mb-4 text-3xl font-bold text-gray-900">
                {t('pillar1_title')}
              </h3>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {t('pillar1_content')}
              </p>
              <ul className="mb-6 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar1_factor1')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar1_factor2')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar1_factor3')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar1_factor4')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar1_factor5')}</span>
                </li>
              </ul>
              <ScheduleTimeline
                traditional={[
                  { start: 0, end: 18, type: 'on', label: 'Running' },
                  { start: 18, end: 24, type: 'off', label: 'Off' },
                ]}
                optimized={[
                  { start: 0, end: 4, type: 'offpeak', label: 'Off-Peak' },
                  { start: 4, end: 12, type: 'on', label: 'Running' },
                  { start: 12, end: 20, type: 'off', label: 'Off' },
                  { start: 20, end: 24, type: 'offpeak', label: 'Off-Peak' },
                ]}
                touRates={{
                  peak: { start: 14, end: 19, rate: '$0.25-$0.40/kWh' },
                  offpeak: { start: 23, end: 7, rate: '$0.08-$0.15/kWh' },
                }}
              />
              <div className="mt-6">
                <SavingsCallout text={t('pillar1_savings')} variant="success" />
              </div>
            </div>

            {/* Pillar 2: TOU Pricing */}
            <div className="mb-12 rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-8 shadow-lg">
              <h3 className="mb-4 text-3xl font-bold text-gray-900">
                {t('pillar2_title')}
              </h3>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {t('pillar2_content')}
              </p>
              <div className="mb-6 space-y-3">
                <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
                  <div className="font-semibold text-red-900">
                    {t('pillar2_peak')}
                  </div>
                  <div className="text-red-700">{t('pillar2_peak_detail')}</div>
                </div>
                <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                  <div className="font-semibold text-green-900">
                    {t('pillar2_offpeak')}
                  </div>
                  <div className="text-green-700">
                    {t('pillar2_offpeak_detail')}
                  </div>
                </div>
                <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4">
                  <div className="font-semibold text-yellow-900">
                    {t('pillar2_shoulder')}
                  </div>
                  <div className="text-yellow-700">
                    {t('pillar2_shoulder_detail')}
                  </div>
                </div>
              </div>
              <SavingsCallout
                text={t('pillar2_tou_savings')}
                variant="info"
              />
            </div>

            {/* Pillar 3: Variable-Speed */}
            <div className="mb-12 rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 shadow-lg">
              <h3 className="mb-4 text-3xl font-bold text-gray-900">
                {t('pillar3_title')}
              </h3>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {t('pillar3_content')}
              </p>
              <ul className="mb-8 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar3_benefit1')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar3_benefit2')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar3_benefit3')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar3_benefit4')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('pillar3_benefit5')}</span>
                </li>
              </ul>
              <ROICalculator
                initialCost={t('pillar3_roi_cost')}
                annualSavings={t('pillar3_roi_savings')}
                paybackPeriod={t('pillar3_roi_payback')}
                fiveYearSavings={t('pillar3_roi_5year')}
                tenYearSavings={t('pillar3_roi_10year')}
              />
              <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                <SavingsCallout text={t('pillar3_rebate_ca')} variant="info" />
                <SavingsCallout text={t('pillar3_rebate_az')} variant="info" />
                <SavingsCallout text={t('pillar3_rebate_fl')} variant="info" />
                <SavingsCallout text={t('pillar3_rebate_tx')} variant="info" />
              </div>
            </div>
          </section>

          {/* Section 3: Climate Optimization */}
          <section className="mb-16">
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              {t('section3_title')}
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-700 lg:text-xl">
              {t('section3_content')}
            </p>
            <ul className="mb-8 space-y-2 text-gray-700">
              <li className="flex items-start">
                <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                <span>{t('section3_factor1')}</span>
              </li>
              <li className="flex items-start">
                <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                <span>{t('section3_factor2')}</span>
              </li>
              <li className="flex items-start">
                <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                <span>{t('section3_factor3')}</span>
              </li>
              <li className="flex items-start">
                <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                <span>{t('section3_factor4')}</span>
              </li>
              <li className="flex items-start">
                <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                <span>{t('section3_factor5')}</span>
              </li>
            </ul>
            <ClimateMap
              topStates={[
                { state: 'California', savings: t('section3_top1') },
                { state: 'Arizona', savings: t('section3_top2') },
                { state: 'Florida', savings: t('section3_top3') },
                { state: 'Texas', savings: t('section3_top4') },
                { state: 'Nevada', savings: t('section3_top5') },
              ]}
              climateZones={[
                {
                  name: t('section3_zone_hot_humid'),
                  states: 'FL, TX, LA',
                  savings: t('section3_zone_hot_humid_savings'),
                },
                {
                  name: t('section3_zone_hot_dry'),
                  states: 'AZ, NV, CA',
                  savings: t('section3_zone_hot_dry_savings'),
                },
                {
                  name: t('section3_zone_moderate'),
                  states: 'NC, GA, SC',
                  savings: t('section3_zone_moderate_savings'),
                },
                {
                  name: t('section3_zone_northern'),
                  states: 'NY, PA, OH',
                  savings: t('section3_zone_northern_savings'),
                },
              ]}
            />
          </section>

          {/* Section 4: Advanced Strategies */}
          <section className="mb-16">
            <h2 className="mb-6 text-4xl font-bold text-gray-900">
              {t('section4_title')}
            </h2>

            {/* Strategy 1 */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                {t('strategy1_title')}
              </h3>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {t('strategy1_content')}
              </p>
              <ul className="mb-4 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('strategy1_low')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('strategy1_medium')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('strategy1_high')}</span>
                </li>
              </ul>
              <SavingsCallout text={t('strategy1_impact')} variant="success" />
            </div>

            {/* Strategy 2 */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                {t('strategy2_title')}
              </h3>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {t('strategy2_content')}
              </p>
              <SeasonalCalendar
                seasons={[
                  {
                    name: t('strategy2_summer_title'),
                    months: 'June-August',
                    cost: t('strategy2_summer_cost'),
                    savings: t('strategy2_summer_savings'),
                    description: t('strategy2_summer_detail'),
                  },
                  {
                    name: t('strategy2_springfall_title'),
                    months: 'Mar-May, Sep-Nov',
                    cost: t('strategy2_springfall_cost'),
                    savings: t('strategy2_springfall_savings'),
                    description: t('strategy2_springfall_detail'),
                  },
                  {
                    name: t('strategy2_winter_title'),
                    months: 'Dec-Feb',
                    cost: t('strategy2_winter_cost'),
                    savings: t('strategy2_winter_savings'),
                    description: t('strategy2_winter_detail'),
                  },
                ]}
                annualSavings={t('strategy2_annual')}
              />
            </div>

            {/* Strategy 3 */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                {t('strategy3_title')}
              </h3>
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                {t('strategy3_content')}
              </p>
              <ul className="mb-4 space-y-2 text-gray-700">
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('strategy3_task1')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('strategy3_task2')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('strategy3_task3')}</span>
                </li>
                <li className="flex items-start">
                  <Check className="mt-1 mr-2 size-5 flex-shrink-0 text-green-600" />
                  <span>{t('strategy3_task4')}</span>
                </li>
              </ul>
              <SavingsCallout text={t('strategy3_impact')} variant="success" />
            </div>
          </section>

          {/* Section 5: Success Stories */}
          <section className="mb-16">
            <h2 className="mb-12 text-4xl font-bold text-gray-900">
              {t('section5_title')}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <TestimonialCard
                quote={t('testimonial1_quote')}
                text={t('testimonial1_text')}
                author={t('testimonial1_author')}
                pool={t('testimonial1_pool')}
                savings={[
                  {
                    label: t('testimonial1_before'),
                    value: 'Before',
                  },
                  {
                    label: t('testimonial1_after'),
                    value: 'After',
                  },
                  {
                    label: t('testimonial1_savings_label'),
                    value: t('testimonial1_savings'),
                  },
                  {
                    label: t('testimonial1_5year_label'),
                    value: t('testimonial1_5year'),
                  },
                ]}
              />
              <TestimonialCard
                quote={t('testimonial2_quote')}
                text={t('testimonial2_text')}
                author={t('testimonial2_author')}
                pool={t('testimonial2_pool')}
                savings={[
                  {
                    label: t('testimonial2_before'),
                    value: 'Before',
                  },
                  {
                    label: t('testimonial2_after'),
                    value: 'After',
                  },
                  {
                    label: t('testimonial2_monthly_label'),
                    value: t('testimonial2_monthly'),
                  },
                  {
                    label: t('testimonial2_annual_label'),
                    value: t('testimonial2_annual'),
                  },
                ]}
              />
              <TestimonialCard
                quote={t('testimonial3_quote')}
                text={t('testimonial3_text')}
                author={t('testimonial3_author')}
                pool={t('testimonial3_pool')}
                savings={[
                  {
                    label: t('testimonial3_cost_label'),
                    value: t('testimonial3_cost'),
                  },
                  {
                    label: t('testimonial3_monthly_label'),
                    value: t('testimonial3_monthly'),
                  },
                  {
                    label: t('testimonial3_payback_label'),
                    value: t('testimonial3_payback'),
                  },
                  {
                    label: t('testimonial3_10year_label'),
                    value: t('testimonial3_10year'),
                  },
                ]}
              />
            </div>
          </section>

          {/* Section 6: Action Plan */}
          <section className="mb-16 rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 shadow-lg">
            <h2 className="mb-8 text-4xl font-bold text-gray-900">
              {t('section6_title')}
            </h2>

            <div className="space-y-8">
              {/* Week 1 */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('week1_title')}
                </h3>
                <div className="mb-4">
                  <div className="mb-2 font-semibold text-gray-800">
                    {t('week1_day1')}
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-gray-700">
                    <li>{t('week1_day1_detail1')}</li>
                    <li>{t('week1_day1_detail2')}</li>
                    <li>{t('week1_day1_detail3')}</li>
                    <li>{t('week1_day1_detail4')}</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <div className="mb-2 font-semibold text-gray-800">
                    {t('week1_day2')}
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-gray-700">
                    <li>{t('week1_day2_detail1')}</li>
                    <li>{t('week1_day2_detail2')}</li>
                    <li>{t('week1_day2_detail3')}</li>
                    <li>{t('week1_day2_detail4')}</li>
                  </ul>
                </div>
                <SavingsCallout text={t('week1_outcome')} variant="info" />
              </div>

              {/* Week 2 */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('week2_title')}
                </h3>
                <div className="mb-4">
                  <div className="mb-2 font-semibold text-gray-800">
                    {t('week2_day1')}
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-gray-700">
                    <li>{t('week2_day1_detail1')}</li>
                    <li>{t('week2_day1_detail2')}</li>
                    <li>{t('week2_day1_detail3')}</li>
                    <li>{t('week2_day1_detail4')}</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <div className="mb-2 font-semibold text-gray-800">
                    {t('week2_day2')}
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-gray-700">
                    <li>{t('week2_day2_detail1')}</li>
                    <li>{t('week2_day2_detail2')}</li>
                    <li>{t('week2_day2_detail3')}</li>
                    <li>{t('week2_day2_detail4')}</li>
                  </ul>
                </div>
                <SavingsCallout text={t('week2_outcome')} variant="success" />
              </div>

              {/* Week 3 */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('week3_title')}
                </h3>
                <div className="mb-4">
                  <div className="mb-2 font-semibold text-gray-800">
                    {t('week3_day1')}
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-gray-700">
                    <li>{t('week3_day1_detail1')}</li>
                    <li>{t('week3_day1_detail2')}</li>
                    <li>{t('week3_day1_detail3')}</li>
                    <li>{t('week3_day1_detail4')}</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <div className="mb-2 font-semibold text-gray-800">
                    {t('week3_day2')}
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-gray-700">
                    <li>{t('week3_day2_detail1')}</li>
                    <li>{t('week3_day2_detail2')}</li>
                    <li>{t('week3_day2_detail3')}</li>
                    <li>{t('week3_day2_detail4')}</li>
                  </ul>
                </div>
                <SavingsCallout text={t('week3_outcome')} variant="info" />
              </div>

              {/* Week 4 */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  {t('week4_title')}
                </h3>
                <div className="mb-4">
                  <div className="mb-2 font-semibold text-gray-800">
                    {t('week4_day1')}
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-gray-700">
                    <li>{t('week4_day1_detail1')}</li>
                    <li>{t('week4_day1_detail2')}</li>
                    <li>{t('week4_day1_detail3')}</li>
                    <li>{t('week4_day1_detail4')}</li>
                  </ul>
                </div>
                <div className="mb-4">
                  <div className="mb-2 font-semibold text-gray-800">
                    {t('week4_day2')}
                  </div>
                  <ul className="ml-4 list-disc space-y-1 text-gray-700">
                    <li>{t('week4_day2_detail1')}</li>
                    <li>{t('week4_day2_detail2')}</li>
                    <li>{t('week4_day2_detail3')}</li>
                    <li>{t('week4_day2_detail4')}</li>
                  </ul>
                </div>
                <SavingsCallout text={t('week4_outcome')} variant="success" />
              </div>
            </div>
          </section>

          {/* Section 7: Common Mistakes */}
          <section className="mb-16">
            <h2 className="mb-12 text-4xl font-bold text-gray-900">
              {t('section7_title')}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  title: t('mistake1_title'),
                  error: t('mistake1_error'),
                  reality: t('mistake1_reality'),
                  fix: t('mistake1_fix'),
                  impact: t('mistake1_impact'),
                },
                {
                  title: t('mistake2_title'),
                  error: t('mistake2_error'),
                  reality: t('mistake2_reality'),
                  fix: t('mistake2_fix'),
                  impact: t('mistake2_impact'),
                },
                {
                  title: t('mistake3_title'),
                  error: t('mistake3_error'),
                  reality: t('mistake3_reality'),
                  fix: t('mistake3_fix'),
                  impact: t('mistake3_impact'),
                },
                {
                  title: t('mistake4_title'),
                  error: t('mistake4_error'),
                  reality: t('mistake4_reality'),
                  fix: t('mistake4_fix'),
                  impact: t('mistake4_impact'),
                },
                {
                  title: t('mistake5_title'),
                  error: t('mistake5_error'),
                  reality: t('mistake5_reality'),
                  fix: t('mistake5_fix'),
                  impact: t('mistake5_impact'),
                },
              ].map(mistake => (
                <div
                  key={mistake.title}
                  className="rounded-xl border-2 border-red-200 bg-red-50 p-6"
                >
                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    {mistake.title}
                  </h3>
                  <div className="mb-3 rounded bg-red-100 p-3">
                    <div className="mb-1 text-sm font-semibold text-red-800">
                      {mistake.error}
                    </div>
                  </div>
                  <div className="mb-3 text-gray-700">{mistake.reality}</div>
                  <div className="mb-3 rounded bg-green-100 p-3">
                    <div className="mb-1 text-sm font-semibold text-green-800">
                      {mistake.fix}
                    </div>
                  </div>
                  <SavingsCallout
                    text={mistake.impact}
                    variant="warning"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: FAQ */}
          <section className="mb-16">
            <h2 className="mb-12 text-4xl font-bold text-gray-900">
              {t('section8_title')}
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: t('faq1_question'),
                  a: t('faq1_answer'),
                },
                {
                  q: t('faq2_question'),
                  a: t('faq2_answer'),
                },
                {
                  q: t('faq3_question'),
                  a: t('faq3_answer'),
                },
                {
                  q: t('faq4_question'),
                  a: t('faq4_answer'),
                },
                {
                  q: t('faq5_question'),
                  a: t('faq5_answer'),
                },
                {
                  q: t('faq6_question'),
                  a: t('faq6_answer'),
                },
              ].map(faq => (
                <div
                  key={faq.q}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg"
                >
                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    {faq.q}
                  </h3>
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>

      {/* Section 9: Final CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-teal-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            {t('section9_title')}
          </h2>
          <p className="mb-8 text-xl text-blue-100">
            {t('section9_subtitle')}
          </p>

          <div className="mb-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-yellow-300">1</div>
              <div className="mb-2 text-lg font-semibold text-white">
                {t('section9_step1')}
              </div>
              <div className="text-sm text-blue-100">
                {t('section9_step1_detail')}
              </div>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-yellow-300">2</div>
              <div className="mb-2 text-lg font-semibold text-white">
                {t('section9_step2')}
              </div>
              <div className="text-sm text-blue-100">
                {t('section9_step2_detail')}
              </div>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-2 text-3xl font-bold text-yellow-300">3</div>
              <div className="mb-2 text-lg font-semibold text-white">
                {t('section9_step3')}
              </div>
              <div className="text-sm text-blue-100">
                {t('section9_step3_detail')}
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-blue-200">
            <div className="flex items-center">
              <Check className="mr-2 size-5" />
              <span>{t('section9_trust1')}</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 size-5" />
              <span>{t('section9_trust2')}</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 size-5" />
              <span>{t('section9_trust3')}</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 size-5" />
              <span>{t('section9_trust4')}</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 size-5" />
              <span>{t('section9_trust5')}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/calculator"
              className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-12 py-4 text-xl font-bold text-gray-900 shadow-2xl transition-all duration-200 hover:scale-105 hover:from-yellow-300 hover:to-orange-400"
            >
              <Calculator className="mr-3 size-6" />
              {t('section9_cta_primary')}
              {' '}
              →
            </Link>
            <Link
              href="#"
              className="inline-flex items-center rounded-xl border-2 border-white bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
            >
              {t('section9_cta_secondary')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
