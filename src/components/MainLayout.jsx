import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { IconGrid, IconFAQ, IconSettings } from './Icons';

const MainLayout = ({ uiSettings, isAdminAuthenticated }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            {/* Intro Section - Video and Stats */}
            <div className="glass-panel rounded-2xl p-8 lg:p-12 mb-8 max-w-6xl mx-auto overflow-hidden">
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

                    <div className="flex flex-col gap-5">
                        {/* Stat Badge 1 - Primary (Pink) */}
                        <div className="rounded-xl p-5 border-2 border-white/30 hover:border-white/50 transition-all hover:shadow-lg group" style={{ backgroundColor: '#FF1F6C' }}>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{uiSettings.heroBadge1Title}</div>
                                    <div className="text-white/80 text-sm">{uiSettings.heroBadge1Subtitle}</div>
                                </div>
                            </div>
                        </div>

                        {/* Stat Badge 2 - Secondary (Teal) */}
                        <div className="rounded-xl p-5 border-2 border-white/30 hover:border-white/50 transition-all hover:shadow-lg group" style={{ backgroundColor: '#50D2C1' }}>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-white">{uiSettings.heroBadge2Title}</div>
                                    <div className="text-white/80 text-sm">{uiSettings.heroBadge2Subtitle}</div>
                                </div>
                            </div>
                        </div>

                        {/* Stat Badge 3 - Accent (Lime) */}
                        <div className="rounded-xl p-5 border-2 border-black/10 hover:border-black/20 transition-all hover:shadow-lg group" style={{ backgroundColor: '#D6FE51' }}>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-black/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-7 h-7 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-dark">{uiSettings.heroBadge3Title}</div>
                                    <div className="text-dark/70 text-sm">{uiSettings.heroBadge3Subtitle}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div id="catalog-section" className="flex justify-center gap-2 flex-wrap scroll-mt-24 mb-8">
                <Link
                    to="/"
                    className={`
                            flex items-center gap-2 px-6 py-3 rounded-full border transition-all font-medium
                            ${currentPath === '/'
                            ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,255,194,0.3)]'
                            : 'bg-gray-100/50 text-textMuted border-gray-300 hover:border-slate-500 hover:text-gray-700'}
                        `}
                >
                    <IconGrid />
                    <span>Jobs Catalog</span>
                </Link>
                <Link
                    to="/faq"
                    className={`
                            flex items-center gap-2 px-6 py-3 rounded-full border transition-all font-medium
                            ${currentPath === '/faq'
                            ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,255,194,0.3)]'
                            : 'bg-gray-100/50 text-textMuted border-gray-300 hover:border-slate-500 hover:text-gray-700'}
                        `}
                >
                    <IconFAQ />
                    <span>FAQ</span>
                </Link>
                {isAdminAuthenticated && (
                    <Link
                        to="/admin"
                        className={`
                                flex items-center gap-2 px-6 py-3 rounded-full border transition-all font-medium
                                ${currentPath === '/admin'
                                ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,255,194,0.3)]'
                                : 'bg-gray-100/50 text-textMuted border-gray-300 hover:border-slate-500 hover:text-gray-700'}
                            `}
                    >
                        <IconSettings />
                        <span>Admin</span>
                    </Link>
                )}
            </div>

            <Outlet />
        </>
    );
};

export default MainLayout;
