import React, { useState, useEffect, useMemo } from 'react';
import { IconGrid, IconCalculator, IconSettings, IconDrag } from './components/Icons';
import CatalogView from './components/CatalogView';
import JobDetailPage from './components/JobDetailPage';
import AdminPanel from './components/AdminPanel';
import ServiceCard from './components/ServiceCard';
import BundleCard from './components/BundleCard';
import CartItem from './components/CartItem';
import CheckoutModal from './components/CheckoutModal';
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
  siteSubtitle: 'Select the HubSpot jobs you need. No retainers. Just results.',
  logoUrl: ENVY_LOGO_URL,
  badgeUrl: HUBSPOT_BADGE_URL,
  introVideoId: '',
  introText: 'We help businesses grow with expert HubSpot services. No long-term commitments, just results.',
  checkoutButtonText: 'Request Consultation',
  catalogTitle: 'Job Catalog',
  catalogSubtitle: 'Browse all available HubSpot jobs and their details'
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
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [currentView, setCurrentView] = useState('catalog'); // 'checkout', 'catalog', 'admin', 'detail'
  const [selectedJob, setSelectedJob] = useState(null); // For detail view
  const [checkoutTab, setCheckoutTab] = useState('jobs'); // 'jobs', 'bundles'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('envy_admin_auth') === 'true';
  });

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
      setCurrentView('admin');
    } else if (password !== null) {
      alert('Incorrect password');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('catalog');
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
        catalog_subtitle: newSettings.catalogSubtitle
      };
      await api.updateSettings(dbSettings);
    } catch (err) {
      console.error("Failed to update settings:", err);
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e, item, isBundle = false) => {
    if (isBundle) {
      e.dataTransfer.setData("bundleId", item.id);
    } else {
      e.dataTransfer.setData("serviceId", item.id);
    }
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const serviceId = e.dataTransfer.getData("serviceId");
    const bundleId = e.dataTransfer.getData("bundleId");

    if (bundleId) {
      const bundle = bundles.find(b => b.id === parseInt(bundleId, 10));
      if (bundle) {
        const newItem = { ...bundle, uniqueId: Date.now() + Math.random(), isBundle: true };
        setCartItems(prev => [...prev, newItem]);
      }
    } else if (serviceId) {
      const service = services.find(s => s.id === parseInt(serviceId, 10));
      if (service) {
        const newItem = { ...service, uniqueId: Date.now() + Math.random() };
        setCartItems(prev => [...prev, newItem]);
      }
    }
  };

  const handleAddItemToCart = (item) => {
    setCartItems(prev => [...prev, item]);
    // Optional: Navigate to checkout or show success message
    if (confirm(`Added ${item.name} to checkout. Go to checkout now?`)) {
      setCurrentView('checkout');
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
      setCurrentView('catalog'); // Return to catalog

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

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setCurrentView('detail');
  };

  const handleBackToCatalog = () => {
    setSelectedJob(null);
    setCurrentView('catalog');
  };

  const handleAddToCartFromDetail = (job) => {
    const newItem = { ...job, uniqueId: Date.now() + Math.random() };
    handleAddItemToCart(newItem);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16 max-w-7xl min-h-screen flex flex-col">
      {/* Logo Bar */}
      <div className="bg-white rounded-2xl shadow-lg mb-8 px-8 py-4">
        <div className="flex justify-between items-center">
          <img src={uiSettings.logoUrl} alt="Logo" className="h-8 lg:h-10" />
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

        {/* Intro Section - Video and Stats */}
        {currentView !== 'detail' && (
          <div className="glass-panel rounded-2xl p-8 lg:p-12 mb-8 max-w-6xl mx-auto overflow-hidden">
            {/* Hero Headline */}
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-5xl font-bold text-dark mb-3 tracking-tight font-heading">
                Your HubSpot Tune-Up Starts Here
              </h2>
              <p className="text-textMuted text-lg max-w-2xl mx-auto">
                Fixed-scope projects led by senior RevOps experts. No retainers, no fluff.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Left Column - Video */}
              <div>
                {uiSettings.introVideoId ? (
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 relative pt-[56.25%] bg-black">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${uiSettings.introVideoId}`}
                      title="Introduction video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 relative pt-[56.25%]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                      <p className="text-sm">Add video in Admin Settings</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Stats Badges */}
              <div className="flex flex-col gap-5">
                {/* Stat Badge 1 */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm rounded-xl p-5 border border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-dark">100+ Portals</div>
                      <div className="text-textMuted text-sm">Managed by our senior team</div>
                    </div>
                  </div>
                </div>

                {/* Stat Badge 2 */}
                <div className="bg-gradient-to-r from-secondary/10 to-accent/10 backdrop-blur-sm rounded-xl p-5 border border-secondary/20 hover:border-secondary/40 transition-all hover:shadow-lg group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-dark">Fixed Scope</div>
                      <div className="text-textMuted text-sm">Clear deliverables, no surprises</div>
                    </div>
                  </div>
                </div>

                {/* Stat Badge 3 */}
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 backdrop-blur-sm rounded-xl p-5 border border-accent/30 hover:border-accent/50 transition-all hover:shadow-lg group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-accent/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-7 h-7 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-dark">Fast Delivery</div>
                      <div className="text-textMuted text-sm">Most jobs done in days, not weeks</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs - Hide on detail view */}
        {currentView !== 'detail' && (
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentView('catalog')}
              className={`
                            flex items-center gap-2 px-6 py-3 rounded-full border transition-all font-medium
                            ${currentView === 'catalog'
                  ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,255,194,0.3)]'
                  : 'bg-gray-100/50 text-textMuted border-gray-300 hover:border-slate-500 hover:text-gray-700'}
                        `}
            >
              <IconGrid />
              <span>Catalog</span>
            </button>
            <button
              onClick={() => setCurrentView('checkout')}
              className={`
                            flex items-center gap-2 px-6 py-3 rounded-full border transition-all font-medium
                            ${currentView === 'checkout'
                  ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,255,194,0.3)]'
                  : 'bg-gray-100/50 text-textMuted border-gray-300 hover:border-slate-500 hover:text-gray-700'}
                        `}
            >
              <IconCalculator />
              <span>Checkout</span>
            </button>
            {isAdminAuthenticated && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`
                                flex items-center gap-2 px-6 py-3 rounded-full border transition-all font-medium
                                ${currentView === 'admin'
                    ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,255,194,0.3)]'
                    : 'bg-gray-100/50 text-textMuted border-gray-300 hover:border-slate-500 hover:text-gray-700'}
                            `}
              >
                <IconSettings />
                <span>Admin</span>
              </button>
            )}
          </div>
        )}
      </header>

      {currentView === 'admin' ? (
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
          onClose={() => setCurrentView('catalog')}
        />
      ) : currentView === 'catalog' ? (
        <CatalogView services={services} onViewDetails={handleViewDetails} uiSettings={uiSettings} />
      ) : currentView === 'detail' && selectedJob ? (
        <JobDetailPage
          job={selectedJob}
          onBack={handleBackToCatalog}
          onAddToCart={handleAddToCartFromDetail}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 relative flex-1">

          {/* Left Column: Service Selector */}
          <div className="w-full lg:w-1/2">
            <div className="glass-panel rounded-2xl p-6 lg:p-8 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-dark flex items-center gap-3 font-heading">
                  <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_#00FFC2]"></span>
                  Build Your Package
                </h2>
                <div className="flex bg-gray-100/50 rounded-lg p-1">
                  <button
                    onClick={() => setCheckoutTab('jobs')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${checkoutTab === 'jobs' ? 'bg-primary text-black shadow-lg' : 'text-textMuted hover:text-dark'}`}
                  >
                    Jobs
                  </button>
                  <button
                    onClick={() => setCheckoutTab('bundles')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${checkoutTab === 'bundles' ? 'bg-primary text-black shadow-lg' : 'text-textMuted hover:text-dark'}`}
                  >
                    Bundles
                  </button>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-2 text-textMuted text-sm">
                <IconDrag />
                <span>Drag items to the right to build your stack</span>
              </div>

              {checkoutTab === 'bundles' ? (
                <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                  {bundles.length > 0 ? (
                    bundles.map(bundle => (
                      <BundleCard
                        key={bundle.id}
                        bundle={bundle}
                        services={services}
                        onDragStart={handleDragStart}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-600">
                      No bundles available.
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 animate-fadeIn">
                  {services.length === 0 ? (
                    <div className="text-center py-12 text-gray-600">
                      No jobs available. Switch to Admin mode to add some.
                    </div>
                  ) : (
                    services.map(service => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        onDragStart={handleDragStart}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Summary / Cart */}
          <div className="w-full lg:w-1/2">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                                glass-panel rounded-2xl p-6 lg:p-8 h-full flex flex-col transition-all duration-300 border-2
                                ${isDraggingOver
                  ? 'border-primary bg-primary/5 shadow-[0_0_30px_rgba(0,255,194,0.1)]'
                  : 'border-transparent hover:border-slate-800'}
                            `}
            >
              <h2 className="text-2xl font-semibold text-dark mb-8 flex items-center gap-3 font-heading">
                <span className="w-1.5 h-8 bg-white rounded-full"></span>
                Your Scope
              </h2>

              <div className="flex-1 min-h-[200px] mb-8">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-slate-800 rounded-xl p-10">
                    <IconDrag />
                    <p className="mt-4 text-sm font-medium">Drag jobs here to build your scope</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <CartItem
                        key={item.uniqueId}
                        service={item}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Footer / Totals */}
              <div className="mt-auto pt-8 border-t border-gray-300">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-textMuted font-medium">Estimated Total</span>
                  <span className="text-4xl font-bold text-primary tracking-tight font-heading">
                    ${totalCost.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckoutInitiate}
                  disabled={cartItems.length === 0}
                  className={`
                                        w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 text-black
                                        ${cartItems.length === 0 || isSubmitting
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-primary hover:bg-secondary hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'}
                                    `}
                >
                  {uiSettings.checkoutButtonText || 'Request Consultation'}
                </button>
                <p className="text-center text-textMuted text-sm mt-4">
                  No payment required now. We'll review your request and contact you to discuss details.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
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
