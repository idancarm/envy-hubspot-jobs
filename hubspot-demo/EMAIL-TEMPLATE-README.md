# HiBob Marketing Email Template

## Overview
This is a professionally designed marketing email template that follows HiBob's brand guidelines, created for use in your HubSpot demo environment.

## Brand Elements Used

### Colors
- **Primary Green**: `#00E676` - Vibrant neon green used for highlights and accents
- **Navy Blue**: `#0A1E3C` - Deep blue for headers, text, and backgrounds
- **Bright Red**: `#FF3B5C` - Used for call-to-action buttons
- **White**: `#FFFFFF` - Main content background
- **Light Gray**: `#F5F5F5` - Email background

### Typography
- **Headings**: Sentinel (serif) - Used for the main headline
- **Body Text**: Gotham (sans-serif) - Used for all body content
- **Fallbacks**: Georgia for headings, Arial for body (email-safe)

### Design Principles
- Modern, vibrant, and people-first aesthetic
- Clean layout with clear hierarchy
- Mobile-responsive design
- Email-safe HTML/CSS (table-based layout)

## Features

✅ **HubSpot Personalization**: Includes `{{contact.firstname}}` token  
✅ **Mobile Responsive**: Adapts to different screen sizes  
✅ **Brand Consistent**: Matches HiBob's visual identity  
✅ **Clear CTA**: Prominent "Request a Demo" button  
✅ **Professional Footer**: Includes unsubscribe and legal links  

## Files

- `email-template-hibob.html` - The complete email template
- `upload-email-template.js` - Script to upload the template to HubSpot

## Usage

### Option 1: Upload via Script (Recommended)
```bash
npm run upload-email
```

### Option 2: Manual Upload
1. Go to **Marketing > Email** in your HubSpot portal
2. Click **"Create email"**
3. Choose **"Custom"** or **"Drag and drop"**
4. Switch to the HTML editor
5. Paste the contents of `email-template-hibob.html`
6. Save the template

## Customization

You can customize the email content by editing `email-template-hibob.html`:

- **Headline**: Modify the `<h1>` in the hero section
- **Body Content**: Update the paragraphs and bullet points
- **CTA Button**: Change the text and link in the `.cta-button`
- **Footer**: Update company information and links

## HubSpot Personalization Tokens

The template includes:
- `{{contact.firstname}}` - Personalizes the greeting

You can add more tokens like:
- `{{contact.lastname}}`
- `{{contact.company}}`
- `{{contact.email}}`

## Preview

The email includes:
1. **Header** with HiBob branding
2. **Hero section** with compelling headline
3. **Content area** with personalized greeting and value propositions
4. **Highlighted benefits** using brand green
5. **CTA button** in brand red
6. **Professional footer** with legal links

## Notes

- The template uses inline CSS for maximum email client compatibility
- Table-based layout ensures consistent rendering across email clients
- Tested for responsiveness on mobile devices
- Follows email marketing best practices

## Support

For issues or questions about the template, refer to the HubSpot Marketing Email documentation or contact your HubSpot administrator.
