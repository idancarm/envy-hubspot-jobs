import React from 'react';
import { IconCheck } from './Icons';
import { Helmet } from 'react-helmet-async';

const JobDetailPage = ({ job, onBack, onAddToCart }) => {
    if (!job) return null;

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart(job);
        }
    };

    return (
        <div className="animate-fadeIn">
            <Helmet>
                <title>{job.seoTitle || job.name} | Antigravity Services</title>
                <meta name="description" content={job.seoDescription || job.description} />
                <meta property="og:title" content={job.seoTitle || job.name} />
                <meta property="og:description" content={job.seoDescription || job.description} />
                <meta property="og:type" content="product" />
                <meta property="og:price:amount" content={job.price} />
                <meta property="og:price:currency" content="USD" />
            </Helmet>
            {/* Back Button */}
            {/* Sticky Header with Back Button */}
            <div className="sticky top-0 z-50 bg-[#F3F4F6]/95 backdrop-blur-md py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 mb-6 border-b border-gray-200/50 shadow-sm transition-all">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-textMuted hover:text-primary transition-colors group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        <span className="font-medium">Back to Catalog</span>
                    </button>

                    {/* Optional: Show mini-title or CTA on scroll could go here, keeping it simple for now */}
                </div>
            </div>

            {/* Header Section */}
            <div className="glass-panel rounded-2xl p-8 mb-8">
                <div className="flex items-start justify-between gap-8">
                    <div className="flex-1">
                        <h1 className="text-4xl lg:text-5xl font-bold text-dark mb-4 font-heading leading-tight">{job.name}</h1>
                        <p className="text-textMuted text-lg lg:text-xl mb-6 leading-relaxed">{job.description}</p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-textMuted">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="text-sm font-medium">{job.timeline || 'Flexible Timeline'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                <span className="text-sm text-textMuted">Fixed Scope Project</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <div className="text-sm text-gray-600 mb-1">Total Cost</div>
                        <div className="text-4xl lg:text-5xl font-bold text-primary">
                            {job.pricingModel === 'variable' ? 'From ' : ''}
                            ${(job.price || 0).toLocaleString()}
                        </div>
                        {job.pricingModel === 'hybrid' && (
                            <div className="text-sm text-textMuted mt-1 font-medium">
                                + ${job.monthlyPrice}/mo
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="glass-panel rounded-2xl p-8 lg:p-12 mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Column - Main Text Content */}
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-2xl lg:text-3xl font-semibold text-dark mb-6 flex items-center gap-3">
                                <span className="w-2 h-10 bg-primary rounded-full"></span>
                                Key Benefits
                            </h3>
                            <div
                                className="text-gray-700 leading-relaxed text-lg lg:text-xl prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: job.details || job.description }}
                            />
                        </div>
                    </div>

                    {/* Right Column - Video */}
                    <div className="space-y-10">
                        {job.youtubeVideoId ? (
                            <div className="rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-300/50 relative pt-[56.25%] bg-black sticky top-8">
                                <iframe
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${job.youtubeVideoId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-12 lg:p-16 text-center sticky top-8">
                                <svg className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                                <p className="text-gray-500 text-base lg:text-lg">No video available</p>
                            </div>
                        )}

                        <div className="p-6 lg:p-8 rounded-xl bg-primary/5 border border-primary/20">
                            <h4 className="text-xl lg:text-2xl font-semibold text-dark mb-6">What Happens Next?</h4>
                            <ol className="space-y-5">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-base font-bold flex items-center justify-center shadow-sm">1</span>
                                    <span className="text-gray-700 text-base lg:text-lg">Select this job and submit your request</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-base font-bold flex items-center justify-center shadow-sm">2</span>
                                    <span className="text-gray-700 text-base lg:text-lg">We'll schedule a kickoff call within 24 hours</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white text-base font-bold flex items-center justify-center shadow-sm">3</span>
                                    <span className="text-gray-700 text-base lg:text-lg">Receive your deliverables in {job.timeline || 'the agreed timeline'}</span>
                                </li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            {/* Screenshots Section - Two Column Alternating Layout */}
            {job.screenshots && job.screenshots.length > 0 && (
                <div className="glass-panel rounded-2xl p-8 mb-8">
                    <h3 className="text-3xl lg:text-4xl font-bold text-dark mb-12 lg:mb-16 flex items-center gap-4">
                        <span className="w-2 h-12 bg-gradient-to-b from-primary to-secondary rounded-full"></span>
                        See it in Action
                    </h3>
                    <div className="space-y-16 lg:space-y-20">
                        {job.screenshots.map((shot, idx) => (
                            <div key={idx} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                                    <div className="rounded-2xl overflow-hidden border border-gray-300/50 shadow-xl bg-gray-50/50">
                                        <img src={shot.url} alt={shot.caption} className="w-full h-auto hover:scale-[1.02] transition-transform duration-700" />
                                    </div>
                                </div>
                                <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                                    <h4 className="text-2xl lg:text-3xl font-bold text-dark mb-4 lg:mb-6 font-heading">{shot.caption}</h4>
                                    <p className="text-gray-700 leading-relaxed text-base lg:text-xl">{shot.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Bottom CTA */}
            <div className="glass-panel rounded-2xl p-6 lg:p-8 mt-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                        <div>
                            <div className="text-sm text-gray-600 mb-1">
                                {job.pricingModel === 'fixed' ? 'Fixed Price' :
                                    job.pricingModel === 'hybrid' ? 'Hybrid (Setup + Monthly)' :
                                        'Variable Cost'}
                            </div>
                            <div className="text-2xl lg:text-3xl font-bold text-primary">
                                {job.pricingModel === 'variable' ? 'From ' : ''}
                                ${(job.price || 0).toLocaleString()}
                            </div>
                            {job.pricingModel === 'hybrid' && (
                                <div className="text-sm text-gray-500 font-medium">
                                    + ${job.monthlyPrice}/mo
                                </div>
                            )}
                        </div>
                        <div className="text-gray-400 hidden lg:block">•</div>
                        <div>
                            <div className="text-sm text-gray-600 mb-1">Timeline</div>
                            <div className="text-lg lg:text-xl font-medium text-dark">{job.timeline || 'Flexible'}</div>
                        </div>
                    </div>
                    {onAddToCart && (
                        <button
                            onClick={handleAddToCart}
                            className="w-full lg:w-auto px-8 lg:px-10 py-3 lg:py-4 rounded-lg font-bold text-base lg:text-lg text-white bg-primary hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Select This Job
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="mt-12 text-center pb-8">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-textMuted hover:text-primary transition-colors px-6 py-3 rounded-full hover:bg-white/50"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    <span className="font-medium">Back to Catalog</span>
                </button>
            </div>
        </div>
    );
};

export default JobDetailPage;
