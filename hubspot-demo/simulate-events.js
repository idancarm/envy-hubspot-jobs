import { Client } from '@hubspot/api-client';
import 'dotenv/config';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

async function simulateRiskEvent() {
    console.log('Simulating "Seat Utilization Drop" event from HiBob...');

    // 1. Find a Healthy Company
    const companies = await hubspotClient.crm.companies.searchApi.doSearch({
        filterGroups: [{
            filters: [{ propertyName: 'account_health', operator: 'EQ', value: 'Healthy' }]
        }],
        properties: ['name', 'account_health', 'seat_utilization'],
        limit: 1
    });

    if (companies.results.length === 0) {
        console.log('No "Healthy" companies found to simulate event on. Run seed-data.js first.');
        return;
    }

    const company = companies.results[0];
    console.log(`Targeting Company: ${company.properties.name} (ID: ${company.id})`);

    // 2. Update Company Properties (Trigger "At Risk")
    await hubspotClient.crm.companies.basicApi.update(company.id, {
        properties: {
            seat_utilization: '25', // Drop to low utilization
            account_health: 'At Risk'
        }
    });
    console.log(`Updated Company ${company.id}: Seat Utilization -> 25, Account Health -> At Risk`);

    // 3. Find associated contacts to update
    const associations = await hubspotClient.crm.associations.v4.basicApi.getPage(
        'companies',
        company.id,
        'contacts'
    );

    if (associations.results.length > 0) {
        const contactId = associations.results[0].id;
        console.log(`Targeting Contact ID: ${contactId}`);

        // 4. Update Contact Properties (Trigger "Adoption Regression")
        await hubspotClient.crm.contacts.basicApi.update(contactId, {
            properties: {
                tool_usage_score: '15',
                adoption_stage: 'Onboarding' // Regress from Adopted/Power User
            }
        });
        console.log(`Updated Contact ${contactId}: Tool Usage -> 15, Adoption Stage -> Onboarding`);
    } else {
        console.log('No associated contacts found for this company.');
    }

    console.log('Simulation complete. Check HubSpot for workflow triggers.');
}

async function main() {
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
        console.error('Error: HUBSPOT_ACCESS_TOKEN is not set in .env file');
        process.exit(1);
    }

    await simulateRiskEvent();
}

main();
