import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const DEFAULT_SERVICES = [
    {
        name: 'Automate Warm Outreach',
        description: 'Set up tracking for high-intent activities and configure Target Account settings so Sales can stop guessing.',
        price: 1200,
        details: 'Our custom n8n agent monitors prospect behavior across your website, email campaigns, and CRM. When high-intent signals are detected, it automatically triggers personalized outreach sequences. This includes configuring Target Account settings, lead scoring automation, and Sales notification workflows.',
        deliverables: ['Custom n8n workflow setup', 'Target Account configuration', 'Lead scoring rules', 'Sales notification system'],
        timeline: '5 business days'
    },
    {
        name: 'Configure Your ICP',
        description: 'Codify your Ideal Customer Profiles (ICP) into properties and scoring rules. Yes, for real.',
        price: 1100,
        details: 'We translate your ICP from slide decks into actionable HubSpot properties and automated scoring. This ensures your entire team works from the same definition of your ideal customer, with automatic lead qualification based on firmographic and behavioral data.',
        deliverables: ['Custom ICP properties', 'Automated scoring system', 'Segmentation lists', 'Documentation'],
        timeline: '5 business days'
    },
    {
        name: 'Smart CRM Updates',
        description: 'Let your CRM update itself using HubSpot\'s new smart properties and automated data enrichment tools.',
        price: 850,
        details: 'Leverage HubSpot\'s AI-powered smart properties and data enrichment to keep your CRM fresh without manual work. We configure automated data updates, company enrichment, and intelligent field population based on prospect interactions.',
        deliverables: ['Smart property configuration', 'Data enrichment setup', 'Automated workflows', 'Quality checks'],
        timeline: '3 business days'
    },
    {
        name: 'Configure Buyer Intent',
        description: 'Set up tracking for high-intent activities and configure Target Account settings for precision targeting.',
        price: 1200,
        details: 'Implement comprehensive buyer intent tracking across all touchpoints. We configure event tracking, engagement scoring, and Target Account identification so your Sales team knows exactly when prospects are ready to buy.',
        deliverables: ['Intent tracking setup', 'Engagement scoring', 'Target Account configuration', 'Sales dashboards'],
        timeline: '5 business days'
    }
];

const DEFAULT_SETTINGS = {
    site_title: 'Build Your Growth Stack',
    site_subtitle: 'Select the HubSpot jobs you need. No retainers. Just results.',
    logo_url: "https://goenvy.io/wp-content/uploads/2022/10/ENVY-Logo.svg",
    badge_url: "https://l.goenvy.io/hubfs/elite.svg",
    intro_text: 'We help businesses grow with expert HubSpot services. No long-term commitments, just results.',
    checkout_button_text: 'Request Consultation',
    catalog_title: 'Job Catalog',
    catalog_subtitle: 'Browse all available HubSpot jobs and their details'
};

async function seedDatabase() {
    console.log("Seeding database...")

    // 1. Seed Services
    console.log("Inserting services...")
    // Insert one by one to avoid issues if one fails (though bulk is fine usually)
    for (const service of DEFAULT_SERVICES) {
        const { error } = await supabase.from('services').insert(service)
        if (error) console.error("Error inserting service:", service.name, error)
        else console.log("Inserted:", service.name)
    }

    // 2. Seed Settings
    console.log("Inserting settings...")
    const { error: settingsError } = await supabase
        .from('ui_settings')
        .upsert({ id: 1, ...DEFAULT_SETTINGS })

    if (settingsError) console.error("Error settings:", settingsError)
    else console.log("Settings seeded.")

    console.log("Done. Please refresh your app.")
}

seedDatabase()
