import React, { useState } from 'react';

const FAQ_DATA = [
    {
        question: "What are HubSpot’s Jobs to be Done and why do I need them?",
        answer: "HubSpot Jobs to be Done are tactical deployments of HubSpot’s most powerful (mostly new) features. Think AI-powered prospecting agents, syncing HubSpot with LinkedIn (for real), smart properties, self-updating CRM fields, and intent-based workflows. HubSpot ships over 400 new features every year. No one has time to test them all… we do it for a living. Envy cherry-picks the highest-impact tools, configures them to match your GTM motion, and hands over battle-ready workflows, dashboards, and training so your team actually uses them."
    },
    {
        question: "What’s the difference between HubSpot Jobs to be Done and full HubSpot onboarding?",
        answer: "Full onboarding is a structured, end-to-end implementation for new HubSpot instances. HubSpot Jobs to be Done are bite-sized tasks for specific needs where no full onboarding is required. Wanna use AI to recognize your ICP? Can’t quite grasp the buyer's intent? Feel like you’re wasting money on HubSpot features you’re not using? That’s a job. And we’ll get it done without overpromising or dragging it out. Check out HubSpot onboarding packages if you’re just getting started."
    },
    {
        question: "How fast can you complete a HubSpot Job to be Done?",
        answer: "Most jobs are scoped and completed within 5-10 business days. Speed depends on scope, but remember Envy isn’t built like a typical agency. We don’t wait for “next sprint”."
    },
    {
        question: "Can I book multiple jobs at once?",
        answer: "Yes. Most of our clients start with a job, realize how fast and strategic our team is (😉) and expand into a package. Or the other way around. We offer custom job bundles or ongoing RevOps support through our HubSpot RevOps as a Service if you need recurring help."
    },
    {
        question: "Do I need a developer or RevOps manager to work with?",
        answer: "No. We work directly with marketing and growth leads all the time, so no technical gatekeeping required. But if you have internal RevOps, we’ll integrate cleanly with your team and complement what they’re already doing."
    },
    {
        question: "How do HubSpot Jobs to be Done help generate revenue?",
        answer: "Because half your pipeline problems are rooted in CRM problems. If leads aren’t properly tracked, routed, scored, or nurtured, they won’t convert. Every job we take on is designed to support SQL growth and reduce lead leakage."
    },
    {
        question: "Do you fix attribution and reporting issues in HubSpot?",
        answer: "Yes. Attribution is messy, but your dashboards don’t have to be. We clean up source tracking, fix contact-to-deal associations, set up first/last touch models, and build exec-ready dashboards that show real performance, not just traffic and clicks. BTW See our take on B2B marketing attribution in this blog post."
    },
    {
        question: "Can Envy help us deploy HubSpot’s AI agents like Prospecting or Research Assistants?",
        answer: "Yes! With our AI Agent Jobs, we configure HubSpot’s Breeze AI tools, like the Prospecting Agent and Company Research Cards, so your Sales Hub Pro+ reps get auto-enriched data, task recommendations, and outreach templates, mapped to actual buying signals."
    },
    {
        question: "How do HubSpot Jobs to be Done help us reduce costs?",
        answer: "One, our Cost Controls Job identifies dead contacts, suppresses wasteful sends, and audits AI credit usage, saving you money on email limits and smart feature overage charges. Clients often recover thousands (!) in avoidable fees from bloated contact lists and under-optimized settings. Two, these jobs don’t require lengthy and costly retainers, and allow you to start scaling almost immediately after implementation! Three, you’re probably paying for MarTech that can be replaced with HubSpot."
    },
    {
        question: "Do we need HubSpot’s Pro or Enterprise plans to use these Jobs to be Done?",
        answer: "Some Jobs, like the AI Prospecting Agent, require Sales Hub Pro or higher. Others (like ICP scoring, smart CRM enrichment, or cost controls) work on Marketing Pro and above. We’ll confirm what’s feasible before starting and never recommend a feature you can’t actually use."
    }
];

const FAQItem = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                className="w-full text-left py-5 px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors group focus:outline-none"
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className={`text-lg font-medium transition-colors ${isOpen ? 'text-primary' : 'text-dark group-hover:text-primary/80'}`}>
                    {item.question}
                </span>
                <span className={`ml-6 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isOpen ? 'text-primary' : 'text-gray-400'}`}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6 text-textMuted leading-relaxed">
                    {item.answer}
                </div>
            </div>
        </div>
    );
};

const FAQView = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="glass-panel rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-dark font-heading mb-4">
                    Questions You Should Ask
                </h2>
                <p className="text-textMuted text-lg">
                    Everything you need to know about Enviable HubSpot Jobs To Be Done
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {FAQ_DATA.map((item, index) => (
                    <FAQItem
                        key={index}
                        item={item}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQView;
