import { FileText, Download, Trash2, Upload, FolderOpen } from 'lucide-react';
import { useState } from 'react';

interface Document {
  id: string;
  title: string;
  category: string;
  version: string;
  uploadDate: string;
  size: string;
}

interface DocumentCategory {
  name: string;
  icon: React.ReactNode;
  count: number;
}

export default function DocumentManager() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories: DocumentCategory[] = [
    { name: 'Tous', icon: <FolderOpen className="w-5 h-5" />, count: 24 },
    { name: 'Programmes', icon: <FileText className="w-5 h-5" />, count: 8 },
    { name: 'Supports de formation', icon: <FileText className="w-5 h-5" />, count: 8 },
    { name: 'QCM & Évaluations', icon: <FileText className="w-5 h-5" />, count: 5 },
    { name: 'Certifications', icon: <FileText className="w-5 h-5" />, count: 3 },
  ];

  const documents: Document[] = [
    { id: '1', title: 'Programme SSIAP-1 V1-2026', category: 'Programmes', version: '1.2', uploadDate: '2025-01-15', size: '2.4 MB' },
    { id: '2', title: 'Support de Formation SSIAP-1', category: 'Supports', version: '1.0', uploadDate: '2025-01-15', size: '15.8 MB' },
    { id: '3', title: 'QCM SSIAP-1 - Banque de questions', category: 'QCM', version: '2.1', uploadDate: '2025-01-10', size: '1.2 MB' },
    { id: '4', title: 'Attestation de formation SSIAP-1', category: 'Certificats', version: '1.0', uploadDate: '2025-01-08', size: '0.8 MB' },
    { id: '5', title: 'Guide Qualiopi 2024', category: 'Réglementations', version: '1.0', uploadDate: '2024-12-20', size: '3.2 MB' },
  ];

  const filteredDocs = activeCategory === 'all'
    ? documents
    : documents.filter(doc => doc.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0b3d91]">Gestion des Documents</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-[#00a8a8] text-white rounded-lg hover:bg-[#008888] transition-colors">
            <Upload className="w-4 h-4" />
            <span>Charger un document</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name.toLowerCase())}
              className={`p-3 rounded-lg transition-all ${
                activeCategory === category.name.toLowerCase()
                  ? 'bg-[#0b3d91] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex flex-col items-center">
                {category.icon}
                <p className="text-xs font-medium mt-2 text-center">{category.name}</p>
                <p className="text-xs font-bold mt-1">{category.count}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0b3d91] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Titre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Catégorie</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Version</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Taille</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, index) => (
                <tr
                  key={doc.id}
                  className={`border-t ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-[#f7fbff] transition-colors`}
                >
                  <td className="px-6 py-4 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{doc.title}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{doc.version}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{doc.size}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
