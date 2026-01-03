# Database Schema Status Check

## ✅ Required Tables

Your application needs 3 tables in Supabase:

### 1. `profiles` Table
**Status**: Should exist (auto-created by trigger or manually)
```sql
-- Check if exists:
SELECT * FROM profiles;
```

### 2. `trips` Table  
**Status**: Should exist
```sql
-- Check if exists:
SELECT * FROM trips;
```

### 3. `itinerary_items` Table
**Status**: MUST EXIST for Itinerary Builder to work
```sql
-- Check if exists:
SELECT * FROM itinerary_items;
```

---

## 🔍 How to Verify itinerary_items Table

### Method 1: Supabase Dashboard
1. Open your **Supabase Dashboard**
2. Go to **Table Editor** (left sidebar)
3. Look for table named `itinerary_items`
4. If you DON'T see it → **Run the schema script below**

### Method 2: SQL Editor
Run this in **Supabase SQL Editor**:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name = 'itinerary_items';
```

**Expected Result**: Should return 1 row  
**If empty**: Table doesn't exist → Run schema script

---

## 🛠️ Create itinerary_items Table

If the table doesn't exist, run this in **Supabase SQL Editor**:

```sql
-- Create itinerary_items table
CREATE TABLE IF NOT EXISTS public.itinerary_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  city_name TEXT NOT NULL,
  date DATE NOT NULL,
  activity_name TEXT NOT NULL,
  activity_type TEXT,
  cost DECIMAL(10,2) DEFAULT 0,
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.itinerary_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view itinerary items of their trips." ON public.itinerary_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = itinerary_items.trip_id 
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage itinerary items of their trips." ON public.itinerary_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = itinerary_items.trip_id 
      AND trips.user_id = auth.uid()
    )
  );
```

---

## 📊 Current Application Flow with itinerary_items

### When you create a trip:
1. **Create Trip** page → Saves to `trips` table
2. Redirects to **Itinerary Builder** (`/trip/:tripId`)
3. Itinerary Builder **loads** from `itinerary_items` table
4. Click "Add Section" → Creates empty section in UI
5. Fill details → Click "Save" → **Saves to `itinerary_items` table**

### Data structure in itinerary_items:
```javascript
{
  id: "uuid",
  trip_id: "trip-uuid",  // Links to trips table
  city_name: "Paris",
  date: "2024-06-15",
  activity_name: "Visit Eiffel Tower, Hotel stay",  // Stored in 'notes' field in UI
  activity_type: "section",
  cost: 150.00,  // Budget amount
  created_at: "timestamp"
}
```

---

## 🚨 Common Issue: "Table doesn't exist" Error

**Symptom**: When you open Itinerary Builder, you see errors in console:
```
❌ relation "public.itinerary_items" does not exist
```

**Solution**: 
1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Paste the CREATE TABLE script above
4. Click **Run**
5. Refresh your app

---

## ✅ Verification Steps

After running the schema, verify everything works:

### Step 1: Check Tables Exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected: `itinerary_items`, `profiles`, `trips`

### Step 2: Test Insert
```sql
-- Should return 0 rows (no itinerary items yet)
SELECT * FROM itinerary_items;
```

### Step 3: Test in App
1. Create a trip
2. Go to Itinerary Builder
3. Add a section
4. Fill in details
5. Click Save
6. Refresh Supabase → Check `itinerary_items` table

**Expected**: New row(s) appear in `itinerary_items` table

---

## 📝 Quick Diagnostic

Run this to see all your data:

```sql
-- See what you have
SELECT 
  'trips' as table_name, 
  COUNT(*) as row_count 
FROM trips
UNION ALL
SELECT 
  'profiles' as table_name, 
  COUNT(*) as row_count 
FROM profiles
UNION ALL
SELECT 
  'itinerary_items' as table_name, 
  COUNT(*) as row_count 
FROM itinerary_items;
```

This shows how many rows are in each table.
