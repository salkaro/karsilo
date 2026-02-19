export interface HelpArticle {
  title: string;
  description: string;
  category: string;
  categorySlug: string;
  sections: { heading: string; body: string }[];
  relatedArticles: { title: string; href: string }[];
}

export const helpArticles: Record<string, Record<string, HelpArticle>> = {
  "getting-started": {
    "creating-your-account": {
      title: "Creating Your Account",
      description:
        "Learn how to sign up for Karsilo and get started with multi-Stripe account monitoring in minutes.",
      category: "Getting Started",
      categorySlug: "getting-started",
      sections: [
        {
          heading: "Sign up with email or Google",
          body: "Head to karsilo.com and click Get Started. You can create an account using your email address or sign in directly with Google. If you use email, you'll receive a verification link to confirm your address before proceeding.",
        },
        {
          heading: "Choose your plan",
          body: "After verifying your email, you'll be prompted to select a plan. The free tier lets you connect one Stripe account and access basic analytics. Paid plans unlock unlimited connections, advanced reports, and team collaboration features. You can always upgrade later from the billing page.",
        },
        {
          heading: "Complete your profile",
          body: "Fill in your company name, timezone, and preferred currency. These settings determine how your dashboard displays revenue figures and timestamps. You can update them at any time from account settings.",
        },
        {
          heading: "Next steps",
          body: "Once your account is ready, connect your first Stripe account using OAuth. The connection takes under 30 seconds, and your historical data will begin syncing immediately. Check the 'Connecting your first Stripe account' guide for a step-by-step walkthrough.",
        },
      ],
      relatedArticles: [
        {
          title: "Connecting your first Stripe account",
          href: "/resources/getting-started/connecting-your-first-stripe-account",
        },
        {
          title: "Understanding your dashboard",
          href: "/resources/getting-started/understanding-your-dashboard",
        },
        {
          title: "Setting up notifications",
          href: "/resources/getting-started/setting-up-notifications",
        },
      ],
    },
    "connecting-your-first-stripe-account": {
      title: "Connecting Your First Stripe Account",
      description:
        "A step-by-step guide to linking your Stripe account to Karsilo using secure OAuth.",
      category: "Getting Started",
      categorySlug: "getting-started",
      sections: [
        {
          heading: "Start the connection flow",
          body: "From your Karsilo dashboard, click the 'Add Stripe Account' button. This opens Stripe's official OAuth authorization page where you can select which Stripe account to connect. Karsilo never sees or stores your Stripe credentials.",
        },
        {
          heading: "Authorize Karsilo",
          body: "On the Stripe authorization page, review the permissions Karsilo is requesting. We only require read access to your charges, subscriptions, customers, and balance data. Click 'Connect' to grant access and return to Karsilo.",
        },
        {
          heading: "Initial data sync",
          body: "After authorization, Karsilo begins syncing your historical data. Depending on your account size, this may take a few minutes. You'll see a progress indicator on the dashboard. Recent transactions appear first, with older data backfilling in the background.",
        },
        {
          heading: "Verify the connection",
          body: "Once the sync completes, your Stripe account will appear in the sidebar with a green status indicator. Click on it to see revenue metrics, recent charges, and subscription data. If anything looks off, try disconnecting and reconnecting the account.",
        },
      ],
      relatedArticles: [
        {
          title: "Creating your account",
          href: "/resources/getting-started/creating-your-account",
        },
        {
          title: "Understanding your dashboard",
          href: "/resources/getting-started/understanding-your-dashboard",
        },
        {
          title: "Adding more Stripe accounts",
          href: "/resources/account-management/adding-more-stripe-accounts",
        },
      ],
    },
    "understanding-your-dashboard": {
      title: "Understanding Your Dashboard",
      description:
        "Get familiar with the Karsilo dashboard layout, key metrics, and how to navigate your data.",
      category: "Getting Started",
      categorySlug: "getting-started",
      sections: [
        {
          heading: "Dashboard overview",
          body: "The main dashboard shows a consolidated view of all your connected Stripe accounts. At the top, you'll find aggregate metrics including total MRR, net revenue, active subscriptions, and churn rate. Each metric includes a comparison to the previous period so you can spot trends at a glance.",
        },
        {
          heading: "Account switcher",
          body: "Use the sidebar to switch between individual Stripe accounts or view the combined aggregate. Each account displays its own revenue chart, recent transactions, and key performance indicators. The aggregate view merges data from all accounts into a single unified dashboard.",
        },
        {
          heading: "Revenue charts and filters",
          body: "The main chart area supports daily, weekly, and monthly views. Use the date range picker to zoom into specific periods. You can overlay metrics like MRR, gross volume, and refunds on the same chart for easy comparison. All charts update in real time as new transactions come in.",
        },
        {
          heading: "Quick actions",
          body: "The dashboard includes shortcuts for common tasks like exporting data, generating reports, and managing account connections. Look for the action buttons in the top-right corner of each section. You can also customize which widgets appear on your dashboard from the settings page.",
        },
      ],
      relatedArticles: [
        {
          title: "Reading the analytics dashboard",
          href: "/resources/analytics-&-reports/reading-the-analytics-dashboard",
        },
        {
          title: "Setting up notifications",
          href: "/resources/getting-started/setting-up-notifications",
        },
        {
          title: "Exporting your data",
          href: "/resources/analytics-&-reports/exporting-your-data",
        },
      ],
    },
    "setting-up-notifications": {
      title: "Setting Up Notifications",
      description:
        "Configure alerts for important events like failed charges, new subscriptions, and revenue milestones.",
      category: "Getting Started",
      categorySlug: "getting-started",
      sections: [
        {
          heading: "Notification channels",
          body: "Karsilo supports email, Slack, and in-app notifications. Navigate to Settings → Notifications to configure your preferred channels. You can use different channels for different alert types — for example, Slack for real-time transaction alerts and email for weekly summaries.",
        },
        {
          heading: "Alert types",
          body: "Choose from several alert categories: transaction alerts (failed charges, refunds, disputes), subscription alerts (new signups, cancellations, upgrades), and revenue alerts (milestone reached, MRR changes, unusual activity). Each category can be enabled or disabled independently.",
        },
        {
          heading: "Custom thresholds",
          body: "For revenue alerts, you can set custom thresholds. Get notified when daily revenue exceeds a certain amount, when churn rate spikes above your baseline, or when a single transaction exceeds a defined value. Thresholds apply per-account or across all accounts.",
        },
        {
          heading: "Notification schedule",
          body: "Control when you receive notifications. Enable quiet hours to pause non-critical alerts during evenings and weekends. Digest mode bundles multiple notifications into a single summary sent at your chosen time. Critical alerts like failed charges always arrive immediately.",
        },
      ],
      relatedArticles: [
        {
          title: "Slack integration setup",
          href: "/resources/api-&-integrations/slack-integration-setup",
        },
        {
          title: "Understanding your dashboard",
          href: "/resources/getting-started/understanding-your-dashboard",
        },
        {
          title: "Setting up email reports",
          href: "/resources/analytics-&-reports/setting-up-email-reports",
        },
      ],
    },
  },

  "account-management": {
    "adding-more-stripe-accounts": {
      title: "Adding More Stripe Accounts",
      description:
        "Connect additional Stripe accounts to get a unified view of all your revenue streams.",
      category: "Account Management",
      categorySlug: "account-management",
      sections: [
        {
          heading: "Why connect multiple accounts",
          body: "Many founders run separate Stripe accounts for different products, regions, or business entities. Karsilo lets you monitor all of them from a single dashboard, providing aggregate metrics alongside individual account breakdowns.",
        },
        {
          heading: "Adding a new connection",
          body: "Click the '+' icon in the account sidebar or go to Settings → Connected Accounts → Add Account. You'll go through the same Stripe OAuth flow used for your first connection. Each account syncs independently, so adding a new one doesn't affect existing connections.",
        },
        {
          heading: "Account labels and organization",
          body: "After connecting, give each account a recognizable label like 'SaaS Product' or 'EU Store'. You can also assign color tags and group accounts by category. This makes it easy to filter and compare specific accounts in your analytics views.",
        },
        {
          heading: "Plan limits",
          body: "The number of Stripe accounts you can connect depends on your plan. Free accounts support one connection, while paid plans offer higher or unlimited limits. Check the billing page to see your current usage and upgrade if needed.",
        },
      ],
      relatedArticles: [
        {
          title: "Connecting your first Stripe account",
          href: "/resources/getting-started/connecting-your-first-stripe-account",
        },
        {
          title: "Removing a connected account",
          href: "/resources/account-management/removing-a-connected-account",
        },
        {
          title: "Account permissions explained",
          href: "/resources/account-management/account-permissions-explained",
        },
      ],
    },
    "removing-a-connected-account": {
      title: "Removing a Connected Account",
      description:
        "Safely disconnect a Stripe account from Karsilo without affecting your Stripe data.",
      category: "Account Management",
      categorySlug: "account-management",
      sections: [
        {
          heading: "What happens when you remove an account",
          body: "Removing a connected account revokes Karsilo's access to that Stripe account. Your Stripe data remains completely untouched — Karsilo only has read access and never modifies your Stripe account. Historical data from that account will no longer appear in your dashboard.",
        },
        {
          heading: "How to disconnect",
          body: "Go to Settings → Connected Accounts, find the account you want to remove, and click the 'Disconnect' button. You'll be asked to confirm before the connection is removed. The process is immediate, and the account will disappear from your sidebar.",
        },
        {
          heading: "Revoking access from Stripe",
          body: "For extra security, you can also revoke access directly from your Stripe Dashboard. Go to Settings → Connected Accounts in Stripe and remove Karsilo from the list. This ensures the OAuth token is invalidated on Stripe's side as well.",
        },
        {
          heading: "Reconnecting later",
          body: "If you change your mind, you can reconnect the same Stripe account at any time. Simply go through the connection flow again. Karsilo will re-sync your data from Stripe, restoring your dashboard view for that account.",
        },
      ],
      relatedArticles: [
        {
          title: "Adding more Stripe accounts",
          href: "/resources/account-management/adding-more-stripe-accounts",
        },
        {
          title: "Reconnecting after token expiry",
          href: "/resources/account-management/reconnecting-after-token-expiry",
        },
        {
          title: "Account permissions explained",
          href: "/resources/account-management/account-permissions-explained",
        },
      ],
    },
    "reconnecting-after-token-expiry": {
      title: "Reconnecting After Token Expiry",
      description:
        "What to do when your Stripe connection token expires and how to restore access quickly.",
      category: "Account Management",
      categorySlug: "account-management",
      sections: [
        {
          heading: "Why tokens expire",
          body: "Stripe OAuth tokens can expire if you revoke access from your Stripe Dashboard, if Stripe rotates credentials for security reasons, or if the connected account's permissions change. When this happens, Karsilo can no longer fetch new data from that account.",
        },
        {
          heading: "Identifying an expired connection",
          body: "Expired connections show an orange warning icon in the sidebar and a banner at the top of the account's dashboard. You'll also receive an email notification when a connection loses access. The last-synced timestamp will stop updating.",
        },
        {
          heading: "Reconnecting the account",
          body: "Click the 'Reconnect' button on the warning banner or go to Settings → Connected Accounts. Find the affected account and click 'Reauthorize'. This opens the Stripe OAuth flow, and once you approve, the connection is restored and data syncing resumes.",
        },
        {
          heading: "Preventing future issues",
          body: "To minimize token expiry disruptions, avoid revoking Karsilo access from your Stripe Dashboard unless you intend to disconnect. If you use Stripe's restricted API keys elsewhere, ensure they don't conflict with Karsilo's OAuth permissions.",
        },
      ],
      relatedArticles: [
        {
          title: "Removing a connected account",
          href: "/resources/account-management/removing-a-connected-account",
        },
        {
          title: "Security best practices",
          href: "/resources/security/security-best-practices",
        },
        {
          title: "Adding more Stripe accounts",
          href: "/resources/account-management/adding-more-stripe-accounts",
        },
      ],
    },
    "account-permissions-explained": {
      title: "Account Permissions Explained",
      description:
        "Understand what data Karsilo can access and the permission scopes required for each feature.",
      category: "Account Management",
      categorySlug: "account-management",
      sections: [
        {
          heading: "Read-only access",
          body: "Karsilo requests read-only access to your Stripe account. This means we can view charges, subscriptions, customers, invoices, and balance data, but we can never create, modify, or delete anything in your Stripe account. Your financial operations remain entirely under your control.",
        },
        {
          heading: "Permission scopes",
          body: "The specific OAuth scopes we request include: read_only access to charges, customers, subscriptions, invoices, balance, and events. These scopes power the dashboard metrics, analytics, and notification features. No write scopes are ever requested.",
        },
        {
          heading: "Team member roles",
          body: "Within Karsilo, you can invite team members with different permission levels. Admins can manage connections and billing. Viewers can see dashboards and reports but cannot modify account settings. This lets you share insights without granting full control.",
        },
        {
          heading: "Audit trail",
          body: "Every action taken in Karsilo is logged in an audit trail accessible from Settings → Activity Log. This includes connection changes, team member additions, report exports, and setting modifications. Use the audit trail to track who did what and when.",
        },
      ],
      relatedArticles: [
        {
          title: "Security best practices",
          href: "/resources/security/security-best-practices",
        },
        {
          title: "Adding more Stripe accounts",
          href: "/resources/account-management/adding-more-stripe-accounts",
        },
        {
          title: "Two-factor authentication",
          href: "/resources/security/two-factor-authentication",
        },
      ],
    },
  },

  "analytics-&-reports": {
    "reading-the-analytics-dashboard": {
      title: "Reading the Analytics Dashboard",
      description:
        "A comprehensive guide to understanding every metric and chart on your Karsilo analytics page.",
      category: "Analytics & Reports",
      categorySlug: "analytics-&-reports",
      sections: [
        {
          heading: "Key metrics overview",
          body: "The analytics dashboard displays your most important metrics at the top: Monthly Recurring Revenue (MRR), Annual Run Rate (ARR), net revenue, active subscriptions, churn rate, and average revenue per user (ARPU). Each metric shows the current value and percentage change from the previous period.",
        },
        {
          heading: "Revenue breakdown chart",
          body: "The main chart visualizes revenue over time. Toggle between new revenue, expansions, contractions, and churned revenue to understand what's driving changes. The stacked view shows how each component contributes to your total, while the line view highlights trends.",
        },
        {
          heading: "Cohort analysis",
          body: "The cohort tab groups customers by their signup month. This reveals retention patterns — you can see what percentage of each cohort remains active over time. Use this to evaluate whether product changes are improving or hurting long-term retention.",
        },
        {
          heading: "Filtering and comparison",
          body: "Use the account filter to view analytics for a single Stripe account or all accounts combined. The date range picker supports preset ranges like 'Last 30 days' and 'This quarter' as well as custom ranges. Enable comparison mode to overlay two time periods on the same chart.",
        },
      ],
      relatedArticles: [
        {
          title: "Understanding MRR calculations",
          href: "/resources/analytics-&-reports/understanding-mrr-calculations",
        },
        {
          title: "Exporting your data",
          href: "/resources/analytics-&-reports/exporting-your-data",
        },
        {
          title: "Setting up email reports",
          href: "/resources/analytics-&-reports/setting-up-email-reports",
        },
      ],
    },
    "exporting-your-data": {
      title: "Exporting Your Data",
      description:
        "Download your revenue data, transaction history, and reports in various formats.",
      category: "Analytics & Reports",
      categorySlug: "analytics-&-reports",
      sections: [
        {
          heading: "Available export formats",
          body: "Karsilo supports CSV, Excel (.xlsx), and JSON exports. CSV works well for spreadsheet tools and simple analysis. Excel exports include formatted headers and multiple sheets for different data types. JSON is ideal for programmatic use and importing into other tools.",
        },
        {
          heading: "Choosing what to export",
          body: "From the analytics page, click the Export button to open the export dialog. Select the data type (transactions, subscriptions, customers, or revenue summary), date range, and accounts to include. You can export data for a single account or all accounts at once.",
        },
        {
          heading: "Scheduled exports",
          body: "Set up recurring exports that are automatically emailed to you. Go to Settings → Reports → Scheduled Exports. Choose the frequency (daily, weekly, or monthly), data type, and recipients. Each export arrives as an email attachment at your specified time.",
        },
        {
          heading: "Data retention",
          body: "Karsilo retains your synced data for as long as your account is active. Historical exports are also saved in your account for 90 days under Settings → Reports → Export History, so you can re-download previous exports without generating them again.",
        },
      ],
      relatedArticles: [
        {
          title: "Reading the analytics dashboard",
          href: "/resources/analytics-&-reports/reading-the-analytics-dashboard",
        },
        {
          title: "Setting up email reports",
          href: "/resources/analytics-&-reports/setting-up-email-reports",
        },
        {
          title: "Getting your API key",
          href: "/resources/api-&-integrations/getting-your-api-key",
        },
      ],
    },
    "setting-up-email-reports": {
      title: "Setting Up Email Reports",
      description:
        "Receive automated revenue summaries and performance reports delivered to your inbox.",
      category: "Analytics & Reports",
      categorySlug: "analytics-&-reports",
      sections: [
        {
          heading: "Available report types",
          body: "Karsilo offers three report types: Daily Snapshot (key metrics from the previous day), Weekly Summary (week-over-week trends and highlights), and Monthly Review (comprehensive monthly analysis with charts). Each report is formatted as a clean, readable email.",
        },
        {
          heading: "Configuring recipients",
          body: "Go to Settings → Reports → Email Reports. Add one or more email addresses for each report type. Team members with Karsilo accounts will see clickable links to the full dashboard. External recipients receive the report data in the email body.",
        },
        {
          heading: "Customizing report content",
          body: "Choose which metrics to include in each report. You can select specific accounts, toggle individual metrics on or off, and choose whether to include charts or text-only summaries. The preview button lets you see exactly what the report will look like before saving.",
        },
        {
          heading: "Delivery schedule",
          body: "Daily reports are sent at 8 AM in your configured timezone. Weekly reports arrive on Monday mornings. Monthly reports are delivered on the 1st of each month. You can adjust the delivery time from the report settings page to match your preferred schedule.",
        },
      ],
      relatedArticles: [
        {
          title: "Exporting your data",
          href: "/resources/analytics-&-reports/exporting-your-data",
        },
        {
          title: "Setting up notifications",
          href: "/resources/getting-started/setting-up-notifications",
        },
        {
          title: "Reading the analytics dashboard",
          href: "/resources/analytics-&-reports/reading-the-analytics-dashboard",
        },
      ],
    },
    "understanding-mrr-calculations": {
      title: "Understanding MRR Calculations",
      description:
        "Learn how Karsilo calculates Monthly Recurring Revenue and related subscription metrics.",
      category: "Analytics & Reports",
      categorySlug: "analytics-&-reports",
      sections: [
        {
          heading: "What is MRR",
          body: "Monthly Recurring Revenue (MRR) represents the predictable monthly revenue from active subscriptions. Karsilo calculates MRR by normalizing all subscription intervals to a monthly amount. An annual $1,200 subscription contributes $100/month to MRR, while a monthly $50 subscription contributes $50.",
        },
        {
          heading: "MRR components",
          body: "Karsilo breaks MRR into five components: New MRR (from first-time subscribers), Expansion MRR (upgrades and add-ons), Contraction MRR (downgrades), Churned MRR (cancellations), and Reactivation MRR (returning customers). Together, these explain how your MRR changes from month to month.",
        },
        {
          heading: "Handling edge cases",
          body: "Trials are excluded from MRR until they convert to paid subscriptions. Metered or usage-based billing is not included in MRR since it's not predictable. One-time charges are tracked separately in gross revenue but never counted toward MRR. Refunds reduce the period's gross revenue but don't retroactively adjust MRR.",
        },
        {
          heading: "Multi-account MRR",
          body: "When viewing aggregate data across multiple Stripe accounts, Karsilo sums MRR from all connected accounts. If accounts use different currencies, amounts are converted to your configured display currency using daily exchange rates. You can see per-account MRR breakdowns on the individual account pages.",
        },
      ],
      relatedArticles: [
        {
          title: "Reading the analytics dashboard",
          href: "/resources/analytics-&-reports/reading-the-analytics-dashboard",
        },
        {
          title: "Exporting your data",
          href: "/resources/analytics-&-reports/exporting-your-data",
        },
        {
          title: "Understanding your dashboard",
          href: "/resources/getting-started/understanding-your-dashboard",
        },
      ],
    },
  },

  "billing-&-plans": {
    "upgrading-your-plan": {
      title: "Upgrading Your Plan",
      description:
        "Move to a higher plan to unlock more Stripe connections, advanced analytics, and team features.",
      category: "Billing & Plans",
      categorySlug: "billing-&-plans",
      sections: [
        {
          heading: "Comparing plans",
          body: "Visit the Pricing page or go to Settings → Billing → Change Plan to compare available plans side by side. Each plan shows the number of Stripe accounts supported, available features, team member limits, and pricing. Hover over feature names for detailed descriptions.",
        },
        {
          heading: "How to upgrade",
          body: "Click 'Upgrade' on your desired plan. If you're on a free plan, you'll be asked to enter payment details. If you already have a paid plan, the upgrade is applied immediately. You'll be charged a prorated amount for the remainder of your current billing cycle.",
        },
        {
          heading: "Prorated billing",
          body: "When you upgrade mid-cycle, Karsilo calculates the remaining days and charges only the price difference for that period. For example, if you upgrade from $29/month to $79/month halfway through the month, you'll be charged approximately $25 for the remaining days.",
        },
        {
          heading: "Annual vs monthly billing",
          body: "Annual billing offers a discount of roughly 20% compared to monthly billing. You can switch between billing frequencies from the plan selection page. If switching from monthly to annual, you'll pay the annual amount minus credit for any unused days on your current monthly plan.",
        },
      ],
      relatedArticles: [
        {
          title: "Viewing invoices",
          href: "/resources/billing-&-plans/viewing-invoices",
        },
        {
          title: "Canceling your subscription",
          href: "/resources/billing-&-plans/canceling-your-subscription",
        },
        {
          title: "Refund policy",
          href: "/resources/billing-&-plans/refund-policy",
        },
      ],
    },
    "viewing-invoices": {
      title: "Viewing Invoices",
      description:
        "Access and download your billing history and invoices for accounting purposes.",
      category: "Billing & Plans",
      categorySlug: "billing-&-plans",
      sections: [
        {
          heading: "Accessing your invoices",
          body: "Go to Settings → Billing → Invoice History to see all past invoices. Each invoice shows the date, amount, plan name, and payment status. Invoices are generated at the start of each billing cycle and after any mid-cycle changes like upgrades.",
        },
        {
          heading: "Downloading invoices",
          body: "Click on any invoice to view it in detail, then use the 'Download PDF' button to save a copy. PDFs include your company name, billing address, itemized charges, and tax information if applicable. You can also download all invoices at once using the 'Export All' button.",
        },
        {
          heading: "Invoice details",
          body: "Each invoice includes: plan name and tier, billing period dates, subtotal, any applicable taxes or discounts, proration credits from plan changes, and the total charged. If you have a discount code applied, it will appear as a line item deduction.",
        },
        {
          heading: "Updating billing information",
          body: "To update the company name, address, or tax ID on your invoices, go to Settings → Billing → Billing Details. Changes apply to future invoices only — existing invoices cannot be modified. Contact support if you need a corrected invoice reissued.",
        },
      ],
      relatedArticles: [
        {
          title: "Upgrading your plan",
          href: "/resources/billing-&-plans/upgrading-your-plan",
        },
        {
          title: "Canceling your subscription",
          href: "/resources/billing-&-plans/canceling-your-subscription",
        },
        {
          title: "Refund policy",
          href: "/resources/billing-&-plans/refund-policy",
        },
      ],
    },
    "canceling-your-subscription": {
      title: "Canceling Your Subscription",
      description:
        "How to cancel your Karsilo subscription and what happens to your data afterward.",
      category: "Billing & Plans",
      categorySlug: "billing-&-plans",
      sections: [
        {
          heading: "How to cancel",
          body: "Go to Settings → Billing → Change Plan and click 'Cancel Subscription'. You'll be asked to confirm and optionally provide feedback on why you're leaving. Cancellation takes effect at the end of your current billing period — you'll retain access until then.",
        },
        {
          heading: "What happens to your data",
          body: "After cancellation, your account moves to the free tier. You'll retain access to one connected Stripe account and basic analytics. Data from additional accounts becomes inaccessible but is not deleted. If you resubscribe within 90 days, all data is restored.",
        },
        {
          heading: "After 90 days",
          body: "If you don't resubscribe within 90 days, synced data from disconnected accounts is permanently deleted. Your Karsilo account remains active on the free tier, and any single connected account continues to work. You can export your data at any time before the 90-day window closes.",
        },
        {
          heading: "Resubscribing",
          body: "To resubscribe, simply select a paid plan from Settings → Billing → Change Plan. Your account will be upgraded immediately, and previously disconnected accounts can be reconnected. Within the 90-day window, historical data is restored automatically upon resubscription.",
        },
      ],
      relatedArticles: [
        {
          title: "Refund policy",
          href: "/resources/billing-&-plans/refund-policy",
        },
        {
          title: "Viewing invoices",
          href: "/resources/billing-&-plans/viewing-invoices",
        },
        {
          title: "Upgrading your plan",
          href: "/resources/billing-&-plans/upgrading-your-plan",
        },
      ],
    },
    "refund-policy": {
      title: "Refund Policy",
      description:
        "Understand Karsilo's refund policy for subscription charges and plan changes.",
      category: "Billing & Plans",
      categorySlug: "billing-&-plans",
      sections: [
        {
          heading: "Standard refund policy",
          body: "Karsilo offers a 14-day money-back guarantee for new subscriptions. If you're not satisfied within the first 14 days of a paid plan, contact support for a full refund. This applies to first-time subscribers only, not to plan renewals or upgrades.",
        },
        {
          heading: "Mid-cycle cancellations",
          body: "If you cancel mid-cycle, you are not charged for the next period and retain access until the current period ends. Partial-month refunds are not issued for mid-cycle cancellations. However, if you cancel within 14 days of an annual renewal, you can request a prorated refund.",
        },
        {
          heading: "Billing errors",
          body: "If you've been charged incorrectly due to a billing error — such as a duplicate charge or incorrect plan amount — contact support immediately. We will investigate and issue a full refund for any confirmed billing errors within 5 business days.",
        },
        {
          heading: "How to request a refund",
          body: "Email support@karsilo.com with your account email and the invoice number. Include a brief description of your reason for the refund request. Our team reviews requests within 2 business days and processes approved refunds to the original payment method.",
        },
      ],
      relatedArticles: [
        {
          title: "Canceling your subscription",
          href: "/resources/billing-&-plans/canceling-your-subscription",
        },
        {
          title: "Viewing invoices",
          href: "/resources/billing-&-plans/viewing-invoices",
        },
        {
          title: "Upgrading your plan",
          href: "/resources/billing-&-plans/upgrading-your-plan",
        },
      ],
    },
  },

  security: {
    "two-factor-authentication": {
      title: "Two-Factor Authentication",
      description:
        "Add an extra layer of security to your Karsilo account with two-factor authentication.",
      category: "Security",
      categorySlug: "security",
      sections: [
        {
          heading: "Why enable 2FA",
          body: "Two-factor authentication protects your account even if your password is compromised. With 2FA enabled, logging in requires both your password and a time-based code from an authenticator app. This dramatically reduces the risk of unauthorized access to your revenue data.",
        },
        {
          heading: "Setting up 2FA",
          body: "Go to Settings → Security → Two-Factor Authentication and click 'Enable'. Scan the QR code with an authenticator app like Google Authenticator, Authy, or 1Password. Enter the 6-digit verification code to confirm setup. Store the backup codes in a safe place.",
        },
        {
          heading: "Backup codes",
          body: "When you enable 2FA, Karsilo generates 10 one-time backup codes. Each code can be used once if you lose access to your authenticator app. Store these codes securely — for example, in a password manager or printed in a safe location. You can regenerate codes from the security settings.",
        },
        {
          heading: "Disabling 2FA",
          body: "If you need to disable 2FA, go to Settings → Security → Two-Factor Authentication and click 'Disable'. You'll need to enter a valid 2FA code or backup code to confirm. Note that disabling 2FA reduces your account security, and we strongly recommend keeping it enabled.",
        },
      ],
      relatedArticles: [
        {
          title: "Security best practices",
          href: "/resources/security/security-best-practices",
        },
        {
          title: "Session management",
          href: "/resources/security/session-management",
        },
        {
          title: "Account permissions explained",
          href: "/resources/account-management/account-permissions-explained",
        },
      ],
    },
    "data-encryption-explained": {
      title: "Data Encryption Explained",
      description:
        "Learn how Karsilo protects your data with encryption at rest and in transit.",
      category: "Security",
      categorySlug: "security",
      sections: [
        {
          heading: "Encryption in transit",
          body: "All communication between your browser and Karsilo's servers uses TLS 1.3 encryption. This means data is encrypted while traveling over the internet, preventing eavesdropping or man-in-the-middle attacks. API calls between Karsilo and Stripe are also encrypted using TLS.",
        },
        {
          heading: "Encryption at rest",
          body: "Your synced Stripe data is stored in databases encrypted with AES-256, the industry standard for data at rest. Encryption keys are managed through a dedicated key management service with automatic rotation. Even if storage media were physically compromised, the data would be unreadable.",
        },
        {
          heading: "OAuth token security",
          body: "Stripe OAuth tokens are stored in a separate, encrypted vault with additional access controls. Tokens are never exposed in application logs, error messages, or API responses. Access to the token vault is restricted to the sync service and requires additional authentication.",
        },
        {
          heading: "Infrastructure security",
          body: "Karsilo runs on SOC 2 Type II certified infrastructure. Our servers are hosted in geographically distributed data centers with physical security controls, redundant power, and network isolation. Regular penetration testing and security audits ensure our defenses stay current.",
        },
      ],
      relatedArticles: [
        {
          title: "Security best practices",
          href: "/resources/security/security-best-practices",
        },
        {
          title: "Two-factor authentication",
          href: "/resources/security/two-factor-authentication",
        },
        {
          title: "Account permissions explained",
          href: "/resources/account-management/account-permissions-explained",
        },
      ],
    },
    "session-management": {
      title: "Session Management",
      description:
        "Control your active sessions, manage trusted devices, and understand session security.",
      category: "Security",
      categorySlug: "security",
      sections: [
        {
          heading: "Viewing active sessions",
          body: "Go to Settings → Security → Active Sessions to see all devices currently logged into your Karsilo account. Each session shows the device type, browser, approximate location, and last activity time. This helps you quickly spot any sessions you don't recognize.",
        },
        {
          heading: "Revoking sessions",
          body: "Click 'Revoke' next to any session to immediately log it out. Use 'Revoke All Other Sessions' to log out everywhere except your current device. This is useful if you suspect unauthorized access or after changing your password.",
        },
        {
          heading: "Session timeouts",
          body: "Karsilo sessions automatically expire after 30 days of inactivity. If you'd like shorter timeouts for extra security, go to Settings → Security → Session Timeout and choose from 1 hour, 8 hours, 7 days, or 30 days. Shorter timeouts mean more frequent logins but better security.",
        },
        {
          heading: "Trusted devices",
          body: "When you log in with 2FA, you can mark a device as trusted for 30 days. Trusted devices skip the 2FA code prompt during the trust period. You can view and remove trusted devices from the Active Sessions page. If a trusted device is lost or stolen, revoke it immediately.",
        },
      ],
      relatedArticles: [
        {
          title: "Two-factor authentication",
          href: "/resources/security/two-factor-authentication",
        },
        {
          title: "Security best practices",
          href: "/resources/security/security-best-practices",
        },
        {
          title: "Data encryption explained",
          href: "/resources/security/data-encryption-explained",
        },
      ],
    },
    "security-best-practices": {
      title: "Security Best Practices",
      description:
        "Follow these recommendations to keep your Karsilo account and Stripe data secure.",
      category: "Security",
      categorySlug: "security",
      sections: [
        {
          heading: "Use a strong, unique password",
          body: "Your Karsilo password should be at least 12 characters and unique to this account. Use a password manager to generate and store complex passwords. Avoid reusing passwords from other services, as credential stuffing attacks use leaked passwords from other breaches.",
        },
        {
          heading: "Enable two-factor authentication",
          body: "2FA is the single most impactful security measure you can take. Even if your password is compromised, an attacker cannot log in without your authenticator code. Enable 2FA from Settings → Security and store backup codes in a safe place.",
        },
        {
          heading: "Review connected accounts regularly",
          body: "Periodically review your connected Stripe accounts and team member access. Remove connections you no longer need and revoke access for team members who have left. Fewer active connections mean a smaller surface area for potential issues.",
        },
        {
          heading: "Monitor your activity log",
          body: "Check Settings → Activity Log regularly for unexpected actions. Look for login attempts from unfamiliar locations, account connection changes, or setting modifications you didn't make. If you see anything suspicious, change your password and revoke all sessions immediately.",
        },
      ],
      relatedArticles: [
        {
          title: "Two-factor authentication",
          href: "/resources/security/two-factor-authentication",
        },
        {
          title: "Session management",
          href: "/resources/security/session-management",
        },
        {
          title: "Data encryption explained",
          href: "/resources/security/data-encryption-explained",
        },
      ],
    },
  },

  "api-&-integrations": {
    "getting-your-api-key": {
      title: "Getting Your API Key",
      description:
        "Generate and manage API keys to access Karsilo data programmatically.",
      category: "API & Integrations",
      categorySlug: "api-&-integrations",
      sections: [
        {
          heading: "Generating an API key",
          body: "Go to Settings → API → API Keys and click 'Generate New Key'. Give your key a descriptive name like 'Production Backend' or 'CI/CD Pipeline'. The full key is displayed only once — copy it immediately and store it securely. If you lose it, you'll need to generate a new one.",
        },
        {
          heading: "Key permissions",
          body: "API keys inherit the permissions of the user who created them. Admin keys can access all data and settings. You can also create restricted keys with read-only access to specific accounts. Use the principle of least privilege — give each key only the access it needs.",
        },
        {
          heading: "Using the API",
          body: "Include your API key in the Authorization header of each request: 'Authorization: Bearer your-api-key'. The API returns JSON responses and follows REST conventions. Rate limits apply — see the rate limits article for details. Full API documentation is available at docs.karsilo.com.",
        },
        {
          heading: "Revoking API keys",
          body: "If a key is compromised or no longer needed, revoke it immediately from Settings → API → API Keys. Click the key name, then 'Revoke'. Revocation is instant — any requests using that key will fail immediately. Generate a new key and update your applications as needed.",
        },
      ],
      relatedArticles: [
        {
          title: "Rate limits explained",
          href: "/resources/api-&-integrations/rate-limits-explained",
        },
        {
          title: "Webhook configuration",
          href: "/resources/api-&-integrations/webhook-configuration",
        },
        {
          title: "Slack integration setup",
          href: "/resources/api-&-integrations/slack-integration-setup",
        },
      ],
    },
    "slack-integration-setup": {
      title: "Slack Integration Setup",
      description:
        "Connect Karsilo to Slack to receive real-time revenue alerts and daily summaries.",
      category: "API & Integrations",
      categorySlug: "api-&-integrations",
      sections: [
        {
          heading: "Installing the Slack app",
          body: "Go to Settings → Integrations → Slack and click 'Connect to Slack'. You'll be redirected to Slack's OAuth page to authorize Karsilo. Select the workspace and channel where you'd like to receive notifications. You need to be a Slack workspace admin or have permission to install apps.",
        },
        {
          heading: "Choosing a channel",
          body: "After authorization, select the Slack channel for Karsilo notifications. We recommend a dedicated channel like #revenue or #karsilo-alerts to keep notifications organized. You can add multiple channels for different alert types — for example, #revenue for daily summaries and #alerts for failed charges.",
        },
        {
          heading: "Configuring alerts",
          body: "From the Slack integration settings, choose which events trigger Slack messages. Options include: new subscriptions, cancellations, failed charges, revenue milestones, and daily/weekly summaries. Each alert type can be sent to a different channel if desired.",
        },
        {
          heading: "Message formatting",
          body: "Karsilo Slack messages use rich formatting with actionable links. Revenue alerts show the amount and a link to the dashboard. Daily summaries include key metrics in a clean table layout. Click any link in a Slack message to jump directly to the relevant Karsilo page.",
        },
      ],
      relatedArticles: [
        {
          title: "Setting up notifications",
          href: "/resources/getting-started/setting-up-notifications",
        },
        {
          title: "Webhook configuration",
          href: "/resources/api-&-integrations/webhook-configuration",
        },
        {
          title: "Getting your API key",
          href: "/resources/api-&-integrations/getting-your-api-key",
        },
      ],
    },
    "webhook-configuration": {
      title: "Webhook Configuration",
      description:
        "Set up webhooks to receive real-time event data from Karsilo in your own applications.",
      category: "API & Integrations",
      categorySlug: "api-&-integrations",
      sections: [
        {
          heading: "Creating a webhook endpoint",
          body: "Go to Settings → API → Webhooks and click 'Add Endpoint'. Enter the URL where Karsilo should send events. Your endpoint must accept POST requests and return a 200 status code within 30 seconds. We recommend using HTTPS for security.",
        },
        {
          heading: "Selecting events",
          body: "Choose which events trigger webhook deliveries. Available events include: charge.succeeded, charge.failed, subscription.created, subscription.canceled, subscription.updated, invoice.paid, and daily_summary. Subscribe only to events you need to minimize unnecessary traffic.",
        },
        {
          heading: "Webhook security",
          body: "Each webhook endpoint receives a unique signing secret. Karsilo includes a signature header with every delivery. Verify the signature in your application to ensure the request genuinely came from Karsilo. Our documentation provides verification code examples in Node.js, Python, Ruby, and Go.",
        },
        {
          heading: "Retry policy",
          body: "If your endpoint returns a non-200 response or times out, Karsilo retries the delivery with exponential backoff. Retries occur at 1 minute, 5 minutes, 30 minutes, 2 hours, and 24 hours. After 5 failed attempts, the delivery is marked as failed. You can manually retry from the webhook logs.",
        },
      ],
      relatedArticles: [
        {
          title: "Getting your API key",
          href: "/resources/api-&-integrations/getting-your-api-key",
        },
        {
          title: "Rate limits explained",
          href: "/resources/api-&-integrations/rate-limits-explained",
        },
        {
          title: "Slack integration setup",
          href: "/resources/api-&-integrations/slack-integration-setup",
        },
      ],
    },
    "rate-limits-explained": {
      title: "Rate Limits Explained",
      description:
        "Understand Karsilo's API rate limits and how to handle them in your integrations.",
      category: "API & Integrations",
      categorySlug: "api-&-integrations",
      sections: [
        {
          heading: "Default rate limits",
          body: "Karsilo's API allows 100 requests per minute per API key on the standard plan and 500 requests per minute on the professional and enterprise plans. Rate limits are applied per key, so multiple keys from the same account each get their own limit.",
        },
        {
          heading: "Rate limit headers",
          body: "Every API response includes rate limit headers: X-RateLimit-Limit (your limit), X-RateLimit-Remaining (requests left in the current window), and X-RateLimit-Reset (Unix timestamp when the window resets). Use these headers to proactively manage your request rate.",
        },
        {
          heading: "Handling 429 responses",
          body: "When you exceed the rate limit, the API returns a 429 Too Many Requests response with a Retry-After header indicating how many seconds to wait. Implement exponential backoff in your client: wait the specified time, then retry. Avoid tight retry loops that could extend your rate limit window.",
        },
        {
          heading: "Optimizing API usage",
          body: "To stay within rate limits, batch requests where possible, cache responses that don't change frequently, and use webhooks for real-time data instead of polling. If you consistently hit limits, consider upgrading your plan for a higher allocation or contact support for custom limits.",
        },
      ],
      relatedArticles: [
        {
          title: "Getting your API key",
          href: "/resources/api-&-integrations/getting-your-api-key",
        },
        {
          title: "Webhook configuration",
          href: "/resources/api-&-integrations/webhook-configuration",
        },
        {
          title: "Slack integration setup",
          href: "/resources/api-&-integrations/slack-integration-setup",
        },
      ],
    },
  },
};

export function getAllArticleParams(): { category: string; article: string }[] {
  const params: { category: string; article: string }[] = [];
  for (const [category, articles] of Object.entries(helpArticles)) {
    for (const article of Object.keys(articles)) {
      params.push({ category, article });
    }
  }
  return params;
}
