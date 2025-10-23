# Yandex Maps API Setup

## Problem

The address search functionality is showing "Адрес не найден" (Address not found) error because the current Yandex Maps API key is invalid.

## Solution

### 1. Get a new API key

1. Go to [Yandex Developer Console](https://developer.tech.yandex.ru/services/)
2. Create a new project or select an existing one
3. Enable the "Geocoder API" service
4. Copy your new API key

### 2. Update the environment variable

1. Open the `.env` file in the project root
2. Replace the current `NEXT_PUBLIC_YANDEX_MAP_API_KEY` value with your new API key:
   ```
   NEXT_PUBLIC_YANDEX_MAP_API_KEY="your_new_api_key_here"
   ```

### 3. Restart the development server

After updating the API key, restart your Next.js development server:

```bash
npm run dev
# or
yarn dev
```

## Testing

After setting up the new API key, you can test the geocoding functionality by:

1. Opening the map component
2. Typing an address in the search box
3. Pressing Enter or clicking the search button
4. Checking the browser console for debug logs

## Debug Information

The component now includes extensive logging to help debug geocoding issues:

- API key availability
- Geocoding requests and responses
- Error details
- Coordinate parsing

Check the browser console for detailed information about what's happening during the search process.
