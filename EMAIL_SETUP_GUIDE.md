# 📧 Email Setup Guide for Contact Form

## Step 1: Create EmailJS Account (FREE)

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up Free"**
3. Create an account with your email

---

## Step 2: Add Email Service

1. After logging in, go to **"Email Services"** in the left sidebar
2. Click **"Add New Service"**
3. Choose **Gmail** (or any email service you prefer)
4. Click **"Connect Account"**
5. Follow the prompts to connect your Gmail account
6. **Copy the Service ID** (e.g., `service_abc123`) - you'll need this!

---

## Step 3: Create Email Template

1. Go to **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. Set up your template like this:

### Template Settings:
- **Template Name**: Contact Form Submission

### Email Content:
```
Subject: New Contact Form Message from {{name}}

From: {{name}} ({{email}})

Message:
{{message}}

---
Sent from your portfolio contact form
```

### Template Variables:
- `{{name}}` - Sender's name
- `{{email}}` - Sender's email
- `{{message}}` - Message content

4. **Set "To Email"** to: `adityasoniworkmail@gmail.com`
5. Click **"Save"**
6. **Copy the Template ID** (e.g., `template_xyz789`) - you'll need this!

---

## Step 4: Get Your Public Key

1. Go to **"Account"** in the left sidebar
2. Find **"API Keys"** section
3. **Copy your Public Key** (e.g., `abcdef123456789`)

---

## Step 5: Update Your Code

Open `script.js` and replace these placeholders:

```javascript
// Line ~217
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual public key

// Line ~252
emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
```

### Example:
```javascript
emailjs.init('abcdef123456789');

emailjs.send('service_abc123', 'template_xyz789', formData)
```

---

## Step 6: Test Your Form!

1. Open your portfolio in a browser
2. Fill out the contact form
3. Click "Send message"
4. You should see: **"Email sent successfully! 🎉"** toast notification
5. Check your Gmail inbox at `adityasoniworkmail@gmail.com`

---

## ✨ Features Implemented

✅ **Your email displayed** on the form: `adityasoniworkmail@gmail.com`  
✅ **Name field added** to collect sender's name  
✅ **Real email sending** via EmailJS  
✅ **Toast notification** appears with success/error message  
✅ **Loading animation** on submit button  
✅ **Form auto-resets** after successful submission  
✅ **Mobile responsive** toast positioning  

---

## 🆓 EmailJS Free Tier

- **200 emails/month** FREE
- No credit card required
- Perfect for portfolio contact forms

---

## 🔧 Troubleshooting

### Email not sending?
1. Check browser console for errors (F12)
2. Verify all three keys are correct (Public Key, Service ID, Template ID)
3. Make sure your Gmail service is connected in EmailJS dashboard

### Toast not appearing?
1. Clear browser cache
2. Check if JavaScript is enabled
3. Verify `email.min.js` CDN is loading

### Need help?
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)

---

## 🎨 Toast Notification Customization

The toast appears at:
- **Desktop**: Top-right corner
- **Mobile**: Top center (full width)

Colors:
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)

Duration: **4 seconds** (configurable in `showToast()` function)

---

Happy emailing! 🚀
