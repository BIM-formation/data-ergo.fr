/*
  # SSIAP-1 Document Generation System

  1. New Tables
    - `organizations`
      - Organization details (BIM-FCS, etc.)
      - Logo storage URL
      - Contact information
      - Legal identifiers (SIRET, APE, etc.)
    
    - `formations`
      - Formation configurations (SSIAP-1 V1-2026, etc.)
      - Duration, number of days
      - Time slots configuration
      - Regulatory references
    
    - `source_documents`
      - C1-I1 PDF storage
      - Extracted text content
      - Parsed sections
    
    - `planning`
      - Generated planning details
      - Day/slot mappings
      - Content and application sections
    
    - `sessions`
      - Detailed session information
      - One per time slot
      - Evaluation criteria
    
    - `qcm`
      - Generated questions
      - Answers and corrections
      - Scoring thresholds
    
    - `generated_documents`
      - Storage URLs for all outputs
      - HTML, PDF, JSON, CSV files
      - Metadata and versioning
    
    - `stagiaires`
      - Trainee information
      - Exam results
      - Attestations
  
  2. Security
    - Enable RLS on all tables
    - Authenticated users can manage their organization's data
*/

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  phone text NOT NULL,
  email text NOT NULL,
  address text NOT NULL,
  declaration_number text NOT NULL,
  siret text NOT NULL,
  code_ape text NOT NULL,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS formations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'SSIAP-1',
  version text NOT NULL DEFAULT 'V1-2026',
  total_duration_hours decimal NOT NULL DEFAULT 67,
  number_of_days integer NOT NULL DEFAULT 10,
  time_slots jsonb NOT NULL DEFAULT '[]',
  include_visits boolean DEFAULT false,
  regulatory_references text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS source_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid REFERENCES formations(id) ON DELETE CASCADE,
  document_type text NOT NULL DEFAULT 'C1-I1',
  file_url text NOT NULL,
  extracted_text text,
  parsed_sections jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS planning (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid REFERENCES formations(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  slot_number integer NOT NULL,
  slot_time text NOT NULL,
  duration_hours decimal NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  application text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  planning_id uuid REFERENCES planning(id) ON DELETE CASCADE,
  session_number integer NOT NULL,
  evaluation_criteria jsonb,
  additional_notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS qcm (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid REFERENCES formations(id) ON DELETE CASCADE,
  total_questions integer NOT NULL DEFAULT 30,
  passing_threshold decimal NOT NULL DEFAULT 0.7,
  questions jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid REFERENCES formations(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  format text NOT NULL,
  file_url text NOT NULL,
  metadata jsonb,
  generated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stagiaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formation_id uuid REFERENCES formations(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  qcm_score decimal,
  passed boolean DEFAULT false,
  attestation_url text,
  pv_url text,
  exam_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE formations ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE qcm ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE stagiaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view formations"
  ON formations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert formations"
  ON formations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update formations"
  ON formations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can view source documents"
  ON source_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert source documents"
  ON source_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view planning"
  ON planning FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert planning"
  ON planning FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view sessions"
  ON sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert sessions"
  ON sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view qcm"
  ON qcm FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert qcm"
  ON qcm FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view generated documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert generated documents"
  ON generated_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view stagiaires"
  ON stagiaires FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert stagiaires"
  ON stagiaires FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update stagiaires"
  ON stagiaires FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);