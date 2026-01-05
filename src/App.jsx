import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { IconSettings } from './components/Icons';

import JobDetailPage from './components/JobDetailPage';
import AdminPanel from './components/AdminPanel';
import CheckoutModal from './components/CheckoutModal';
import FAQView from './components/FAQView';
import MainLayout from './components/MainLayout';
import JobCatalogView from './components/JobCatalogView';
import { api } from './services/api';
import { submitToHubSpot } from './services/hubspot';

// Logo URLs
const ENVY_LOGO_URL = "https://goenvy.io/wp-content/uploads/2022/10/ENVY-Logo.svg";
const HUBSPOT_BADGE_URL = "https://l.goenvy.io/hubfs/elite.svg";

// HubSpot Configuration
const HUBSPOT_PORTAL_ID = import.meta.env.VITE_HUBSPOT_PORTAL_ID;
const HUBSPOT_FORM_GUID = import.meta.env.VITE_HUBSPOT_FORM_GUID;

// --- Data ---
const DEFAULT_SERVICES = [
  {
    id: 1,
    name: 'Automate Warm Outreach',
    description: 'Set up tracking for high-intent activities and configure Target Account settings so Sales can stop guessing.',
    price: 1200,
    details: 'Our custom n8n agent monitors prospect behavior across your website, email campaigns, and CRM. When high-intent signals are detected, it automatically triggers personalized outreach sequences. This includes configuring Target Account settings, lead scoring automation, and Sales notification workflows.',
    deliverables: ['Custom n8n workflow setup', 'Target Account configuration', 'Lead scoring rules', 'Sales notification system'],
    timeline: '5 business days'
  },
  {
    id: 2,
    name: 'Configure Your ICP',
    description: 'Codify your Ideal Customer Profiles (ICP) into properties and scoring rules. Yes, for real.',
    price: 1100,
    details: 'We translate your ICP from slide decks into actionable HubSpot properties and automated scoring. This ensures your entire team works from the same definition of your ideal customer, with automatic lead qualification based on firmographic and behavioral data.',
    deliverables: ['Custom ICP properties', 'Automated scoring system', 'Segmentation lists', 'Documentation'],
    timeline: '5 business days'
  },
  {
    id: 3,
    name: 'Smart CRM Updates',
    description: 'Let your CRM update itself using HubSpot\'s new smart properties and automated data enrichment tools.',
    price: 850,
    details: 'Leverage HubSpot\'s AI-powered smart properties and data enrichment to keep your CRM fresh without manual work. We configure automated data updates, company enrichment, and intelligent field population based on prospect interactions.',
    deliverables: ['Smart property configuration', 'Data enrichment setup', 'Automated workflows', 'Quality checks'],
    timeline: '3 business days'
  },
  {
    id: 4,
    name: 'Configure Buyer Intent',
    description: 'Set up tracking for high-intent activities and configure Target Account settings for precision targeting.',
    price: 1200,
    details: 'Implement comprehensive buyer intent tracking across all touchpoints. We configure event tracking, engagement scoring, and Target Account identification so your Sales team knows exactly when prospects are ready to buy.',
    deliverables: ['Intent tracking setup', 'Engagement scoring', 'Target Account configuration', 'Sales dashboards'],
    timeline: '5 business days'
  },
];

const DEFAULT_BUNDLES = [
  {
    id: 1,
    name: 'RevOps Starter Pack',
    description: 'Essential setup for scaling revenue operations',
    serviceIds: [2, 3], // ICP + Smart CRM
    discount: 10, // percentage
    price: 1755 // calculated: (1100 + 850) * 0.9
  },
  {
    id: 2,
    name: 'Sales Acceleration Bundle',
    description: 'Complete sales enablement package',
    serviceIds: [1, 4], // Warm Outreach + Buyer Intent
    discount: 15,
    price: 2040 // calculated: (1200 + 1200) * 0.85
  }
];

const DEFAULT_UI_SETTINGS = {
  siteTitle: 'Build Your Growth Stack',
  siteSubtitle: "HubSpot's no longer simple.",
  logoUrl: ENVY_LOGO_URL,
  badgeUrl: HUBSPOT_BADGE_URL,
  introVideoId: '',
  introText: 'We help businesses grow with expert HubSpot services. No long-term commitments, just results.',
  checkoutButtonText: 'Request Consultation',
  catalogTitle: 'Job Catalog',
  catalogSubtitle: 'Browse all available HubSpot jobs and their details',
  // Hero section text
  heroHeadline: 'Your HubSpot Tune-Up Starts Here',
  heroSubheadline: 'Fixed-scope projects led by senior RevOps experts. No retainers, no fluff.',
  heroBadge1Title: '100+ Portals',
  heroBadge1Subtitle: 'Managed by our senior team',
  heroBadge2Title: 'Fixed Scope',
  heroBadge2Subtitle: 'Clear deliverables, no surprises',
  heroBadge3Title: 'Fast Delivery',
  heroBadge3Subtitle: 'Most jobs done in days, not weeks'
};

function App() {
  // State
  const [services, setServices] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [uiSettings, setUiSettings] = useState(DEFAULT_UI_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('envy_admin_auth') === 'true';
  });

  const navigate = useNavigate();

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch Services
        let fetchedServices = await api.getServices();
        if (!fetchedServices || fetchedServices.length === 0) {
          // Fallback to defaults if DB is empty, but don't auto-write to avoid spamming
          fetchedServices = DEFAULT_SERVICES;
        }
        setServices(fetchedServices);

        // Fetch Bundles
        let fetchedBundles = await api.getBundles();
        if (!fetchedBundles || fetchedBundles.length === 0) {
          fetchedBundles = DEFAULT_BUNDLES;
        }
        setBundles(fetchedBundles);

        // Fetch Settings
        const fetchedSettings = await api.getSettings();
        if (fetchedSettings) {
          const mappedSettings = {
            siteTitle: fetchedSettings.site_title || fetchedSettings.siteTitle || DEFAULT_UI_SETTINGS.siteTitle,
            siteSubtitle: fetchedSettings.site_subtitle || fetchedSettings.siteSubtitle || DEFAULT_UI_SETTINGS.siteSubtitle,
            logoUrl: fetchedSettings.logo_url || fetchedSettings.logoUrl || DEFAULT_UI_SETTINGS.logoUrl,
            badgeUrl: fetchedSettings.badge_url || fetchedSettings.badgeUrl || DEFAULT_UI_SETTINGS.badgeUrl,
            introVideoId: fetchedSettings.intro_video_id || fetchedSettings.introVideoId || DEFAULT_UI_SETTINGS.introVideoId,
            introText: fetchedSettings.intro_text || fetchedSettings.introText || DEFAULT_UI_SETTINGS.introText,
            checkoutButtonText: fetchedSettings.checkout_button_text || fetchedSettings.checkoutButtonText || DEFAULT_UI_SETTINGS.checkoutButtonText,
            catalogTitle: fetchedSettings.catalog_title || fetchedSettings.catalogTitle || DEFAULT_UI_SETTINGS.catalogTitle,
            catalogSubtitle: fetchedSettings.catalog_subtitle || fetchedSettings.catalogSubtitle || DEFAULT_UI_SETTINGS.catalogSubtitle,
            // Hero section fields
            heroHeadline: fetchedSettings.hero_headline || fetchedSettings.heroHeadline || DEFAULT_UI_SETTINGS.heroHeadline,
            heroSubheadline: fetchedSettings.hero_subheadline || fetchedSettings.heroSubheadline || DEFAULT_UI_SETTINGS.heroSubheadline,
            heroBadge1Title: fetchedSettings.hero_badge1_title || fetchedSettings.heroBadge1Title || DEFAULT_UI_SETTINGS.heroBadge1Title,
            heroBadge1Subtitle: fetchedSettings.hero_badge1_subtitle || fetchedSettings.heroBadge1Subtitle || DEFAULT_UI_SETTINGS.heroBadge1Subtitle,
            heroBadge2Title: fetchedSettings.hero_badge2_title || fetchedSettings.heroBadge2Title || DEFAULT_UI_SETTINGS.heroBadge2Title,
            heroBadge2Subtitle: fetchedSettings.hero_badge2_subtitle || fetchedSettings.heroBadge2Subtitle || DEFAULT_UI_SETTINGS.heroBadge2Subtitle,
            heroBadge3Title: fetchedSettings.hero_badge3_title || fetchedSettings.heroBadge3Title || DEFAULT_UI_SETTINGS.heroBadge3Title,
            heroBadge3Subtitle: fetchedSettings.hero_badge3_subtitle || fetchedSettings.heroBadge3Subtitle || DEFAULT_UI_SETTINGS.heroBadge3Subtitle,
          };
          setUiSettings(mappedSettings);
        }

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err.message);
        // Fallback to defaults on error
        setServices(DEFAULT_SERVICES);
        setBundles(DEFAULT_BUNDLES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Persistence for Admin Auth only
  useEffect(() => {
    localStorage.setItem('envy_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  // Admin Login
  const handleAdminLogin = () => {
    const password = prompt('Enter admin password:');
    if (password === 'envy2024') { // Simple password check
      setIsAdminAuthenticated(true);
      navigate('/admin');
    } else if (password !== null) {
      alert('Incorrect password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    navigate('/');
  };

  // Admin Handlers
  const handleAddService = async (newService) => {
    try {
      // Optimistic update
      const tempId = Math.max(...services.map(s => s.id), 0) + 1;
      const optimisitcService = { ...newService, id: tempId };
      setServices([...services, optimisitcService]);

      // API Call
      const savedService = await api.addService(newService);
      if (savedService) {
        // Replace optimistic with real
        setServices(prev => prev.map(s => s.id === tempId ? savedService : s));
      }
    } catch (err) {
      console.error("Failed to add service:", err);
      // Suppress alert if it's likely just a return value issue (e.g. RLS)
      // alert("Failed to save service to cloud."); 
    }
  };

  const handleEditService = async (id, updatedService) => {
    try {
      setServices(services.map(s => s.id === id ? { ...updatedService, id } : s));
      await api.updateService(id, updatedService);
    } catch (err) {
      console.error("Failed to update service:", err);
      // If the error relates to a missing column, it will say so
      alert(`Failed to update service in cloud. Error: ${err.message}`);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      setServices(services.filter(s => s.id !== id));
      setCartItems(cartItems.filter(item => item.id !== id));
      await api.deleteService(id);
    } catch (err) {
      console.error("Failed to delete service:", err);
      // Suppress or format error
      alert(`Failed to delete service from cloud. Error: ${err.message || err}`);
    }
  };

  const handleReorderServices = async (reorderedServices) => {
    try {
      // Optimistic update
      setServices(reorderedServices);

      // Prepare payload: map each service to its new index
      const updates = reorderedServices.map((s, index) => ({
        id: s.id,
        sort_order: index
      }));

      await api.updateServicesOrder(updates);
    } catch (err) {
      console.error("Failed to reorder services:", err);
      alert("Failed to save service order.");
    }
  };

  // Bundle Handlers
  const handleAddBundle = async (newBundle) => {
    try {
      const tempId = Math.max(...bundles.map(b => b.id), 0) + 1;
      setBundles([...bundles, { ...newBundle, id: tempId }]);

      const savedBundle = await api.addBundle(newBundle);
      if (savedBundle) {
        setBundles(prev => prev.map(b => b.id === tempId ? savedBundle : b));
      }
    } catch (err) {
      console.error("Failed to add bundle:", err);
    }
  };

  const handleEditBundle = async (id, updatedBundle) => {
    try {
      setBundles(bundles.map(b => b.id === id ? { ...updatedBundle, id } : b));
      await api.updateBundle(id, updatedBundle);
    } catch (err) {
      console.error("Failed to update bundle:", err);
    }
  };

  const handleDeleteBundle = async (id) => {
    try {
      setBundles(bundles.filter(b => b.id !== id));
      await api.deleteBundle(id);
    } catch (err) {
      console.error("Failed to delete bundle:", err);
    }
  };

  const handleUpdateSettings = async (newSettings) => {
    try {
      setUiSettings(newSettings);
      // Map back to snake_case for DB if needed
      const dbSettings = {
        site_title: newSettings.siteTitle,
        site_subtitle: newSettings.siteSubtitle,
        logo_url: newSettings.logoUrl,
        badge_url: newSettings.badgeUrl,
        intro_video_id: newSettings.introVideoId,
        intro_text: newSettings.introText,
        checkout_button_text: newSettings.checkoutButtonText,
        catalog_title: newSettings.catalogTitle,
        catalog_subtitle: newSettings.catalogSubtitle,
        // Hero section fields
        hero_headline: newSettings.heroHeadline,
        hero_subheadline: newSettings.heroSubheadline,
        hero_badge1_title: newSettings.heroBadge1Title,
        hero_badge1_subtitle: newSettings.heroBadge1Subtitle,
        hero_badge2_title: newSettings.heroBadge2Title,
        hero_badge2_subtitle: newSettings.heroBadge2Subtitle,
        hero_badge3_title: newSettings.heroBadge3Title,
        hero_badge3_subtitle: newSettings.heroBadge3Subtitle
      };
      await api.updateSettings(dbSettings);
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  const handleAddItemToCart = (item) => {
    setCartItems(prev => [...prev, item]);
    // Optional: Navigate to checkout or show success message
    if (confirm(`Added ${item.name} to checkout. Go to checkout now?`)) {
      navigate('/');
    }
  };

  const handleRemoveItem = (uniqueId) => {
    setCartItems(prev => prev.filter(item => item.uniqueId !== uniqueId));
  };

  const totalCost = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price, 0);
  }, [cartItems]);

  const handleCheckoutInitiate = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    const { firstName, lastName, email } = formData;

    try {
      setIsSubmitting(true);

      // Format cart items for the message
      const description = cartItems.map(item =>
        `- ${item.name} ($${item.price})`
      ).join('\n');

      const message = `Selected Services:\n${description}\n\nTotal Estimated Cost: $${totalCost.toLocaleString()}`;

      // HubSpot Form Fields
      const fields = [
        { name: 'email', value: email },
        { name: 'firstname', value: firstName },
        { name: 'lastname', value: lastName },
        { name: 'message', value: message },
      ];

      // Submit to HubSpot
      await submitToHubSpot(HUBSPOT_PORTAL_ID, HUBSPOT_FORM_GUID, fields);

      console.log("HubSpot submission successful");
      setIsCheckoutModalOpen(false);
      alert(`Thank you, ${firstName}! Your request has been received.\n\nWe have sent a confirmation to ${email}.`);

      setCartItems([]); // Clear the cart
      navigate('/');

    } catch (err) {
      console.error("Checkout validation failed:", err);
      if (err.message.includes("PortalId") || !HUBSPOT_PORTAL_ID) {
        alert("Configuration Error: Please check your .env file for VITE_HUBSPOT_PORTAL_ID.");
      } else {
        alert("Sorry, there was a problem submitting your request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16 max-w-7xl min-h-screen flex flex-col">
      <Helmet>
        <title>{uiSettings.siteTitle} | {uiSettings.siteSubtitle}</title>
        <meta name="description" content={uiSettings.introText} />
        <meta property="og:title" content={`${uiSettings.siteTitle} | ${uiSettings.siteSubtitle}`} />
        <meta property="og:description" content={uiSettings.introText} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={uiSettings.logoUrl} />
      </Helmet>
      {/* Logo Bar */}
      <div className="bg-white rounded-2xl shadow-lg mb-8 px-8 py-4">
        <div className="flex justify-between items-center">
          <a href="https://goenvy.io" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
            <img src={uiSettings.logoUrl} alt="Logo" className="h-8 lg:h-10" />
          </a>
          <div className="flex items-center gap-4">
            <img src={uiSettings.badgeUrl} alt="Badge" className="h-12 lg:h-16" />
            {!isAdminAuthenticated ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAdminLogin();
                }}
                className="p-2 text-gray-400 hover:text-primary opacity-50 hover:opacity-100 transition-all duration-300"
                title="Admin Login"
              >
                <IconSettings />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAdminLogout();
                }}
                className="px-3 py-1.5 text-xs font-medium text-primary hover:text-secondary hover:bg-primary/10 rounded-lg transition-colors"
                title="Logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-6xl font-bold text-dark mb-2 tracking-tight font-heading">
            {uiSettings.siteTitle}
          </h1>
          <p className="text-textMuted text-lg font-light">
            {uiSettings.siteSubtitle}
          </p>
        </div>
      </header>

      <Routes>
        <Route element={
          <MainLayout
            uiSettings={uiSettings}
            isAdminAuthenticated={isAdminAuthenticated}
          />
        }>
          <Route path="/" element={
            <JobCatalogView
              services={services}
              bundles={bundles}
              cartItems={cartItems}
              totalCost={totalCost}
              onAddItem={handleAddItemToCart}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckoutInitiate}
              uiSettings={uiSettings}
              isSubmitting={isSubmitting}
            />
          } />
          <Route path="/faq" element={<FAQView />} />
          <Route path="/admin" element={
            <AdminPanel
              services={services}
              bundles={bundles}
              onAdd={handleAddService}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onReorder={handleReorderServices}
              onAddBundle={handleAddBundle}
              onEditBundle={handleEditBundle}
              onDeleteBundle={handleDeleteBundle}
              uiSettings={uiSettings}
              onUpdateSettings={handleUpdateSettings}
              onClose={() => navigate('/')}
            />
          } />
        </Route>
        <Route path="/jobs/:id" element={
          <JobDetailPage
            services={services}
            onAddToCart={handleAddItemToCart}
          />
        } />
      </Routes>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        onSubmit={handleModalSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default App;
