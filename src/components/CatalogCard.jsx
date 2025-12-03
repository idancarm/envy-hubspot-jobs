import React from 'react';
import { IconInfo } from './Icons';

const CatalogCard = ({ service, onViewDetails }) => {
    // Rotate through Envy brand colors
    const colors = ['#FF1F6C', '#50D2C1', '#D6FE51'];
    const colorIndex = (service.id || 0) % colors.length;
    const bgColor = colors[colorIndex];
    const isDark = colorIndex === 0 || colorIndex === 1; // Pink and Teal are dark, Lime is light
    const textColor = isDark ? '#FFFFFF' : '#000000';

    return (
        <div
            className="rounded-xl p-6 flex flex-col gap-4 transition-all duration-300 group shadow-lg hover:shadow-xl"
            style={{ backgroundColor: bgColor }}
        >
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold font-heading" style={{ color: textColor }}>{service.name}</h3>
                <span className="font-bold text-lg" style={{ color: textColor }}>${(service.price || 0).toLocaleString()}</span>
            </div>

            <p className="text-sm leading-relaxed flex-1" style={{ color: textColor, opacity: 0.9 }}>{service.description}</p>

            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }}>
                <div className="flex items-center gap-2 text-xs" style={{ color: textColor, opacity: 0.8 }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{service.timeline || 'Flexible'}</span>
                </div>
                <button
                    onClick={() => onViewDetails(service)}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all"
                    style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                        color: textColor
                    }}
                >
                    <span>View Details</span>
                    <IconInfo />
                </button>
            </div>
        </div>
    );
};

export default CatalogCard;
