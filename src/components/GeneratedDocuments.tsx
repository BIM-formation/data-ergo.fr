import { Download, FileText, FileJson, FileSpreadsheet } from 'lucide-react';

interface DocumentLink {
  type: string;
  format: string;
  url: string;
  label: string;
}

interface GeneratedDocumentsProps {
  documents: DocumentLink[];
  metadata?: {
    generated_at: string;
    version: string;
    organisme: string;
  };
}

export default function GeneratedDocuments({ documents, metadata }: GeneratedDocumentsProps) {
  const getIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'html':
        return <FileText className="w-5 h-5" />;
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'json':
        return <FileJson className="w-5 h-5 text-blue-600" />;
      case 'csv':
        return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0b3d91] mb-2">Documents Générés</h2>
        {metadata && (
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Organisme:</span> {metadata.organisme}</p>
            <p><span className="font-medium">Version:</span> {metadata.version}</p>
            <p><span className="font-medium">Généré le:</span> {new Date(metadata.generated_at).toLocaleString('fr-FR')}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <a
            key={index}
            href={doc.url}
            download
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-[#f7fbff] hover:border-[#00a8a8] transition-colors group"
          >
            <div className="flex items-center space-x-3">
              {getIcon(doc.format)}
              <div>
                <p className="font-medium text-gray-900 group-hover:text-[#0b3d91]">{doc.label}</p>
                <p className="text-sm text-gray-500">{doc.format.toUpperCase()}</p>
              </div>
            </div>
            <Download className="w-5 h-5 text-gray-400 group-hover:text-[#00a8a8]" />
          </a>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#f7fbff] rounded-lg border border-[#00a8a8]">
        <h3 className="font-semibold text-[#0b3d91] mb-2">Contenu du Pack SSIAP-1</h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Planning complet 10 jours (HTML + PDF)</li>
          <li>40 sessions détaillées (JSON + CSV)</li>
          <li>QCM automatique avec correction</li>
          <li>Modèles PV et Attestation</li>
          <li>Tous les exports conformes et imprimables</li>
        </ul>
      </div>
    </div>
  );
}
