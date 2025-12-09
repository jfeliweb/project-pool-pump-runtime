CREATE TABLE "affiliate_clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"product_id" varchar(100),
	"product_name" varchar(255),
	"affiliate_network" varchar(50),
	"clicked_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45),
	"user_agent" varchar(500)
);
--> statement-breakpoint
CREATE TABLE "pdf_downloads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"pool_id" uuid,
	"downloaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"stripe_subscription_id" varchar(255),
	"stripe_customer_id" varchar(255),
	"stripe_price_id" varchar(255),
	"plan_type" varchar(20),
	"status" varchar(20),
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"subscription_status" varchar(20) DEFAULT 'free',
	"subscription_tier" varchar(20) DEFAULT 'free',
	"stripe_customer_id" varchar(255),
	"stripe_subscription_id" varchar(255),
	"subscription_start_date" timestamp,
	"subscription_end_date" timestamp,
	"subscription_cancel_at_period_end" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id")
);
--> statement-breakpoint
ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "affiliate_clicks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_downloads" ADD CONSTRAINT "pdf_downloads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pdf_downloads" ADD CONSTRAINT "pdf_downloads_pool_id_user_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."user_pools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;