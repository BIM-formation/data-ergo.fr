import { supabase } from '../lib/supabase';
import type { Organization, Formation, Planning } from '../lib/supabase';

interface GenerateDocumentsParams {
  organizationId: string;
  formationId: string;
}

interface GeneratedDocumentsResult {
  planning_html_url: string;
  planning_pdf_url: string;
  sessions_url: string;
  qcm_url: string;
  pv_examen_url: string;
  attestation_url: string;
  meta: {
    generated_at: string;
    version: string;
    organisme: string;
  };
}

export async function generatePlanningHTML(
  organization: Organization,
  formation: Formation,
  planningItems: Planning[]
): Promise<string> {
  const groupedByDay = planningItems.reduce((acc, item) => {
    if (!acc[item.day_number]) {
      acc[item.day_number] = [];
    }
    acc[item.day_number].push(item);
    return acc;
  }, {} as Record<number, Planning[]>);

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Planning ${formation.title} - ${formation.version}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #0b3d91;
    }

    .logo {
      max-width: 200px;
      max-height: 80px;
    }

    .header-info {
      text-align: right;
      font-size: 14px;
    }

    .header-info h1 {
      color: #0b3d91;
      font-size: 24px;
      margin-bottom: 10px;
    }

    .header-info p {
      color: #666;
      margin: 2px 0;
    }

    .contact-info {
      background: #f7fbff;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
      font-size: 13px;
    }

    .contact-info p {
      margin: 3px 0;
    }

    .contact-info strong {
      color: #0b3d91;
    }

    .day-section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }

    .day-header {
      background: linear-gradient(135deg, #0b3d91 0%, #00a8a8 100%);
      color: white;
      padding: 12px 20px;
      border-radius: 8px 8px 0 0;
      font-size: 18px;
      font-weight: bold;
    }

    .planning-table {
      width: 100%;
      border-collapse: collapse;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 0 0 8px 8px;
      overflow: hidden;
    }

    .planning-table th {
      background: #00a8a8;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }

    .planning-table td {
      padding: 15px 12px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }

    .planning-table tr:nth-child(even) {
      background: #f9fafb;
    }

    .planning-table tr:last-child td {
      border-bottom: none;
    }

    .slot-time {
      font-weight: 600;
      color: #0b3d91;
      white-space: nowrap;
      min-width: 120px;
    }

    .slot-duration {
      color: #666;
      font-size: 13px;
      white-space: nowrap;
    }

    .slot-title {
      font-weight: 600;
      color: #0b3d91;
      margin-bottom: 8px;
      font-size: 15px;
    }

    .slot-content, .slot-application {
      font-size: 13px;
      line-height: 1.8;
      margin-bottom: 10px;
      color: #444;
      text-align: justify;
    }

    .slot-label {
      font-size: 12px;
      font-weight: 600;
      color: #00a8a8;
      text-transform: uppercase;
      margin-top: 10px;
      margin-bottom: 5px;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #666;
    }

    @media print {
      body {
        padding: 0;
      }

      .day-section {
        page-break-after: always;
      }

      .day-section:last-child {
        page-break-after: auto;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      ${organization.logo_url ? `<img src="${organization.logo_url}" alt="${organization.name}" class="logo">` : `<h1 style="color: #0b3d91;">${organization.name}</h1>`}
    </div>
    <div class="header-info">
      <h1>${formation.title} - ${formation.version}</h1>
      <p>Durée totale: ${formation.total_duration_hours}h</p>
      <p>Nombre de jours: ${formation.number_of_days}</p>
    </div>
  </div>

  <div class="contact-info">
    <p><strong>${organization.name}</strong></p>
    <p>${organization.address}</p>
    <p>Tél: ${organization.phone} | Email: ${organization.email}</p>
    ${organization.website ? `<p>Site web: ${organization.website}</p>` : ''}
    <p>N° Déclaration: ${organization.declaration_number} | SIRET: ${organization.siret} | Code APE: ${organization.code_ape}</p>
  </div>

  ${Object.entries(groupedByDay).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([day, items]) => `
    <div class="day-section">
      <div class="day-header">Jour ${day}</div>
      <table class="planning-table">
        <thead>
          <tr>
            <th style="width: 150px;">Horaires</th>
            <th>Contenu de la formation</th>
          </tr>
        </thead>
        <tbody>
          ${items.sort((a, b) => a.slot_number - b.slot_number).map(item => `
            <tr>
              <td>
                <div class="slot-time">${item.slot_time}</div>
                <div class="slot-duration">${item.duration_hours}h</div>
              </td>
              <td>
                <div class="slot-title">${item.title}</div>

                <div class="slot-label">Contenu</div>
                <div class="slot-content">${item.content}</div>

                ${item.application ? `
                  <div class="slot-label">Application</div>
                  <div class="slot-application">${item.application}</div>
                ` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('')}

  <div class="footer">
    <p>Document généré le ${new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
    <p>${organization.name} - Formation ${formation.title} ${formation.version}</p>
  </div>
</body>
</html>
  `;

  return html;
}

export async function generateSessionsJSON(
  formation: Formation,
  planningItems: Planning[]
): Promise<Record<string, unknown>[]> {
  return planningItems.map((item, index) => ({
    session_number: index + 1,
    day: item.day_number,
    slot: item.slot_number,
    time: item.slot_time,
    duration_hours: item.duration_hours,
    title: item.title,
    content: item.content,
    application: item.application,
    evaluation_criteria: {
      theoretical_knowledge: true,
      practical_application: item.application !== '',
      participation: true
    }
  }));
}

export async function generateQCM(
  formationId: string,
  totalQuestions: number,
  passingThreshold: number,
  planningItems: Planning[]
): Promise<Record<string, unknown>> {
  const questions = planningItems.slice(0, totalQuestions).map((item, index) => ({
    id: index + 1,
    question: `Question relative à: ${item.title}`,
    options: [
      'Réponse A',
      'Réponse B',
      'Réponse C',
      'Réponse D'
    ],
    correct_answer: 0,
    explanation: `Basée sur le contenu: ${item.content.substring(0, 100)}...`
  }));

  return {
    formation_id: formationId,
    total_questions: totalQuestions,
    passing_threshold: passingThreshold,
    questions,
    instructions: 'Choisissez la réponse correcte pour chaque question. Le seuil de réussite est de ' + (passingThreshold * 100) + '%.'
  };
}

export async function generateAttestationHTML(
  organization: Organization,
  formation: Formation,
  stagiaire: { first_name: string; last_name: string; exam_date: string; score: number }
): Promise<string> {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Attestation de Formation</title>
  <style>
    body {
      font-family: 'Inter', 'Roboto', sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
    }
    .title {
      font-size: 28px;
      font-weight: bold;
      color: #0b3d91;
      margin: 20px 0;
      text-transform: uppercase;
    }
    .content {
      line-height: 2;
      font-size: 16px;
      text-align: justify;
    }
    .highlight {
      font-weight: bold;
      color: #0b3d91;
    }
    .signature-section {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      text-align: center;
      width: 45%;
    }
    .border-decoration {
      border: 3px solid #0b3d91;
      padding: 30px;
      border-radius: 10px;
    }
  </style>
</head>
<body>
  <div class="border-decoration">
    <div class="header">
      ${organization.logo_url ? `<img src="${organization.logo_url}" alt="${organization.name}" class="logo">` : ''}
      <div class="title">Attestation de Formation</div>
      <p><strong>${formation.title} - ${formation.version}</strong></p>
    </div>

    <div class="content">
      <p>Le centre de formation <span class="highlight">${organization.name}</span>, enregistré sous le numéro <span class="highlight">${organization.declaration_number}</span>,</p>

      <p>Atteste que <span class="highlight">${stagiaire.first_name} ${stagiaire.last_name}</span></p>

      <p>a suivi et validé la formation <span class="highlight">${formation.title}</span> version <span class="highlight">${formation.version}</span></p>

      <p>d'une durée de <span class="highlight">${formation.total_duration_hours} heures</span>, du <span class="highlight">${new Date(stagiaire.exam_date).toLocaleDateString('fr-FR')}</span></p>

      <p>avec un résultat de <span class="highlight">${(stagiaire.score * 100).toFixed(0)}%</span> à l'évaluation finale.</p>

      <p style="margin-top: 30px;">Fait à ${organization.address.split(',')[0]}, le ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>

    <div class="signature-section">
      <div class="signature-box">
        <p>Le stagiaire</p>
        <div style="height: 60px;"></div>
        <p>_______________________</p>
      </div>
      <div class="signature-box">
        <p>Le formateur</p>
        <div style="height: 60px;"></div>
        <p>_______________________</p>
      </div>
    </div>

    <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
      <p>${organization.name} - ${organization.address}</p>
      <p>Tél: ${organization.phone} | Email: ${organization.email}</p>
      <p>SIRET: ${organization.siret} | Code APE: ${organization.code_ape}</p>
    </div>
  </div>
</body>
</html>
  `;
}

export async function generateDocuments(params: GenerateDocumentsParams): Promise<GeneratedDocumentsResult> {
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', params.organizationId)
    .maybeSingle();

  const { data: formation } = await supabase
    .from('formations')
    .select('*')
    .eq('id', params.formationId)
    .maybeSingle();

  const { data: planningItems } = await supabase
    .from('planning')
    .select('*')
    .eq('formation_id', params.formationId)
    .order('day_number')
    .order('slot_number');

  if (!organization || !formation || !planningItems) {
    throw new Error('Missing required data');
  }

  const planningHTML = await generatePlanningHTML(organization, formation, planningItems);
  const sessionsJSON = await generateSessionsJSON(formation, planningItems);

  const htmlBlob = new Blob([planningHTML], { type: 'text/html' });
  const htmlUrl = URL.createObjectURL(htmlBlob);

  const sessionsBlob = new Blob([JSON.stringify(sessionsJSON, null, 2)], { type: 'application/json' });
  const sessionsUrl = URL.createObjectURL(sessionsBlob);

  return {
    planning_html_url: htmlUrl,
    planning_pdf_url: htmlUrl,
    sessions_url: sessionsUrl,
    qcm_url: '',
    pv_examen_url: '',
    attestation_url: '',
    meta: {
      generated_at: new Date().toISOString(),
      version: formation.version,
      organisme: organization.name
    }
  };
}
