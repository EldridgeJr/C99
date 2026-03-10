/*
  # Create Documents Storage System

  1. New Tables
    - `user_documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to profiles)
      - `file_name` (text)
      - `file_size` (bigint, in bytes)
      - `file_type` (text, mime type)
      - `storage_path` (text, path in Supabase Storage)
      - `uploaded_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Storage Bucket
    - Creates a 'documents' bucket for file storage
    - Configured for authenticated user access

  3. Security
    - Enable RLS on user_documents table
    - Users can only view, insert, and delete their own documents
    - Storage policies ensure users can only access their own files
*/

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create user_documents table
CREATE TABLE IF NOT EXISTS user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_type text NOT NULL,
  storage_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Policies for user_documents
CREATE POLICY "Users can view own documents"
  ON user_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own documents"
  ON user_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON user_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Storage policies for documents bucket
CREATE POLICY "Users can upload own documents to storage"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own documents in storage"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own documents from storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_uploaded_at ON user_documents(uploaded_at DESC);
