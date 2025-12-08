import React, { useState, useEffect } from 'react';
import { IconClose, IconSettings, IconEdit, IconTrash, IconDrag } from './Icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminPanel = ({ services, bundles, onAdd, onEdit, onDelete, onReorder, onAddBundle, onEditBundle, onDeleteBundle, uiSettings, onUpdateSettings, onClose }) => {

    const [activeTab, setActiveTab] = useState('services');
    const [editingId, setEditingId] = useState(null);

    // Settings Form
    const [settingsForm, setSettingsForm] = useState(uiSettings || {});

    useEffect(() => {
        if (uiSettings) setSettingsForm(uiSettings);
    }, [uiSettings]);

    const handleSettingsSave = (e) => {
        e.preventDefault();
        onUpdateSettings(settingsForm);
    };

    // Service Form
    const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', details: '', timeline: '', deliverables: '', youtubeVideoId: '', screenshots: [] });

    // Bundle Form
    const [bundleForm, setBundleForm] = useState({ name: '', description: '', discount: '', serviceIds: [] });

    const handleServiceSubmit = (e) => {
        e.preventDefault();
        if (!serviceForm.name || !serviceForm.price) return;

        const payload = {
            ...serviceForm,
            price: Number(serviceForm.price),
            deliverables: typeof serviceForm.deliverables === 'string'
                ? serviceForm.deliverables.split(',').map(s => s.trim()).filter(Boolean)
                : serviceForm.deliverables
        };

        if (editingId) {
            onEdit(editingId, payload);
        } else {
            onAdd(payload);
        }
        resetForms();
    };

    const handleBundleSubmit = (e) => {
        e.preventDefault();
        if (!bundleForm.name || !bundleForm.discount || bundleForm.serviceIds.length === 0) return;

        const includedServices = services.filter(s => bundleForm.serviceIds.includes(s.id));
        const originalPrice = includedServices.reduce((sum, s) => sum + s.price, 0);
        const discountMultiplier = (100 - Number(bundleForm.discount)) / 100;
        const finalPrice = Math.round(originalPrice * discountMultiplier);

        const payload = {
            ...bundleForm,
            discount: Number(bundleForm.discount),
            price: finalPrice
        };

        if (editingId) {
            onEditBundle(editingId, payload);
        } else {
            onAddBundle(payload);
        }
        resetForms();
    };

    const handleEditClick = (item, type) => {
        setEditingId(item.id);
        if (type === 'service') {
            setServiceForm({
                name: item.name,
                description: item.description,
                price: item.price,
                details: item.details || '',
                timeline: item.timeline || '',
                deliverables: Array.isArray(item.deliverables) ? item.deliverables.join(', ') : (item.deliverables || ''),
                youtubeVideoId: item.youtubeVideoId || '',
                screenshots: item.screenshots || []
            });
        } else {
            setBundleForm({
                name: item.name,
                description: item.description,
                discount: item.discount,
                serviceIds: item.serviceIds || []
            });
        }
    };

    const resetForms = () => {
        setEditingId(null);
        setServiceForm({ name: '', description: '', price: '', details: '', timeline: '', deliverables: '', youtubeVideoId: '', screenshots: [] });
        setBundleForm({ name: '', description: '', discount: '', serviceIds: [] });
    };

    const toggleServiceInBundle = (serviceId) => {
        setBundleForm(prev => {
            const ids = prev.serviceIds.includes(serviceId)
                ? prev.serviceIds.filter(id => id !== serviceId)
                : [...prev.serviceIds, serviceId];
            return { ...prev, serviceIds: ids };
        });
    };

    // Screenshot Handlers
    const addScreenshot = () => {
        setServiceForm(prev => ({
            ...prev,
            screenshots: [...(prev.screenshots || []), { url: '', caption: '', description: '' }]
        }));
    };

    const removeScreenshot = (index) => {
        setServiceForm(prev => ({
            ...prev,
            screenshots: prev.screenshots.filter((_, i) => i !== index)
        }));
    };

    const updateScreenshot = (index, field, value) => {
        setServiceForm(prev => ({
            ...prev,
            screenshots: prev.screenshots.map((s, i) => i === index ? { ...s, [field]: value } : s)
        }));
    };

    // Drag and Drop Handlers
    const [draggedItemIndex, setDraggedItemIndex] = useState(null);

    const handleDragStart = (e, index) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = "move";
        // e.dataTransfer.setDragImage(e.target, 0, 0); 
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedItemIndex === null) return;
        if (draggedItemIndex === dropIndex) return;
        if (activeTab !== 'services' || !onReorder) return;

        // Move item
        const newServices = [...services];
        const [movedItem] = newServices.splice(draggedItemIndex, 1);
        newServices.splice(dropIndex, 0, movedItem);

        onReorder(newServices);
        setDraggedItemIndex(null);
    };

    return (
        <div className="glass-panel rounded-2xl p-6 lg:p-8 h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-6">
                    <h2 className="text-2xl font-semibold text-dark flex items-center gap-3 font-heading">
                        <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_#00FFC2]"></span>
                        Admin Panel
                    </h2>
                    <div className="flex bg-gray-100/50 rounded-lg p-1">
                        <button
                            onClick={() => { setActiveTab('services'); resetForms(); }}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'services' ? 'bg-primary text-black shadow-lg' : 'text-textMuted hover:text-dark'}`}
                        >
                            Services
                        </button>
                        <button
                            onClick={() => { setActiveTab('bundles'); resetForms(); }}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'bundles' ? 'bg-primary text-black shadow-lg' : 'text-textMuted hover:text-dark'}`}
                        >
                            Bundles
                        </button>
                        <button
                            onClick={() => { setActiveTab('settings'); resetForms(); }}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-primary text-black shadow-lg' : 'text-textMuted hover:text-dark'}`}
                        >
                            Settings
                        </button>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-textMuted hover:text-dark">
                    <IconClose />
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 h-full overflow-hidden">
                {/* Form Column */}
                <div className="w-full lg:w-1/3 bg-gray-50/50 p-6 rounded-xl border border-slate-800 h-fit overflow-y-auto max-h-full">
                    <h3 className="text-lg font-medium text-dark mb-4">
                        {activeTab === 'settings' ? 'Global Settings' : editingId ? `Edit ${activeTab === 'services' ? 'Service' : 'Bundle'}` : `Add New ${activeTab === 'services' ? 'Service' : 'Bundle'}`}
                    </h3>

                    {activeTab === 'services' ? (
                        <form key={`service-form-${editingId || 'new'}`} onSubmit={handleServiceSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Name</label>
                                <input
                                    type="text"
                                    value={serviceForm.name}
                                    onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-textMuted mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        value={serviceForm.price}
                                        onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })}
                                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-textMuted mb-1">Timeline</label>
                                    <input
                                        type="text"
                                        value={serviceForm.timeline}
                                        onChange={e => setServiceForm({ ...serviceForm, timeline: e.target.value })}
                                        className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                        placeholder="e.g. 2 weeks"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Description (Short Summary)</label>
                                <textarea
                                    value={serviceForm.description}
                                    onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none resize-none h-20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Details (Full Overview)</label>
                                <div className="bg-white rounded-lg text-dark">
                                    <ReactQuill
                                        key={editingId || 'new'} // Force remount when editing different service
                                        theme="snow"
                                        value={serviceForm.details}
                                        onChange={value => setServiceForm({ ...serviceForm, details: value })}
                                        className="h-40 mb-12" // Add margin-bottom to clear toolbar if needed
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['clean']
                                            ]
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Deliverables (comma separated)</label>
                                <textarea
                                    value={serviceForm.deliverables}
                                    onChange={e => setServiceForm({ ...serviceForm, deliverables: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none resize-none h-20"
                                    placeholder="Item 1, Item 2, Item 3"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">YouTube Video ID</label>
                                <input
                                    type="text"
                                    value={serviceForm.youtubeVideoId || ''}
                                    onChange={e => setServiceForm({ ...serviceForm, youtubeVideoId: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                    placeholder="e.g. dQw4w9WgXcQ"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-2">Screenshots</label>
                                <div className="space-y-4">
                                    {(serviceForm.screenshots || []).map((shot, idx) => (
                                        <div key={idx} className="p-3 bg-gray-100/50 rounded-lg border border-gray-300 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-bold text-gray-600">Screenshot #{idx + 1}</span>
                                                <button type="button" onClick={() => removeScreenshot(idx)} className="text-red-400 hover:text-red-300">
                                                    <IconTrash />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={shot.url}
                                                onChange={e => updateScreenshot(idx, 'url', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs text-dark"
                                                placeholder="Image URL"
                                            />
                                            <input
                                                type="text"
                                                value={shot.caption}
                                                onChange={e => updateScreenshot(idx, 'caption', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs text-dark"
                                                placeholder="Caption"
                                            />
                                            <textarea
                                                value={shot.description}
                                                onChange={e => updateScreenshot(idx, 'description', e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs text-dark resize-none h-16"
                                                placeholder="Description"
                                            />
                                        </div>
                                    ))}
                                    <button type="button" onClick={addScreenshot} className="w-full py-2 border border-dashed border-gray-400 rounded-lg text-textMuted hover:text-dark hover:border-slate-400 text-xs transition-colors">
                                        + Add Screenshot
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="flex-1 bg-primary text-black font-bold py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
                                    {editingId ? 'Update Service' : 'Add Service'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={resetForms} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-slate-700 transition-colors text-sm">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    ) : activeTab === 'bundles' ? (
                        <form onSubmit={handleBundleSubmit} className="space-y-4">
                            {/* Bundle Form Content */}
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Bundle Name</label>
                                <input
                                    type="text"
                                    value={bundleForm.name}
                                    onChange={e => setBundleForm({ ...bundleForm, name: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Discount (%)</label>
                                <input
                                    type="number"
                                    value={bundleForm.discount}
                                    onChange={e => setBundleForm({ ...bundleForm, discount: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Description</label>
                                <textarea
                                    value={bundleForm.description}
                                    onChange={e => setBundleForm({ ...bundleForm, description: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none resize-none h-20"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-2">Included Services</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-gray-100">
                                    {services.map(service => (
                                        <div
                                            key={service.id}
                                            onClick={() => toggleServiceInBundle(service.id)}
                                            className={`p-2 rounded cursor-pointer flex items-center justify-between text-xs transition-colors ${bundleForm.serviceIds.includes(service.id) ? 'bg-primary text-black' : 'hover:bg-gray-200 text-dark'}`}
                                        >
                                            <span>{service.name}</span>
                                            {bundleForm.serviceIds.includes(service.id) && <span className="font-bold">✓</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="flex-1 bg-primary text-black font-bold py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
                                    {editingId ? 'Update Bundle' : 'Add Bundle'}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={resetForms} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-slate-700 transition-colors text-sm">
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSettingsSave} className="space-y-4">
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Site Title</label>
                                <input
                                    type="text"
                                    value={settingsForm.siteTitle || ''}
                                    onChange={e => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Site Subtitle</label>
                                <input
                                    type="text"
                                    value={settingsForm.siteSubtitle || ''}
                                    onChange={e => setSettingsForm({ ...settingsForm, siteSubtitle: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Logo URL</label>
                                <input
                                    type="text"
                                    value={settingsForm.logoUrl || ''}
                                    onChange={e => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Badge URL</label>
                                <input
                                    type="text"
                                    value={settingsForm.badgeUrl || ''}
                                    onChange={e => setSettingsForm({ ...settingsForm, badgeUrl: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Intro Video ID (YouTube)</label>
                                <input
                                    type="text"
                                    value={settingsForm.introVideoId || ''}
                                    onChange={e => setSettingsForm({ ...settingsForm, introVideoId: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Intro Text</label>
                                <textarea
                                    value={settingsForm.introText || ''}
                                    onChange={e => setSettingsForm({ ...settingsForm, introText: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none resize-none h-24"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-textMuted mb-1">Checkout Button Text</label>
                                <input
                                    type="text"
                                    value={settingsForm.checkoutButtonText || ''}
                                    onChange={e => setSettingsForm({ ...settingsForm, checkoutButtonText: e.target.value })}
                                    className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-dark text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary text-black font-bold py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
                                Save Settings
                            </button>
                        </form>
                    )}
                </div>

                {/* List Column */}
                <div className="flex-1 bg-white rounded-xl border border-slate-800 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-gray-50/50">
                        <h3 className="font-medium text-dark">
                            Existing {activeTab === 'services' ? 'Services' : activeTab === 'bundles' ? 'Bundles' : 'Settings'}
                        </h3>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4">
                        <table className="w-full admin-table text-sm table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-8"></th>
                                    <th className="w-1/4">Name</th>
                                    <th className="w-5/12">{activeTab === 'services' ? 'Description' : 'Contents'}</th>
                                    <th className="w-1/6">Price</th>
                                    <th className="w-1/6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'services' ? (
                                    services.map((service, index) => (
                                        <tr
                                            key={service.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, index)}
                                            className={`hover:bg-gray-100/30 transition-colors ${draggedItemIndex === index ? 'opacity-50 settings_drag_dragging' : ''}`}
                                        >
                                            <td className="w-8 text-center cursor-move text-textMuted hover:text-dark">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <IconDrag />
                                                </div>
                                            </td>
                                            <td className="font-medium text-dark">{service.name}</td>
                                            <td className="text-textMuted truncate max-w-xs">{service.description}</td>
                                            <td className="text-primary font-medium">${service.price.toLocaleString()}</td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEditClick(service, 'service')} className="p-2 text-textMuted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                        <IconEdit />
                                                    </button>
                                                    <button onClick={() => onDelete(service.id)} className="p-2 text-textMuted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : activeTab === 'bundles' ? (
                                    bundles.map(bundle => (
                                        <tr key={bundle.id} className="hover:bg-gray-100/30 transition-colors">
                                            <td className="w-8"></td> {/* Spacer for bundles if not sortable yet */}
                                            <td className="font-medium text-dark">
                                                {bundle.name}
                                                <span className="ml-2 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">-{bundle.discount}%</span>
                                            </td>
                                            <td className="text-textMuted">
                                                {bundle.serviceIds.length} services included
                                            </td>
                                            <td className="text-primary font-medium">${bundle.price.toLocaleString()}</td>
                                            <td className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleEditClick(bundle, 'bundle')} className="p-2 text-textMuted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                                                        <IconEdit />
                                                    </button>
                                                    <button onClick={() => onDeleteBundle(bundle.id)} className="p-2 text-textMuted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12 text-gray-600">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 rounded-full bg-gray-100/50">
                                                    <IconSettings />
                                                </div>
                                                <p>Use the form on the left to update global site settings.</p>
                                                <div className="text-xs bg-gray-100 p-4 rounded-lg text-left max-w-sm w-full">
                                                    <div className="font-bold text-dark mb-2">Current Settings:</div>
                                                    <div className="grid grid-cols-[80px_1fr] gap-2">
                                                        <span className="text-textMuted">Title:</span>
                                                        <span className="text-dark truncate">{settingsForm.siteTitle}</span>
                                                        <span className="text-textMuted">Subtitle:</span>
                                                        <span className="text-dark truncate">{settingsForm.siteSubtitle}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div >
            </div >
        </div>
    );
};

export default AdminPanel;
