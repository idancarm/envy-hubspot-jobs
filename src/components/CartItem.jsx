import React from 'react';
import { IconCheck, IconTrash } from './Icons';

const CartItem = ({ service, onRemove }) => {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-100/40 border border-gray-300/30 mb-2 animate-fadeIn">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`p-1.5 rounded-full flex-shrink-0 ${service.isBundle ? 'bg-primary text-black' : 'bg-primary text-black'}`}>
                    <IconCheck />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-dark truncate">{service.name}</h4>
                        {service.isBundle && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-primary/20 text-primary font-bold rounded uppercase">Bundle</span>
                        )}
                    </div>
                    <p className="text-xs text-primary">${service.price.toLocaleString()}</p>
                </div>
            </div>
            <button
                onClick={() => onRemove(service.uniqueId)}
                className="p-2 text-textMuted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-2"
                title="Remove"
            >
                <IconTrash />
            </button>
        </div>
    );
};

export default CartItem;
