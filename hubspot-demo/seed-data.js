import { Client } from '@hubspot/api-client';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

async function createCompany() {
    const properties = {
        name: faker.company.name(),
        domain: faker.internet.domainName(),
        account_health: faker.helpers.arrayElement(['Healthy', 'At Risk']),
        seat_utilization: faker.number.int({ min: 50, max: 100 }).toString()
    };

    try {
        const company = await hubspotClient.crm.companies.basicApi.create({ properties });
        console.log(`Created company: ${properties.name} (ID: ${company.id})`);
        return company.id;
    } catch (e) {
        console.error('Error creating company:', e.message);
        return null;
    }
}

async function createContact(companyId) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const properties = {
        email: faker.internet.email({ firstName, lastName }),
        firstname: firstName,
        lastname: lastName,
        tool_usage_score: faker.number.int({ min: 0, max: 100 }).toString(),
        adoption_stage: faker.helpers.arrayElement(['New', 'Onboarding', 'Adopted', 'Power User'])
    };

    try {
        const contact = await hubspotClient.crm.contacts.basicApi.create({ properties });
        console.log(`Created contact: ${properties.email} (ID: ${contact.id})`);

        if (companyId) {
            await hubspotClient.crm.associations.v4.basicApi.create(
                'companies',
                companyId,
                'contacts',
                contact.id,
                [
                    {
                        associationCategory: 'HUBSPOT_DEFINED',
                        associationTypeId: 2 // Primary Company to Contact
                    }
                ]
            );
            console.log(`Associated contact ${contact.id} to company ${companyId}`);
        }
    } catch (e) {
        console.error('Error creating contact:', e.message);
    }
}

async function main() {
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
        console.error('Error: HUBSPOT_ACCESS_TOKEN is not set in .env file');
        process.exit(1);
    }

    console.log('Seeding data...');
    for (let i = 0; i < 3; i++) {
        const companyId = await createCompany();
        if (companyId) {
            const numContacts = faker.number.int({ min: 1, max: 3 });
            for (let j = 0; j < numContacts; j++) {
                await createContact(companyId);
            }
        }
    }
    console.log('Data seeding complete.');
}

main();
