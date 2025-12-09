import { boolean, decimal, integer, pgTable, serial, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the Next.js initialization process through `instrumentation.ts`.
// Simply restart your Next.js server to apply the database changes.
// Alternatively, if your database is running, you can run `npm run db:migrate` and there is no need to restart the server.

// Need a database for production? Check out https://www.prisma.io/?via=nextjsboilerplate
// Tested and compatible with Next.js Boilerplate

export const counterSchema = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// User Pools Table - Stores pool configurations and optimization results
export const userPoolsTable = pgTable('user_pools', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  poolName: varchar('pool_name', { length: 100 }).default('My Pool').notNull(),

  // Pool specifications
  poolLength: decimal('pool_length', { precision: 5, scale: 2 }).notNull(),
  poolWidth: decimal('pool_width', { precision: 5, scale: 2 }).notNull(),
  poolDepthShallow: decimal('pool_depth_shallow', { precision: 4, scale: 2 }).notNull(),
  poolDepthDeep: decimal('pool_depth_deep', { precision: 4, scale: 2 }).notNull(),
  poolShape: varchar('pool_shape', { length: 20 }).notNull(), // rectangular, kidney, freeform, oval, round
  poolType: varchar('pool_type', { length: 20 }).notNull(), // in-ground, above-ground
  poolVolume: integer('pool_volume').notNull(), // calculated in gallons

  // Pump specifications
  pumpType: varchar('pump_type', { length: 30 }).notNull(), // single-speed, two-speed, variable-speed
  pumpHorsepower: decimal('pump_horsepower', { precision: 3, scale: 2 }).notNull(),
  pumpAgeYears: integer('pump_age_years').notNull(),
  pumpFlowRate: decimal('pump_flow_rate', { precision: 6, scale: 2 }), // GPM
  variableSpeedLowRPM: integer('variable_speed_low_rpm'),
  variableSpeedMediumRPM: integer('variable_speed_medium_rpm'),
  variableSpeedHighRPM: integer('variable_speed_high_rpm'),

  // Location data
  zipCode: varchar('zip_code', { length: 10 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  city: varchar('city', { length: 100 }),
  climateZone: varchar('climate_zone', { length: 30 }).notNull(),
  latitude: decimal('latitude', { precision: 10, scale: 7 }),
  longitude: decimal('longitude', { precision: 10, scale: 7 }),

  // Usage factors
  usageLevel: varchar('usage_level', { length: 20 }).notNull(), // light, moderate, heavy
  averageSwimmers: integer('average_swimmers').notNull(),
  landscaping: varchar('landscaping', { length: 20 }).notNull(), // minimal, moderate, heavy
  screenEnclosure: boolean('screen_enclosure').notNull().default(false),
  hasWaterfall: boolean('has_waterfall').notNull().default(false),
  hasHeater: boolean('has_heater').notNull().default(false),
  hasSaltSystem: boolean('has_salt_system').notNull().default(false),
  waterClarity: varchar('water_clarity', { length: 30 }).notNull(), // crystal-clear, slightly-cloudy, cloudy

  // Energy data
  electricityRate: decimal('electricity_rate', { precision: 5, scale: 3 }).notNull(),
  hasTimeOfUsePricing: boolean('has_time_of_use_pricing').default(false),
  touPeakRate: decimal('tou_peak_rate', { precision: 5, scale: 3 }),
  touOffPeakRate: decimal('tou_off_peak_rate', { precision: 5, scale: 3 }),
  touPeakHoursStart: integer('tou_peak_hours_start'),
  touPeakHoursEnd: integer('tou_peak_hours_end'),
  currentDailyRuntime: decimal('current_daily_runtime', { precision: 4, scale: 2 }).notNull(),

  // Calculated results
  requiredTurnovers: decimal('required_turnovers', { precision: 3, scale: 2 }),
  recommendedRuntime: decimal('recommended_runtime', { precision: 4, scale: 2 }),
  dailyCost: decimal('daily_cost', { precision: 8, scale: 2 }),
  monthlyCost: decimal('monthly_cost', { precision: 8, scale: 2 }),
  annualCost: decimal('annual_cost', { precision: 8, scale: 2 }),
  currentDailyCost: decimal('current_daily_cost', { precision: 8, scale: 2 }),
  currentMonthlyCost: decimal('current_monthly_cost', { precision: 8, scale: 2 }),
  currentAnnualCost: decimal('current_annual_cost', { precision: 8, scale: 2 }),
  dailySavings: decimal('daily_savings', { precision: 8, scale: 2 }),
  monthlySavings: decimal('monthly_savings', { precision: 8, scale: 2 }),
  annualSavings: decimal('annual_savings', { precision: 8, scale: 2 }),
  percentReduction: decimal('percent_reduction', { precision: 5, scale: 2 }),
  dailyKwh: decimal('daily_kwh', { precision: 8, scale: 2 }),
  monthlyKwh: decimal('monthly_kwh', { precision: 8, scale: 2 }),
  annualKwh: decimal('annual_kwh', { precision: 8, scale: 2 }),

  // Schedule data (JSON string)
  scheduleBlocks: varchar('schedule_blocks', { length: 2000 }), // JSON array of schedule blocks

  // Metadata
  isPrimary: boolean('is_primary').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// User Settings Table - Stores user preferences and default values
export const userSettingsTable = pgTable('user_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull().unique(),

  // Account information
  fullName: varchar('full_name', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  defaultLocation: varchar('default_location', { length: 100 }),

  // Calculator preferences
  defaultElectricityRate: decimal('default_electricity_rate', { precision: 5, scale: 3 }).default('0.14').notNull(),
  defaultPumpType: varchar('default_pump_type', { length: 50 }),
  measurementUnits: varchar('measurement_units', { length: 10 }).default('gallons').notNull(), // gallons, liters
  autoCalculate: boolean('auto_calculate').default(false).notNull(),

  // Notification preferences
  emailNotifications: boolean('email_notifications').default(true).notNull(),
  maintenanceReminders: boolean('maintenance_reminders').default(true).notNull(),
  weeklyReports: boolean('weekly_reports').default(false).notNull(),
  seasonalAlerts: boolean('seasonal_alerts').default(true).notNull(),
  savingsMilestones: boolean('savings_milestones').default(true).notNull(),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Users Table - Stores user data and subscription information
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull(),

  // Subscription fields
  subscriptionStatus: varchar('subscription_status', { length: 20 }).default('free'),
  subscriptionTier: varchar('subscription_tier', { length: 20 }).default('free'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  subscriptionStartDate: timestamp('subscription_start_date'),
  subscriptionEndDate: timestamp('subscription_end_date'),
  subscriptionCancelAtPeriodEnd: boolean('subscription_cancel_at_period_end').default(false),

  // Metadata
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Subscriptions Table - Track subscription events and history
export const subscriptionsTable = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),
  planType: varchar('plan_type', { length: 20 }), // 'annual' or 'monthly'
  status: varchar('status', { length: 20 }), // 'active', 'canceled', 'past_due'
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// PDF Downloads Table - Track PDF downloads for analytics
export const pdfDownloadsTable = pgTable('pdf_downloads', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id),
  poolId: uuid('pool_id').references(() => userPoolsTable.id),
  downloadedAt: timestamp('downloaded_at').defaultNow().notNull(),
});

// Affiliate Clicks Table - Track affiliate link clicks
export const affiliateClicksTable = pgTable('affiliate_clicks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => usersTable.id),
  productId: varchar('product_id', { length: 100 }),
  productName: varchar('product_name', { length: 255 }),
  affiliateNetwork: varchar('affiliate_network', { length: 50 }), // 'amazon' or 'homedepot'
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 500 }),
});

// Type exports
export type UserPool = typeof userPoolsTable.$inferSelect;
export type NewUserPool = typeof userPoolsTable.$inferInsert;
export type UserSettings = typeof userSettingsTable.$inferSelect;
export type NewUserSettings = typeof userSettingsTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Subscription = typeof subscriptionsTable.$inferSelect;
export type NewSubscription = typeof subscriptionsTable.$inferInsert;
export type PdfDownload = typeof pdfDownloadsTable.$inferSelect;
export type NewPdfDownload = typeof pdfDownloadsTable.$inferInsert;
export type AffiliateClick = typeof affiliateClicksTable.$inferSelect;
export type NewAffiliateClick = typeof affiliateClicksTable.$inferInsert;
