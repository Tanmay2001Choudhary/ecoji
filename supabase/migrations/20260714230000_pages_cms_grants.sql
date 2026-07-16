-- Ensure permissions are explicitly granted for page_contents across both local and production
GRANT ALL ON TABLE page_contents TO anon, authenticated, service_role;
DO $$ BEGIN GRANT ALL ON SEQUENCE page_contents_id_seq TO anon, authenticated, service_role; EXCEPTION WHEN undefined_table THEN NULL; END $$;
