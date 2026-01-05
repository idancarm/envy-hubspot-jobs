import React, { useState } from 'react';
import { IconDrag } from './Icons';
import ServiceCard from './ServiceCard';
import BundleCard from './BundleCard';
import CartItem from './CartItem';

const JobCatalogView = ({
    services,
    bundles,
    cartItems,
    totalCost,
    onAddItem,
    onRemoveItem,
    onCheckout,
    uiSettings,
    isSubmitting
}) => {
    const [checkoutTab, setCheckoutTab] = useState('jobs'); // 'jobs', 'bundles'
    const [isDraggingOver, setIsDraggingOver] = useState(false);

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
                onAddItem(newItem);
            }
        } else if (serviceId) {
            const service = services.find(s => s.id === parseInt(serviceId, 10));
            if (service) {
                const newItem = { ...service, uniqueId: Date.now() + Math.random() };
                onAddItem(newItem);
            }
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 relative flex-1">
            {/* Left Column: Service Selector */}
            <div className="w-full lg:w-[55%]">
                <div className="glass-panel rounded-2xl p-6 lg:p-8 h-full overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-dark flex items-center gap-3 font-heading">
                            <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_#00FFC2]"></span>
                            Discover Jobs
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
                                    // onViewDetails removed as ServiceCard will use Link
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Summary / Cart */}
            <div className="w-full lg:w-[45%]">
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
                                        onRemove={onRemoveItem}
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
                            onClick={onCheckout}
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
    );
};

export default JobCatalogView;
