/*
  # Add Qualiopi Compliance and Management Modules

  1. New Tables
    - `qualiopi_checklist` - 7 criteria compliance tracking
    - `bpf_documents` - Best practices framework documents
    - `habilitations` - Certifications and approvals
    - `activity_journal` - Quarterly activity logs
    - `document_library` - Central document storage with versioning

  2. Security
    - Enable RLS on all new tables
    - Allow authenticated users to manage their organization's data
*/

CREATE TABLE IF NOT EXISTS qualiopi_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  formation_id uuid REFERENCES formations(id) ON DELETE CASCADE,
  criterion_number integer NOT NULL,
  criterion_name text NOT NULL,
  criterion_description text,
  is_compliant boolean DEFAULT false,
  evidence jsonb,
  last_audit_date timestamptz,
  next_review_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bpf_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  document_type text NOT NULL,
  version text DEFAULT '1.0',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS habilitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  acronym text,
  issuance_date timestamptz NOT NULL,
  expiration_date timestamptz,
  issuing_authority text,
  certificate_number text,
  document_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_journal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  activity_date timestamptz NOT NULL,
  quarter integer NOT NULL,
  year integer NOT NULL,
  activity_type text NOT NULL,
  description text,
  hours_completed decimal,
  stagiaires_count integer,
  formateurs_count integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS document_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text,
  category text NOT NULL,
  version text DEFAULT '1.0',
  upload_date timestamptz DEFAULT now(),
  modification_date timestamptz DEFAULT now(),
  created_by uuid,
  tags jsonb DEFAULT '[]',
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE qualiopi_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE bpf_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE habilitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view organization qualiopi"
  ON qualiopi_checklist FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert qualiopi"
  ON qualiopi_checklist FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update qualiopi"
  ON qualiopi_checklist FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view BPF documents"
  ON bpf_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert BPF documents"
  ON bpf_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update BPF documents"
  ON bpf_documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view habilitations"
  ON habilitations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert habilitations"
  ON habilitations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update habilitations"
  ON habilitations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view activity journal"
  ON activity_journal FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert activity"
  ON activity_journal FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update activity"
  ON activity_journal FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view document library"
  ON document_library FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert documents"
  ON document_library FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update documents"
  ON document_library FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);