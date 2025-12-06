/**
 * HubSpot Forms API Service
 * Documentation: https://legacydocs.hubspot.com/docs/methods/forms/submit_form_v3
 */

export const submitToHubSpot = async (portalId, formId, fields, context = {}) => {
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

    const body = {
        fields: fields, // Array of { name: 'email', value: '...' }
        context: {
            pageUri: window.location.href,
            pageName: document.title,
            ...context
        },
        // legallyConsentToProcessData: true // Optional based on your form settings
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to submit form to HubSpot');
        }

        return data;
    } catch (error) {
        console.error('HubSpot Submission Error:', error);
        throw error;
    }
};
