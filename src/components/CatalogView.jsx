import React from 'react';
import CatalogCard from './CatalogCard';

const CatalogView = ({ services, onViewDetails, uiSettings }) => {
    return (
        <div className="glass-panel rounded-2xl p-6 lg:p-8">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-dark font-heading mb-2">
                    {uiSettings?.catalogTitle || 'Job Catalog'}
                </h2>
                <p className="text-textMuted text-lg">
                    {uiSettings?.catalogSubtitle || 'Browse all available HubSpot jobs and their details'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.length === 0 ? (
                    <div className="col-span-2 text-center py-12 text-gray-600">
                        No jobs available. Switch to Admin mode to add some.
                    </div>
                ) : (
                    services.map(service => (
                        <CatalogCard
                            key={service.id}
                            service={service}
                            onViewDetails={onViewDetails}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default CatalogView;
