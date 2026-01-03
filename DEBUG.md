# Debug & Testing Guide for GlobeTrotter

## Common Issues & Solutions

### Issue 1: Trips Not Showing in Dashboard/My Trips
**Problem**: Created trips don't appear in the lists
**Solution Steps**:
1. Open Supabase Dashboard → Table Editor → trips table
2. Check if trips exist with your user_id
3. Verify RLS policies are working:
   ```sql
   -- Run this in Supabase SQL Editor to test
   SELECT * FROM trips WHERE user_id = auth.uid();
   ```

### Issue 2: Profile Foreign Key Error
**Problem**: "Key is not present in table profiles" when creating trips
**Already Fixed**: Auto-creates profile in CreateTrip.tsx
**Verification**: Check profiles table has your user entry

### Issue 3: Navigation Flow
**Current Behavior**:
- Create Trip → Redirects to `/trip/:tripId` (Itinerary Builder)
- Dashboard Trip Card Click → Goes to `/trip/:tripId` (Itinerary Builder)
- My Trips "View" Button → Goes to `/trip/:tripId` (Itinerary Builder)

**Expected Flow**: ✅ Working as designed

## Testing Checklist

### 1. Authentication Flow
- [ ] Register new user → Profile auto-created
- [ ] Login existing user → Dashboard loads
- [ ] Logout → Redirects to login

### 2. Trip Creation
- [ ] Fill out Create Trip form
- [ ] Click "Save & Continue"
- [ ] Verify redirect to Itinerary Builder
- [ ] Check trip exists in Supabase

### 3. Dashboard
- [ ] See created trips in "Previous Trips"
- [ ] Click trip card → Goes to Itinerary Builder
- [ ] FAB button → Goes to Create Trip

### 4. My Trips
- [ ] Access via Navbar "My Trips" link
- [ ] See trips categorized (Ongoing/Upcoming/Completed)
- [ ] Search functionality works
- [ ] View/Edit/Delete buttons work

### 5. Itinerary Builder
- [ ] Add sections with city, dates, budget
- [ ] Save sections → Data persists
- [ ] Back button → Returns to My Trips

## Debug Console Commands

Open browser console (F12) and run:

```javascript
// Check current user
const user = JSON.parse(localStorage.getItem('sb-zpkgamquhavuntfrdngi-auth-token'))
console.log('User:', user)

// Test Supabase connection
const { createClient } = supabase
const client = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
const { data, error } = await client.from('trips').select('*')
console.log('Trips:', data, 'Error:', error)
```

## Common Supabase Checks

### Check RLS Policies
```sql
-- Verify you can see your own trips
SELECT * FROM trips;

-- If empty but you created trips, RLS might be blocking
-- Check policies in Supabase Dashboard → Authentication → Policies
```

### Check Profile Exists
```sql
SELECT * FROM profiles WHERE id = auth.uid();
-- Should return your profile row
```

### Manually Create Profile (if needed)
```sql
INSERT INTO profiles (id, first_name, last_name)
SELECT id, raw_user_meta_data->>'first_name', raw_user_meta_data->>'last_name'
FROM auth.users
WHERE id = auth.uid();
```

## Environment Variables Check

Ensure `.env` has:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Restart dev server after changing `.env`:
```bash
# Stop current server (Ctrl+C)
npm run dev
```
