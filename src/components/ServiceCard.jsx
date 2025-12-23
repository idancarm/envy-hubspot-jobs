import React from 'react';
import { IconDrag } from './Icons';

const ServiceCard = ({ service, onDragStart, onViewDetails }) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, service)}
            className="group relative p-5 rounded-xl bg-surface border border-slate-800 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(0,255,194,0.1)] transition-all duration-300 cursor-grab active:cursor-grabbing flex flex-col gap-3"
        >
            <div className="flex justify-between items-start">
                <h3 className="font-semibold text-dark text-lg font-heading">{service.name}</h3>
                <IconDrag />
            </div>
            <p className="text-sm text-textMuted leading-relaxed">{service.description}</p>
            <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-800">
                <div className="flex flex-col">
                    <span className="text-primary font-bold tracking-wide text-lg">
                        {service.pricingModel === 'variable' ? 'From ' : ''}
                        ${service.price.toLocaleString()}
                        {service.pricingModel === 'hybrid' && <span className="text-sm font-normal text-textMuted"> + ${service.monthlyPrice}/mo</span>}
                    </span>
                    {service.pricingModel === 'hybrid' && <span className="text-[10px] text-textMuted uppercase">Setup + Monthly</span>}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent drag start if clicked
                            onViewDetails(service);
                        }}
                        className="text-xs font-bold text-primary hover:text-white border border-primary/30 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all"
                    >
                        Learn More
                    </button>
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wider group-hover:text-primary transition-colors hidden sm:block">Drag to add</span>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
