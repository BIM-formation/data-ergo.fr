/*
  # Add Formation Types and NDA Field

  1. New Tables
    - `formation_types` - Configuration for each training type
    - Stores duration, hours, criteria, regulatory references
  
  2. Modified Tables
    - `organizations` - Add NDA field (replaces Numéro de déclaration)
    - `formations` - Add type reference and additional configuration

  3. Updates
    - Add formation type enum
    - Add NDA/Numéro d'activité field
*/

CREATE TYPE formation_type AS ENUM (
  'SSIAP-1',
  'SSIAP-2',
  'SSIAP-3',
  'TFP-APS',
  'SST',
  'H0-B0',
  'PRAP-IBC',
  'HYGIENE-ALIMENTAIRE'
);

CREATE TABLE IF NOT EXISTS formation_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name formation_type NOT NULL UNIQUE,
  display_name text NOT NULL,
  total_hours decimal NOT NULL,
  number_of_days integer NOT NULL,
  description text,
  regulatory_url text,
  qualiopi_criteria jsonb,
  default_slots integer DEFAULT 4,
  has_visits boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'organizations' AND column_name = 'nda'
  ) THEN
    ALTER TABLE organizations ADD COLUMN nda text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'formations' AND column_name = 'formation_type'
  ) THEN
    ALTER TABLE formations ADD COLUMN formation_type formation_type DEFAULT 'SSIAP-1';
  END IF;
END $$;

INSERT INTO formation_types (name, display_name, total_hours, number_of_days, description, regulatory_url, default_slots, has_visits) VALUES
('SSIAP-1', 'SSIAP-1 - Agent de Sécurité Incendie', 67, 10, 'Formation initiale d''agent de sécurité incendie et d''assistance à personnes', 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000448223', 4, true),
('SSIAP-2', 'SSIAP-2 - Chef d''équipe de Sécurité Incendie', 35, 5, 'Formation de chef d''équipe de sécurité incendie', 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000448223', 4, true),
('SSIAP-3', 'SSIAP-3 - Chef de Service de Sécurité Incendie', 63, 9, 'Formation de chef de service de sécurité incendie', 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000448223', 4, true),
('TFP-APS', 'TFP-APS - Agent de Prévention et de Sécurité', 70, 10, 'Formation d''agent de prévention et de sécurité', 'https://www.francecompetences.fr/recherche/rncp/36648/', 4, false),
('SST', 'SST - Sauveteur Secouriste du Travail', 14, 2, 'Formation de sauveteur secouriste du travail', 'https://formationsst.fr/index.php/37-programme-sst', 4, false),
('H0-B0', 'H0-B0 - Habilitation Électrique', 21, 3, 'Habilitation électrique H0 B0', 'https://www.legifrance.gouv.fr', 4, false),
('PRAP-IBC', 'PRAP-IBC - Prévention des Risques liés aux Activités Physiques', 21, 3, 'Formation de gestes et postures', 'https://upvfd.fr/wp-content/uploads/2024/09/M31_Doc_Info_PRAP_IBC_INIRECYCL_v072024.pdf', 4, false),
('HYGIENE-ALIMENTAIRE', 'Hygiène Alimentaire - HACCP', 14, 2, 'Formation en hygiène alimentaire et HACCP', 'https://www.legifrance.gouv.fr', 4, false);

ALTER TABLE formation_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view formation types"
  ON formation_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view formation types anon"
  ON formation_types FOR SELECT
  TO anon
  USING (true);