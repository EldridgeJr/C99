/*
  # Fix Infinite Recursion in Profiles RLS Policies

  1. Problem
    - Policies checking law firm admin status were querying the profiles table within the policy
    - This creates infinite recursion: to read profiles, it needs to read profiles to check if user is admin
  
  2. Solution
    - Drop problematic policies that cause recursion
    - Keep only simple, non-recursive policies
    - Law firm admins will need to be handled differently (through functions or client-side logic)
  
  3. Changes
    - Remove "Law firm admins can view client profiles from their firm" policy
    - Remove "Law firm admins can insert client profiles for their firm" policy
    - Remove "Court99 admins can insert any profile" policy
    - Keep only basic "Users can view/update own profile" policies
*/

-- Drop problematic policies
DROP POLICY IF EXISTS "Law firm admins can view client profiles from their firm" ON profiles;
DROP POLICY IF EXISTS "Law firm admins can insert client profiles for their firm" ON profiles;
DROP POLICY IF EXISTS "Court99 admins can insert any profile" ON profiles;
