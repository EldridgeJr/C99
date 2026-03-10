/*
  # Rename Test Account Emails

  Updates existing test account emails and names:
  - admin@smithpartners.com -> admin@lawfirm.com
  - lev.loukhton@example.com -> robin.vandenbosch@example.com
  - Updates corresponding profiles and law firm contact email
  - Updates auth.users email fields

  1. Modified Tables
    - `auth.users` - email updated for two users
    - `profiles` - email and full_name updated
    - `law_firms` - contact_email updated
*/

UPDATE auth.users
SET email = 'admin@lawfirm.com',
    raw_user_meta_data = raw_user_meta_data || '{"email": "admin@lawfirm.com"}'::jsonb
WHERE email = 'admin@smithpartners.com';

UPDATE auth.users
SET email = 'robin.vandenbosch@example.com',
    raw_user_meta_data = raw_user_meta_data || '{"email": "robin.vandenbosch@example.com"}'::jsonb
WHERE email = 'lev.loukhton@example.com';

UPDATE profiles
SET email = 'admin@lawfirm.com'
WHERE email = 'admin@smithpartners.com';

UPDATE profiles
SET email = 'robin.vandenbosch@example.com',
    full_name = 'Robin van den Bosch'
WHERE email = 'lev.loukhton@example.com';

UPDATE law_firms
SET contact_email = 'admin@lawfirm.com'
WHERE contact_email = 'admin@smithpartners.com';