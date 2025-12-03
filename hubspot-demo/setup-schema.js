import { Client } from '@hubspot/api-client';
import 'dotenv/config';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

const companyProperties = [
    {
        name: 'account_health',
        label: 'Account Health',
        type: 'enumeration',
        fieldType: 'select',
        groupName: 'companyinformation',
        options: [
            { label: 'Healthy', value: 'Healthy' },
            { label: 'At Risk', value: 'At Risk' },
            { label: 'Churned', value: 'Churned' }
        ]
    },
    {
        name: 'seat_utilization',
        label: 'Seat Utilization',
        type: 'number',
        fieldType: 'number',
        groupName: 'companyinformation'
    }
];

const contactProperties = [
    {
        name: 'tool_usage_score',
        label: 'Tool Usage Score',
        type: 'number',
        fieldType: 'number',
        groupName: 'contactinformation'
    },
    {
        name: 'adoption_stage',
        label: 'Adoption Stage',
        type: 'enumeration',
        fieldType: 'select',
        groupName: 'contactinformation',
        options: [
            { label: 'New', value: 'New' },
            { label: 'Onboarding', value: 'Onboarding' },
            { label: 'Adopted', value: 'Adopted' },
            { label: 'Power User', value: 'Power User' }
        ]
    }
];

async function createProperty(objectType, property) {
    try {
        await hubspotClient.crm.properties.coreApi.create(objectType, property);
        console.log(`Created property ${property.name} on ${objectType}`);
    } catch (e) {
        if (e.message.includes('already exists')) {
            console.log(`Property ${property.name} on ${objectType} already exists. Skipping.`);
        } else {
            console.error(`Error creating property ${property.name} on ${objectType}:`, e.message);
        }
    }
}

async function main() {
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
        console.error('Error: HUBSPOT_ACCESS_TOKEN is not set in .env file');
        process.exit(1);
    }

    console.log('Setting up Company properties...');
    for (const prop of companyProperties) {
        await createProperty('companies', prop);
    }

    console.log('Setting up Contact properties...');
    for (const prop of contactProperties) {
        await createProperty('contacts', prop);
    }

    console.log('Schema setup complete.');
}

main();
