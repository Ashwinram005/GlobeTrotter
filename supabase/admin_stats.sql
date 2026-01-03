-- Create a function to get admin dashboard stats safely
create or replace function get_admin_stats()
returns json
language plpgsql
security definer
as $$
declare
  total_users int;
  total_trips int;
  total_budget decimal;
  popular_cities json;
  activity_types json;
  user_trends json;
  
begin
  -- 1. KPI Counts
  select count(*) into total_users from profiles;
  select count(*) into total_trips from trips;
  select coalesce(sum(budget_total), 0) into total_budget from trips;

  -- 2. Top Cities (based on itinerary items)
  select json_agg(t) into popular_cities from (
    select city_name as city, count(*) as visitors
    from itinerary_items
    group by city_name
    order by visitors desc
    limit 5
  ) t;

  -- 3. Activity Types (using simple count of types)
  select json_agg(t) into activity_types from (
    select activity_type as name, count(*) as value
    from itinerary_items
    where activity_type is not null
    group by activity_type
    order by value desc
    limit 5
  ) t;

  -- 4. User Trends (Mocked distribution for demo because date_trunc is complex to standardize in one query for this simplified setup)
  -- Or we can just count registrations by month if current date
  -- For hackathon, returning a static trend or better, a trend based on created_at if we had enough data.
  -- Let's return the real logic for "Trips Created" by month if there is data, otherwise fallback to mock in UI.
  -- For now, we return null for trends and let UI calculate it from profile lists or use defaults.

  return json_build_object(
    'total_users', total_users,
    'total_trips', total_trips,
    'total_budget', total_budget,
    'popular_cities', coalesce(popular_cities, '[]'::json),
    'activity_types', coalesce(activity_types, '[]'::json)
  );
end;
$$;
