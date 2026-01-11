import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { IconGrid, IconFAQ, IconSettings } from './Icons';

const MainLayout = ({ uiSettings, isAdminAuthenticated }) => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <>
            {/* Intro Section - Video and Stats */}
            <div className="relative mb-12 max-w-[90rem] mx-auto">
                {/* Ambient Background Blobs */}
                <div className="gradient-blob bg-purple-400 w-96 h-96 rounded-full top-0 -left-20 mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '0s' }}></div>
                <div className="gradient-blob bg-cyan-400 w-96 h-96 rounded-full bottom-0 -right-20 mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="gradient-blob bg-pink-400 w-80 h-80 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>

                <div className="glass-panel rounded-3xl p-8 lg:p-12 relative z-10 overflow-hidden border border-white/40 shadow-xl backdrop-blur-xl bg-white/60">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-center">
                        {/* Left Column - Video */}
                        <div>
                            {uiSettings.introVideoId ? (
                                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/50 relative pt-[56.25%] bg-black transform transition-transform hover:scale-[1.02] duration-500">
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
                                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 relative pt-[56.25%]">
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                        </svg>
                                        <p className="text-sm font-medium">Add video in Admin Settings</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-6">
                            {/* Stat Badge 1 - Primary (Pink) */}
                            <div className="rounded-2xl p-6 bg-white/40 border border-white/60 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300 group backdrop-blur-md">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-[#FF1F6C] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 tracking-tight">{uiSettings.heroBadge1Title}</div>
                                        <div className="text-gray-600 font-medium">{uiSettings.heroBadge1Subtitle}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Stat Badge 2 - Secondary (Teal) */}
                            <div className="rounded-2xl p-6 bg-white/40 border border-white/60 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300 group backdrop-blur-md">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-[#50D2C1] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 tracking-tight">{uiSettings.heroBadge2Title}</div>
                                        <div className="text-gray-600 font-medium">{uiSettings.heroBadge2Subtitle}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Stat Badge 3 - Accent (Lime) */}
                            <div className="rounded-2xl p-6 bg-white/40 border border-white/60 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 duration-300 group backdrop-blur-md">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-[#D6FE51] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gray-900 tracking-tight">{uiSettings.heroBadge3Title}</div>
                                        <div className="text-gray-600 font-medium">{uiSettings.heroBadge3Subtitle}</div>
                                    </div>
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
