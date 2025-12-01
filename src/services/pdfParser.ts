import type { ParsedSection } from '../lib/supabase';

export interface PDFSection {
  title: string;
  content: string;
  application: string;
  duration: number;
}

export function parseC1I1Content(extractedText: string): PDFSection[] {
  const sections: PDFSection[] = [];

  const lines = extractedText.split('\n').filter(line => line.trim());

  let currentSection: Partial<PDFSection> = {};
  let currentField: 'title' | 'content' | 'application' | null = null;
  let buffer: string[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine.match(/^CONTENU\s*:?$/i)) {
      if (buffer.length > 0 && currentField) {
        if (currentField === 'title') currentSection.title = buffer.join(' ').trim();
        else if (currentField === 'content') currentSection.content = buffer.join(' ').trim();
        else if (currentField === 'application') currentSection.application = buffer.join(' ').trim();
      }
      currentField = 'content';
      buffer = [];
      continue;
    }

    if (trimmedLine.match(/^APPLICATION\s*:?$/i)) {
      if (buffer.length > 0 && currentField === 'content') {
        currentSection.content = buffer.join(' ').trim();
      }
      currentField = 'application';
      buffer = [];
      continue;
    }

    if (trimmedLine.match(/^(MATÉRIELS?|DOCUMENTATION|REMARQUES?)\s*:?$/i)) {
      if (buffer.length > 0 && currentField === 'application') {
        currentSection.application = buffer.join(' ').trim();
      }

      if (currentSection.title && currentSection.content) {
        sections.push({
          title: currentSection.title,
          content: currentSection.content,
          application: currentSection.application || '',
          duration: 1.5
        });
      }

      currentSection = {};
      currentField = null;
      buffer = [];
      continue;
    }

    if (trimmedLine.match(/^\d+[\.\)]/)) {
      if (buffer.length > 0 && currentField) {
        if (currentField === 'title') currentSection.title = buffer.join(' ').trim();
        else if (currentField === 'content') currentSection.content = buffer.join(' ').trim();
        else if (currentField === 'application') currentSection.application = buffer.join(' ').trim();
      }

      if (currentSection.title && currentSection.content && !currentField) {
        sections.push({
          title: currentSection.title,
          content: currentSection.content,
          application: currentSection.application || '',
          duration: 1.5
        });
        currentSection = {};
      }

      currentField = 'title';
      buffer = [trimmedLine];
      continue;
    }

    if (currentField && trimmedLine) {
      buffer.push(trimmedLine);
    }
  }

  if (buffer.length > 0 && currentField === 'application') {
    currentSection.application = buffer.join(' ').trim();
  }

  if (currentSection.title && currentSection.content) {
    sections.push({
      title: currentSection.title,
      content: currentSection.content,
      application: currentSection.application || '',
      duration: 1.5
    });
  }

  return sections;
}

export function mapSectionsToDays(
  sections: PDFSection[],
  numberOfDays: number,
  slotsPerDay: number,
  targetTotalHours: number
): ParsedSection[] {
  const totalSlots = numberOfDays * slotsPerDay;
  const hoursPerSlot = targetTotalHours / totalSlots;

  const result: ParsedSection[] = [];
  let sectionIndex = 0;

  for (let day = 1; day <= numberOfDays; day++) {
    for (let slot = 1; slot <= slotsPerDay; slot++) {
      if (sectionIndex < sections.length) {
        const section = sections[sectionIndex];
        result.push({
          day,
          slot,
          title: section.title,
          content: section.content,
          application: section.application,
          duration: hoursPerSlot
        });
        sectionIndex++;
      } else {
        result.push({
          day,
          slot,
          title: 'Session complémentaire',
          content: 'Révision et approfondissement des notions précédentes',
          application: 'Études de cas pratiques et mises en situation',
          duration: hoursPerSlot
        });
      }
    }
  }

  return result;
}

export async function extractTextFromPDF(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;

      try {
        const text = await parsePDFArrayBuffer(arrayBuffer);
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsArrayBuffer(file);
  });
}

async function parsePDFArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  const uint8Array = new Uint8Array(arrayBuffer);
  const text = new TextDecoder('utf-8').decode(uint8Array);

  const cleanedText = text
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  return cleanedText;
}
