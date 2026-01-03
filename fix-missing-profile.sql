-- Quick fix: Create your missing profile
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID from auth.users

INSERT INTO public.profiles (id, first_name, last_name)
VALUES (
  -- Get your user ID by running: SELECT id FROM auth.users WHERE email = 'your_email@example.com';
  'YOUR_USER_ID_HERE',  -- Replace this with your actual user ID
  'Your First Name',
  'Your Last Name'
);

-- Or use this automatic version (creates profiles for all users without them)
INSERT INTO public.profiles (id, first_name, last_name, phone, city, country, additional_info)
SELECT 
  id,
  raw_user_meta_data->>'first_name',
  raw_user_meta_data->>'last_name',
  raw_user_meta_data->>'phone',
  raw_user_meta_data->>'city',
  raw_user_meta_data->>'country',
  raw_user_meta_data->>'additional_info'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
