# Yandex Authentication Integration

This project now includes complete Yandex OAuth authentication integration using both the Yandex SDK and NextAuth.js.

## Setup Instructions

### 1. Yandex OAuth Application Setup

1. Go to [Yandex OAuth](https://oauth.yandex.ru/)
2. Create a new application or select an existing one
3. Set the following URLs:
   - **Redirect URI**: `http://localhost:3000/api/auth/callback/yandex` (for development)
   - **Redirect URI**: `https://yourdomain.com/api/auth/callback/yandex` (for production)
4. Copy your **Client ID** and **Client Secret**

### 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Yandex OAuth Configuration
YANDEX_CLIENT_ID=your_yandex_client_id_here
YANDEX_CLIENT_SECRET=your_yandex_client_secret_here

# Public client ID for frontend SDK
NEXT_PUBLIC_YANDEX_CLIENT_ID=your_yandex_client_id_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 3. Features Implemented

#### ✅ Complete Authentication Flow

- **Yandex SDK Integration**: Uses the official Yandex SDK for seamless authentication
- **NextAuth Provider**: Configured Yandex provider for server-side authentication
- **Token Handling**: Automatic token processing and user data retrieval
- **User Creation**: Automatically creates users in your database if they don't exist
- **Session Management**: Full session handling with user data

#### ✅ User Experience

- **Loading States**: Visual feedback during authentication
- **Error Handling**: Comprehensive error messages
- **Fallback Support**: Falls back to traditional OAuth if SDK fails
- **Responsive Design**: Works on all device sizes

#### ✅ Security Features

- **Token Validation**: Validates tokens with Yandex API
- **User Verification**: Automatically verifies users upon first login
- **Secure Storage**: Passwords are hashed and stored securely
- **Session Security**: JWT-based sessions with proper validation

### 4. How It Works

1. **User clicks "Вход с аккаунтом Yandex"**
2. **Yandex SDK initializes** and shows the authentication popup
3. **User authorizes** the application on Yandex
4. **Token is received** and sent to the token handler page
5. **User data is fetched** from Yandex API using the token
6. **User is created/updated** in your database
7. **Session is established** and user is redirected to account page

### 5. Database Integration

The system automatically:

- Creates new users if they don't exist
- Sets appropriate tariff based on user count (first 109 users get "advanced" tariff)
- Generates secure passwords and verification codes
- Links Yandex accounts to existing users by email

### 6. Testing

To test the integration:

1. Start your development server: `npm run dev`
2. Navigate to `/auth/login`
3. Click "Вход с аккаунтом Yandex"
4. Complete the Yandex authorization
5. Verify you're redirected to the account page
6. Check your database for the new user record

### 7. Production Deployment

For production deployment:

1. Update your Yandex OAuth application with production URLs
2. Set production environment variables
3. Update `NEXTAUTH_URL` to your production domain
4. Ensure your domain is added to Yandex OAuth allowed origins

### 8. Troubleshooting

**Common Issues:**

- **"Invalid client"**: Check your Yandex Client ID and Secret
- **"Redirect URI mismatch"**: Ensure redirect URIs match exactly in Yandex console
- **"SDK not loaded"**: Check if the Yandex SDK script is loading properly
- **"Token expired"**: Tokens expire after 1 hour, user needs to re-authenticate

**Debug Mode:**

- Check browser console for detailed error messages
- Verify environment variables are loaded correctly
- Test the Yandex API endpoints manually

### 9. Files Modified/Created

- `src/lib/auth.ts` - Added Yandex provider configuration
- `src/app/auth/login/page.tsx` - Integrated Yandex SDK and authentication flow
- `src/app/auth/yandex-token/page.tsx` - Token handler page for OAuth callback

### 10. Next Steps

The integration is complete and ready for use. Users can now:

- Sign in with their Yandex accounts
- Automatically get accounts created in your system
- Access all features with their Yandex-authenticated sessions

For additional OAuth providers (Google, etc.), follow the same pattern by adding new providers to the NextAuth configuration.
