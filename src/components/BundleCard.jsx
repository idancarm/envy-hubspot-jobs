import React from 'react';
import { IconDrag, IconCheck } from './Icons';

const BundleCard = ({ bundle, services, onDragStart }) => {
    const includedServices = services.filter(s => bundle.serviceIds.includes(s.id));
    const originalPrice = includedServices.reduce((sum, s) => sum + s.price, 0);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, bundle, true)}
            className="group relative p-5 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30 hover:border-primary hover:shadow-[0_0_25px_rgba(0,255,194,0.2)] transition-all duration-300 cursor-grab active:cursor-grabbing flex flex-col gap-3"
        >
            <div className="flex justify-between items-start">
                <div>
                    <div className="inline-block px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded mb-2">
                        BUNDLE - SAVE {bundle.discount}%
                    </div>
                    <h3 className="font-semibold text-dark text-lg font-heading">{bundle.name}</h3>
                </div>
                <IconDrag />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{bundle.description}</p>
            <div className="space-y-1 my-2">
                <p className="text-xs text-gray-600 uppercase tracking-wider">Includes:</p>
                {includedServices.map(service => (
                    <div key={service.id} className="text-xs text-textMuted flex items-center gap-2">
                        <IconCheck />
                        <span>{service.name}</span>
                    </div>
                ))}
            </div>
            <div className="mt-auto pt-4 flex justify-between items-center border-t border-primary/20">
                <div>
                    <span className="text-gray-600 line-through text-sm">${originalPrice.toLocaleString()}</span>
                    <span className="text-primary font-bold tracking-wide text-xl ml-2">${bundle.price.toLocaleString()}</span>
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wider group-hover:text-dark transition-colors">Drag to add</span>
            </div>
        </div>
    );
};

export default BundleCard;
