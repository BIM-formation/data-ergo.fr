import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  phone: string;
  email: string;
  address: string;
  declaration_number: string;
  siret: string;
  code_ape: string;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface Formation {
  id: string;
  organization_id: string;
  title: string;
  version: string;
  total_duration_hours: number;
  number_of_days: number;
  time_slots: TimeSlot[];
  include_visits: boolean;
  regulatory_references: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export interface SourceDocument {
  id: string;
  formation_id: string;
  document_type: string;
  file_url: string;
  extracted_text: string | null;
  parsed_sections: ParsedSection[] | null;
  created_at: string;
}

export interface ParsedSection {
  day: number;
  slot: number;
  title: string;
  content: string;
  application: string;
  duration: number;
}

export interface Planning {
  id: string;
  formation_id: string;
  day_number: number;
  slot_number: number;
  slot_time: string;
  duration_hours: number;
  title: string;
  content: string;
  application: string;
  created_at: string;
}

export interface Session {
  id: string;
  planning_id: string;
  session_number: number;
  evaluation_criteria: Record<string, unknown> | null;
  additional_notes: string | null;
  created_at: string;
}

export interface QCM {
  id: string;
  formation_id: string;
  total_questions: number;
  passing_threshold: number;
  questions: Question[];
  created_at: string;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

export interface GeneratedDocument {
  id: string;
  formation_id: string;
  document_type: string;
  format: string;
  file_url: string;
  metadata: Record<string, unknown> | null;
  generated_at: string;
}

export interface Stagiaire {
  id: string;
  formation_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  qcm_score: number | null;
  passed: boolean;
  attestation_url: string | null;
  pv_url: string | null;
  exam_date: string | null;
  created_at: string;
}
