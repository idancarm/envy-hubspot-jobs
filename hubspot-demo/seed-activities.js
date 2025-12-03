import { Client } from '@hubspot/api-client';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

async function getDemoContacts() {
    console.log('Searching for demo contacts...');
    const publicObjectSearchRequest = {
        filterGroups: [{
            filters: [{ propertyName: 'tool_usage_score', operator: 'HAS_PROPERTY' }]
        }],
        properties: ['firstname', 'lastname', 'email'],
        limit: 10
    };

    try {
        const searchResult = await hubspotClient.crm.contacts.searchApi.doSearch(publicObjectSearchRequest);
        return searchResult.results;
    } catch (e) {
        console.error('Error searching contacts:', e.message);
        return [];
    }
}

async function createMeeting(contactId) {
    const properties = {
        hs_timestamp: faker.date.recent({ days: 30 }).toISOString(),
        hs_meeting_title: faker.helpers.arrayElement(['Onboarding Kickoff', 'QBR', 'Monthly Check-in', 'Strategy Session']),
        hs_meeting_body: faker.lorem.sentence(),
        hs_internal_meeting_notes: faker.lorem.sentence(),
        hs_meeting_outcome: 'SCHEDULED'
    };

    try {
        const meeting = await hubspotClient.crm.objects.meetings.basicApi.create({ properties });
        console.log(`Created Meeting: ${properties.hs_meeting_title} (ID: ${meeting.id})`);

        await hubspotClient.crm.associations.v4.basicApi.create(
            'meetings',
            meeting.id,
            'contacts',
            contactId,
            [
                {
                    associationCategory: 'HUBSPOT_DEFINED',
                    associationTypeId: 200 // Meeting to Contact
                }
            ]
        );
        console.log(`Associated Meeting ${meeting.id} to Contact ${contactId}`);
    } catch (e) {
        console.error('Error creating meeting:', e.message);
    }
}

async function createCall(contactId) {
    const properties = {
        hs_timestamp: faker.date.recent({ days: 30 }).toISOString(),
        hs_call_title: faker.helpers.arrayElement(['Intro Call', 'Support Call', 'Discovery Call']),
        hs_call_body: faker.lorem.sentence(),
        hs_call_duration: faker.number.int({ min: 30000, max: 3600000 }).toString(),
        hs_call_status: 'COMPLETED'
    };

    try {
        const call = await hubspotClient.crm.objects.calls.basicApi.create({ properties });
        console.log(`Created Call: ${properties.hs_call_title} (ID: ${call.id})`);

        await hubspotClient.crm.associations.v4.basicApi.create(
            'calls',
            call.id,
            'contacts',
            contactId,
            [
                {
                    associationCategory: 'HUBSPOT_DEFINED',
                    associationTypeId: 194 // Call to Contact
                }
            ]
        );
        console.log(`Associated Call ${call.id} to Contact ${contactId}`);
    } catch (e) {
        console.error('Error creating call:', e.message);
    }
}

async function createEmail(contactId) {
    const properties = {
        hs_timestamp: faker.date.recent({ days: 30 }).toISOString(),
        hs_email_subject: faker.helpers.arrayElement(['Welcome to the platform', 'Usage Alert', 'New Feature Announcement']),
        hs_email_text: faker.lorem.paragraph(),
        hs_email_direction: 'EMAIL'
    };

    try {
        const email = await hubspotClient.crm.objects.emails.basicApi.create({ properties });
        console.log(`Created Email: ${properties.hs_email_subject} (ID: ${email.id})`);

        await hubspotClient.crm.associations.v4.basicApi.create(
            'emails',
            email.id,
            'contacts',
            contactId,
            [
                {
                    associationCategory: 'HUBSPOT_DEFINED',
                    associationTypeId: 198 // Email to Contact
                }
            ]
        );
        console.log(`Associated Email ${email.id} to Contact ${contactId}`);
    } catch (e) {
        console.error('Error creating email:', e.message);
    }
}

async function main() {
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
        console.error('Error: HUBSPOT_ACCESS_TOKEN is not set in .env file');
        process.exit(1);
    }

    const contacts = await getDemoContacts();
    if (contacts.length === 0) {
        console.log('No demo contacts found. Run seed-data.js first.');
        return;
    }

    console.log(`Found ${contacts.length} contacts. Generating activities...`);

    for (const contact of contacts) {
        // Randomly assign 1-3 activities per contact
        const numActivities = faker.number.int({ min: 1, max: 3 });
        for (let i = 0; i < numActivities; i++) {
            const type = faker.helpers.arrayElement(['meeting', 'call', 'email']);
            if (type === 'meeting') await createMeeting(contact.id);
            else if (type === 'call') await createCall(contact.id);
            else if (type === 'email') await createEmail(contact.id);
        }
    }

    console.log('Activity seeding complete.');
}

main();
