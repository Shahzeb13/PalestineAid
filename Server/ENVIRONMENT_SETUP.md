# Server Environment Setup Guide

## Required Environment Variables

Create a `.env` file in the Server directory with these variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Email Configuration (Gmail)
USER=your_gmail@gmail.com
CLIENT_ID=your_gmail_client_id
CLIENT_SECRET=your_gmail_client_secret
REDIRECT_URI=https://developers.google.com/oauthplayground
REFRESH_TOKEN=your_gmail_refresh_token

# Environment
NODE_ENV=development
PORT=5000
```

## How to Get These Values:

### 1. STRIPE_SECRET_KEY
- Go to [Stripe Dashboard](https://dashboard.stripe.com/)
- Navigate to **Developers** → **API keys**
- Copy your **Secret key** (starts with `sk_test_`)

### 2. JWT_SECRET_KEY
- Can be any random string
- Example: `my_super_secret_jwt_key_2024`

### 3. MONGODB_URI
- If using local MongoDB: `mongodb://localhost:27017`
- If using MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net`

### 4. Email Configuration (Optional for testing)
- For Gmail setup, follow Google OAuth2 setup
- Or use any email service

## Quick Test Setup (Minimal)

For testing Stripe donations, you only need:

```env
MONGODB_URI=mongodb://localhost:27017
JWT_SECRET_KEY=test_jwt_secret_2024
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NODE_ENV=development
PORT=5000
```

## After Creating .env File

1. Restart your server
2. Test the donation flow
3. Check server logs for any missing variables 