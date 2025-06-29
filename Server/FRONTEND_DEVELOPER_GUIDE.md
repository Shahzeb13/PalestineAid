# 🚀 **Frontend Developer Guide - Palestine Aid APIs**

## 📋 **Table of Contents**
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [User Roles](#user-roles)
4. [API Base URL](#api-base-url)
5. [Receiver APIs](#receiver-apis)
6. [Admin APIs](#admin-apis)
7. [Donater APIs](#donater-apis)
8. [Payment APIs](#payment-apis)
9. [Complete Flow Examples](#complete-flow-examples)
10. [Error Handling](#error-handling)

---

## 🎯 **Overview**

This guide explains how to integrate your frontend with the Palestine Aid backend APIs. The system has 3 user types: **Receivers**, **Admins**, and **Donaters**.

### **System Flow:**
```
Receiver → Admin → Donater → Admin → NGO
    ↓        ↓        ↓        ↓       ↓
  Creates  Approves  Sees &   Pays    Receives
  Request  Request   Donates  NGO     Money
```

---

## 🔐 **Authentication**

### **How to Authenticate:**
1. User logs in/registers
2. Server returns JWT token
3. Include token in all protected API calls

### **Token Format:**
```javascript
// Add this header to all protected requests
headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}
```

---

## 👥 **User Roles**

| Role | Description | Can Do |
|------|-------------|---------|
| **Receiver** | People who need help | Create requests, view their requests |
| **Admin** | System managers | Approve requests, manage payments to NGO |
| **Donater** | People who want to help | View confirmed requests, make donations |

---

## 🌐 **API Base URL**

```
http://localhost:4000/api
```

---

## 🏠 **Receiver APIs**

### **1. Create Request**
**Purpose:** Receiver creates a help request

**Endpoint:** `POST /recieverRequest/create`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}
```

**Request Body:**
```javascript
{
    "requestName": "Emergency Food and Shelter",
    "requestDescription": "Need food supplies for my family of 5",
    "location": "Gaza, Palestine",
    "urgencyLevel": "High", // "High", "Medium", "Low"
    "requestType": "Food", // "Food", "Medical", "Shelter", "Money"
    "recieverRole": "Family", // "Family", "Individual", "Organization"
    "deadline": "2025-07-05T00:00:00.000Z",
    "proofImage": "https://example.com/image.jpg" // Optional
}
```

**Response:**
```javascript
{
    "success": true,
    "message": "Request created successfully",
    "request": {
        "id": "request_id_123",
        "requestName": "Emergency Food and Shelter",
        "status": "Pending"
    }
}
```

### **2. Get My Requests**
**Purpose:** Receiver views their own requests

**Endpoint:** `GET /recieverRequest/myRequests`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`
}
```

**Response:**
```javascript
{
    "success": true,
    "requests": [
        {
            "id": "request_id_123",
            "requestName": "Emergency Food and Shelter",
            "status": "Confirmed",
            "adminApproval": {
                "status": "Confirmed",
                "adminName": "Admin User"
            }
        }
    ]
}
```

---

## 👨‍💼 **Admin APIs**

### **1. Get All Requests**
**Purpose:** Admin sees all requests to approve/reject

**Endpoint:** `GET /adminDashboard/requests`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`
}
```

**Response:**
```javascript
{
    "success": true,
    "requests": [
        {
            "id": "request_id_123",
            "requestName": "Emergency Food and Shelter",
            "status": "Pending",
            "receiver": {
                "name": "Ahmed Family",
                "email": "ahmed@example.com"
            }
        }
    ]
}
```

### **2. Approve/Reject Request**
**Purpose:** Admin approves or rejects a request

**Endpoint:** `POST /adminDashboard/approve/:requestId`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}
```

**Request Body:**
```javascript
{
    "action": "approve" // or "reject"
}
```

**Response:**
```javascript
{
    "success": true,
    "message": "Request approved successfully"
}
```

### **3. Get Pending Payments**
**Purpose:** Admin sees donations they need to pay to NGO

**Endpoint:** `GET /admin-payments/pending-payments`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`
}
```

**Response:**
```javascript
{
    "success": true,
    "total": 2,
    "totalAmount": 150.00,
    "payments": [
        {
            "id": "donation_id_123",
            "amount": 50.00,
            "currency": "usd",
            "donor": {
                "name": "John Donater",
                "email": "john@example.com"
            },
            "request": {
                "requestName": "Emergency Food and Shelter",
                "location": "Gaza"
            }
        }
    ]
}
```

### **4. Complete Payment to NGO**
**Purpose:** Admin marks payment as completed after paying NGO

**Endpoint:** `POST /admin-payments/complete-payment`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}
```

**Request Body:**
```javascript
{
    "donationId": "donation_id_123",
    "paymentMethod": "bank_transfer", // "bank_transfer", "check", "cash", "digital_transfer"
    "notes": "Transferred $50 to NGO bank account #123456"
}
```

**Response:**
```javascript
{
    "success": true,
    "message": "Admin payment marked as completed"
}
```

---

## 💰 **Donater APIs**

### **1. Get Confirmed Requests**
**Purpose:** Donater sees requests they can donate to

**Endpoint:** `GET /donater/confirmedRequests`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`
}
```

**Response:**
```javascript
{
    "success": true,
    "total": 2,
    "requests": [
        {
            "id": "admin_entry_id_123",
            "requestId": {
                "id": "request_id_456",
                "requestName": "Emergency Food and Shelter",
                "requestDescription": "Need food supplies",
                "location": "Gaza",
                "urgencyLevel": "High",
                "requestType": "Food",
                "deadline": "2025-07-05T00:00:00.000Z"
            },
            "adminId": {
                "name": "Admin User",
                "email": "admin@example.com"
            },
            "requestStatus": "Confirmed"
        }
    ]
}
```

### **2. Get Request Details**
**Purpose:** Donater gets detailed info about a specific request

**Endpoint:** `GET /donater/request/:requestId`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`
}
```

**Response:**
```javascript
{
    "success": true,
    "request": {
        "requestId": "request_id_456",
        "requestName": "Emergency Food and Shelter",
        "requestDescription": "Need food supplies",
        "location": "Gaza",
        "urgencyLevel": "High",
        "requestType": "Food",
        "role": "Family",
        "deadline": "2025-07-05T00:00:00.000Z",
        "proofImage": "https://example.com/image.jpg",
        "receiver": {
            "id": "receiver_id",
            "name": "Ahmed Family",
            "email": "ahmed@example.com"
        },
        "adminApproval": {
            "adminId": "admin_id",
            "adminName": "Admin User",
            "adminEmail": "admin@example.com",
            "approvalStatus": "Confirmed",
            "approvalDate": "2025-01-02T00:00:00.000Z"
        }
    }
}
```

### **3. Get Donation History**
**Purpose:** Donater sees their donation history

**Endpoint:** `GET /donater/donation-history`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`
}
```

**Response:**
```javascript
{
    "success": true,
    "total": 3,
    "donations": [
        {
            "id": "donation_id_123",
            "amount": 50.00,
            "currency": "usd",
            "message": "Hope this helps!",
            "status": "Donated",
            "paymentStatus": "completed",
            "date": "2025-01-15T10:30:00.000Z",
            "request": {
                "requestName": "Emergency Food and Shelter",
                "location": "Gaza"
            },
            "admin": {
                "name": "Admin User",
                "email": "admin@example.com"
            }
        }
    ]
}
```

---

## 💳 **Payment APIs (Stripe Integration)**

### **1. Create Payment Intent**
**Purpose:** Create Stripe payment intent for donation

**Endpoint:** `POST /stripe/create-donation-payment-intent`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}
```

**Request Body:**
```javascript
{
    "requestId": "request_id_456",
    "amount": 50.00,
    "currency": "usd",
    "message": "Hope this helps your family!"
}
```

**Response:**
```javascript
{
    "success": true,
    "message": "Payment intent created successfully",
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx",
    "amount": 50.00,
    "currency": "usd"
}
```

### **2. Confirm Donation**
**Purpose:** Confirm donation after payment is processed

**Endpoint:** `POST /stripe/confirm-donation`

**Headers:**
```javascript
{
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
}
```

**Request Body:**
```javascript
{
    "paymentIntentId": "pi_xxx",
    "requestId": "request_id_456",
    "amount": 50.00,
    "currency": "usd",
    "message": "Hope this helps your family!"
}
```

**Response:**
```javascript
{
    "success": true,
    "message": "Donation to admin confirmed successfully",
    "donation": {
        "id": "donation_id_123",
        "amount": 50.00,
        "currency": "usd",
        "status": "Donated",
        "paymentIntentId": "pi_xxx",
        "adminPaymentStatus": "pending"
    }
}
```

---

## 🔄 **Complete Flow Examples**

### **Donater Flow (Making a Donation):**

```javascript
// 1. Login
const loginResponse = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
});
const { token } = await loginResponse.json();

// 2. Get confirmed requests
const requestsResponse = await fetch('/api/donater/confirmedRequests', {
    headers: { 'Authorization': `Bearer ${token}` }
});
const { requests } = await requestsResponse.json();

// 3. Create payment intent
const paymentResponse = await fetch('/api/stripe/create-donation-payment-intent', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        requestId: 'request_id_456',
        amount: 50.00,
        currency: 'usd',
        message: 'Hope this helps!'
    })
});
const { clientSecret } = await paymentResponse.json();

// 4. Process payment with Stripe.js
const result = await stripe.confirmCardPayment(clientSecret, {
    payment_method: { card: cardElement }
});

// 5. Confirm donation
if (result.paymentIntent.status === 'succeeded') {
    const confirmResponse = await fetch('/api/stripe/confirm-donation', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            paymentIntentId: result.paymentIntent.id,
            requestId: 'request_id_456',
            amount: 50.00,
            currency: 'usd',
            message: 'Hope this helps!'
        })
    });
}
```

### **Admin Flow (Managing Payments):**

```javascript
// 1. Get pending payments
const pendingResponse = await fetch('/api/admin-payments/pending-payments', {
    headers: { 'Authorization': `Bearer ${token}` }
});
const { payments } = await pendingResponse.json();

// 2. Complete payment to NGO
const completeResponse = await fetch('/api/admin-payments/complete-payment', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        donationId: 'donation_id_123',
        paymentMethod: 'bank_transfer',
        notes: 'Transferred to NGO bank account'
    })
});
```

---

## 🚨 **Error Handling**

### **Standard Error Response:**
```javascript
{
    "success": false,
    "message": "Error description",
    "error": "Detailed error (in development)"
}
```

### **Common HTTP Status Codes:**
- `200` - Success ✅
- `400` - Bad Request (missing/invalid data) ❌
- `401` - Unauthorized (invalid/missing token) 🔒
- `403` - Forbidden (wrong role) 🚫
- `404` - Not Found 🔍
- `500` - Server Error 💥

### **Error Handling Example:**
```javascript
try {
    const response = await fetch('/api/donater/confirmedRequests', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    
    // Handle success
    console.log(data.requests);
    
} catch (error) {
    // Handle error
    console.error('Error:', error.message);
    // Show error to user
}
```

---

## 🔧 **Frontend Setup**

### **Required Dependencies:**
```bash
npm install stripe @stripe/stripe-js
```

### **Stripe.js Setup:**
```javascript
import { loadStripe } from '@stripe/stripe-js';

const stripe = await loadStripe('pk_test_your_publishable_key');
```

### **Environment Variables:**
```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

---

## 📱 **Mobile App Considerations**

For React Native:
- Use `@stripe/stripe-react-native` instead of `@stripe/stripe-js`
- All API endpoints remain the same
- Handle authentication with secure storage

---

## 🧪 **Testing**

### **Test Card Numbers:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Authentication: `4000 0025 0000 3155`

### **Test CVC & Expiry:**
- CVC: Any 3 digits (e.g., `123`)
- Expiry: Any future date (e.g., `12/25`)

---

## 📞 **Support**

For API issues:
1. Check server logs for detailed error messages
2. Verify all required fields are sent
3. Ensure proper authentication headers
4. Test with Postman first

**Happy coding! 🚀** 