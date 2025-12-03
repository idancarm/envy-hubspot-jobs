# Manual Upload Instructions for HiBob Email Template

## Step-by-Step Guide

### Option 1: Using HubSpot's Email Tool (Recommended)

1. **Navigate to Marketing Email**
   - Log into your HubSpot portal
   - Go to **Marketing** → **Email**
   - Click **Create email**

2. **Choose Template Type**
   - Select **Regular email**
   - Choose **Drag and drop** or **Custom** template option

3. **Access HTML Editor**
   - If using drag and drop: Click the **<>** (code) icon in the top right
   - If using custom: You'll see the HTML editor directly

4. **Paste the Template**
   - Open the file: `/Users/idancarmeli/Documents/Antigrav/hubspot-demo/email-template-hibob.html`
   - Copy ALL the HTML content
   - Paste it into the HubSpot HTML editor

5. **Save the Template**
   - Click **Save** or **Save as template**
   - Name it: "HiBob - People-First HR Technology"
   - Click **Save**

### Option 2: Using Design Manager (For Coded Templates)

1. **Navigate to Design Manager**
   - Go to **Marketing** → **Files and Templates** → **Design Tools**

2. **Create New Template**
   - Click **File** → **New file**
   - Choose **Coded file** → **Email template**

3. **Paste HTML**
   - Name the file: `hibob-marketing-email.html`
   - Paste the HTML content from `email-template-hibob.html`
   - Click **Publish changes**

4. **Use in Email**
   - Go to **Marketing** → **Email** → **Create email**
   - Choose your newly created template from the custom templates section

## Quick Copy Command

To quickly view the HTML content in your terminal:

```bash
cat /Users/idancarmeli/Documents/Antigrav/hubspot-demo/email-template-hibob.html
```

Or open it in your default editor:

```bash
open /Users/idancarmeli/Documents/Antigrav/hubspot-demo/email-template-hibob.html
```

## Troubleshooting

**If you can't find the Marketing menu:**
- Your HubSpot account might not have Marketing Hub access
- Try going to **Conversations** → **Email** instead for basic email functionality

**If the HTML doesn't render correctly:**
- Make sure you're pasting into the HTML/code view, not the visual editor
- Check that all the HTML was copied (it's a long file)

**If you need to make edits:**
- You can edit the HTML file locally and re-paste it
- Or use HubSpot's visual editor after pasting to make changes

## API Upload (Why it might have failed)

The API upload likely failed because:
1. Your access token might not have the required Marketing Email scopes
2. The API endpoint structure may have changed
3. Some HubSpot portals require specific permissions for email template creation

For demo purposes, manual upload is actually preferred as it gives you more control over the template.
