import { Client } from '@hubspot/api-client';
import fs from 'fs';
import 'dotenv/config';

const hubspotClient = new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN });

async function uploadEmailTemplate() {
    if (!process.env.HUBSPOT_ACCESS_TOKEN) {
        console.error('Error: HUBSPOT_ACCESS_TOKEN is not set in .env file');
        process.exit(1);
    }

    console.log('Reading email template...');
    const htmlContent = fs.readFileSync('./email-template-hibob.html', 'utf8');

    console.log('Uploading email template to HubSpot...');

    try {
        // Create the email template using the Marketing Email API
        const templateData = {
            name: 'HiBob - People-First HR Technology',
            subject: 'Transform your HR with people-first technology',
            htmlBody: htmlContent,
            isPublished: false,
            templateType: 'EMAIL'
        };

        // Note: The exact API endpoint may vary based on HubSpot API version
        // Using the CMS/Design Manager API for email templates
        const response = await hubspotClient.apiRequest({
            method: 'POST',
            path: '/marketing-emails/v1/emails',
            body: templateData
        });

        console.log('✅ Email template uploaded successfully!');
        console.log('Template ID:', response.id);
        console.log('Template Name:', response.name);
        console.log('\nYou can now find this template in your HubSpot Marketing Email tool.');

    } catch (e) {
        console.error('Error uploading email template:', e.message);
        if (e.body) {
            console.error('Error details:', JSON.stringify(e.body, null, 2));
        }

        // Provide alternative instructions
        console.log('\n📋 Alternative: Manual Upload Instructions');
        console.log('1. Go to Marketing > Email in your HubSpot portal');
        console.log('2. Click "Create email"');
        console.log('3. Choose "Custom" or "Drag and drop"');
        console.log('4. Use the HTML editor to paste the contents of email-template-hibob.html');
        console.log('5. Save the template');
    }
}

uploadEmailTemplate();
