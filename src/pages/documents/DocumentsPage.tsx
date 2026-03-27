import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Trash2, Share2, FileSpreadsheet, File, FileCheck } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  status: 'Draft' | 'In Review' | 'Signed';
  category: 'deal' | 'contract' | 'pitch' | 'financial' | 'other';
}

const initialDocuments: Document[] = [
  { id: '1', name: 'Pitch Deck 2026.pdf', type: 'PDF', size: '2.4 MB', lastModified: '2026-02-15', shared: true, status: 'Signed', category: 'pitch' },
  { id: '2', name: 'Investment Agreement.pdf', type: 'PDF', size: '1.8 MB', lastModified: '2026-02-10', shared: false, status: 'In Review', category: 'contract' },
  { id: '3', name: 'Business Plan.docx', type: 'Document', size: '3.2 MB', lastModified: '2026-02-05', shared: true, status: 'Draft', category: 'deal' },
  { id: '4', name: 'Market Research.pdf', type: 'PDF', size: '5.1 MB', lastModified: '2026-01-28', shared: false, status: 'Draft', category: 'financial' },
  { id: '5', name: 'Term Sheet v2.pdf', type: 'PDF', size: '0.9 MB', lastModified: '2026-03-01', shared: true, status: 'In Review', category: 'contract' },
  { id: '6', name: 'Financial Projections.xlsx', type: 'Spreadsheet', size: '1.2 MB', lastModified: '2026-03-10', shared: false, status: 'Signed', category: 'financial' },
];

// Status drives BOTH the icon color and the icon background
const statusIconConfig = {
  Draft: {
    color: '#64748b',       // grey
    bg: '#f1f5f9',          // light grey bg
  },
  'In Review': {
    color: '#d97706',       // amber
    bg: '#fffbeb',          // light amber bg
  },
  Signed: {
    color: '#16a34a',       // green
    bg: '#f0fdf4',          // light green bg
  },
};

const statusConfig = {
  Draft: { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1' },
  'In Review': { bg: '#fffbeb', color: '#d97706', border: '#fcd34d' },
  Signed: { bg: '#f0fdf4', color: '#16a34a', border: '#86efac' },
};

// Icon shape still varies by category, but color comes from status
const CategoryIcon: React.FC<{ category: string; status: 'Draft' | 'In Review' | 'Signed' }> = ({ category, status }) => {
  const iconProps = { size: 20, strokeWidth: 1.5 };
  const color = statusIconConfig[status].color;

  switch (category) {
    case 'financial': return <FileSpreadsheet {...iconProps} color={color} />;
    case 'contract': return <FileCheck {...iconProps} color={color} />;
    case 'pitch':
    case 'deal': return <FileText {...iconProps} color={color} />;
    default: return <File {...iconProps} color={color} />;
  }
};

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [activeFilter, setActiveFilter] = useState<'all' | Document['status']>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [signatureStyle, setSignatureStyle] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = activeFilter === 'all' ? documents : documents.filter(d => d.status === activeFilter);

  const handleStatusChange = (id: string, status: Document['status']) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    if (selectedDoc?.id === id) setSelectedDoc(prev => prev ? { ...prev, status } : null);
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  const handleSign = () => {
    if (!signatureName.trim() || !selectedDoc) return;
    setIsSigning(true);
    setTimeout(() => {
      handleStatusChange(selectedDoc.id, 'Signed');
      setIsSigning(false);
      setShowSignModal(false);
      setSignatureName('');
    }, 1500);
  };

  const handleFileUpload = (name: string) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: name || uploadedFileName || 'New Document.pdf',
      type: 'PDF',
      size: '1.0 MB',
      lastModified: new Date().toISOString().split('T')[0],
      shared: false,
      status: 'Draft',
      category: 'other',
    };
    setDocuments(prev => [...prev, newDoc]);
    setShowUploadModal(false);
    setUploadedFileName('');
    setDragOver(false);
  };

  const signatureStyles = [
    { label: 'Cursive', font: 'cursive', size: '28px', style: 'normal', weight: '400' },
    { label: 'Script', font: 'Georgia, serif', size: '26px', style: 'italic', weight: '400' },
    { label: 'Print', font: 'Arial, sans-serif', size: '22px', style: 'normal', weight: '700' },
  ];

  const counts = {
    all: documents.length,
    Draft: documents.filter(d => d.status === 'Draft').length,
    'In Review': documents.filter(d => d.status === 'In Review').length,
    Signed: documents.filter(d => d.status === 'Signed').length,
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Document Chamber</h1>
          <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '14px' }}>Manage deals, contracts and e-signatures</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none', borderRadius: '10px',
            padding: '10px 20px', fontSize: '14px', fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <Upload size={16} /> Upload Document
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {(['all', 'Draft', 'In Review', 'Signed'] as const).map(filter => (
          <div
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              background: activeFilter === filter ? '#6366f1' : '#fff',
              border: `1px solid ${activeFilter === filter ? '#6366f1' : '#e2e8f0'}`,
              borderRadius: '12px', padding: '16px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 700, color: activeFilter === filter ? '#fff' : '#0f172a' }}>
              {counts[filter]}
            </div>
            <div style={{ fontSize: '13px', color: activeFilter === filter ? 'rgba(255,255,255,0.8)' : '#64748b', marginTop: '4px' }}>
              {filter === 'all' ? 'Total Documents' : filter}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedDoc ? '1fr 380px' : '1fr', gap: '24px' }}>

        {/* Document List */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              {activeFilter === 'all' ? 'All Documents' : `${activeFilter} Documents`}
            </h3>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{filtered.length} files</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No documents found</div>
          ) : (
            filtered.map(doc => {
              const sc = statusConfig[doc.status];
              const ic = statusIconConfig[doc.status];
              const isSelected = selectedDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(isSelected ? null : doc)}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '14px 20px',
                    borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                    background: isSelected ? '#f5f3ff' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  {/* Icon box — color comes from status */}
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: ic.bg,
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginRight: '14px', flexShrink: 0,
                  }}>
                    <CategoryIcon category={doc.category} status={doc.status} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.name}
                      </span>
                      {doc.shared && (
                        <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '20px', background: '#ede9fe', color: '#7c3aed', fontWeight: 600 }}>Shared</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{doc.type} · {doc.size} · {doc.lastModified}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                      background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                      whiteSpace: 'nowrap',
                    }}>{doc.status}</span>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(doc.id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', display: 'flex' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Document Detail Panel */}
        {selectedDoc && (() => {
          const sc = statusConfig[selectedDoc.status];
          const ic = statusIconConfig[selectedDoc.status];
          return (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: ic.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px',
                  }}>
                    <CategoryIcon category={selectedDoc.category} status={selectedDoc.status} />
                  </div>
                  <button onClick={() => setSelectedDoc(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: '18px', lineHeight: 1 }}>✕</button>
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{selectedDoc.name}</h3>
                <span style={{
                  fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
                  background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`,
                }}>{selectedDoc.status}</span>
              </div>

              {/* Preview Area */}
              <div style={{
                margin: '20px', borderRadius: '12px', background: '#f8fafc',
                border: '1px solid #e2e8f0', padding: '32px', textAlign: 'center',
                minHeight: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={48} color="#6366f1" strokeWidth={1.5} />
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '12px' }}>{selectedDoc.name}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{selectedDoc.size}</div>
                {selectedDoc.status === 'Signed' && (
                  <div style={{ marginTop: '16px', padding: '8px 16px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #86efac' }}>
                    <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600 }}>Digitally Signed</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {[
                    { label: 'Type', value: selectedDoc.type },
                    { label: 'Size', value: selectedDoc.size },
                    { label: 'Modified', value: selectedDoc.lastModified },
                    { label: 'Shared', value: selectedDoc.shared ? 'Yes' : 'No' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>{item.label}</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Status Change */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em' }}>CHANGE STATUS</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {(['Draft', 'In Review', 'Signed'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(selectedDoc.id, s)}
                        style={{
                          flex: 1, padding: '7px 4px', borderRadius: '8px', border: `1px solid ${statusConfig[s].border}`,
                          background: selectedDoc.status === s ? statusConfig[s].bg : '#fff',
                          color: statusConfig[s].color, fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                        }}
                      >{s}</button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedDoc.status !== 'Signed' && (
                    <button
                      onClick={() => setShowSignModal(true)}
                      style={{
                        width: '100%', padding: '11px', borderRadius: '10px', border: 'none',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
                      }}
                    >E-Sign Document</button>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button style={{
                      padding: '9px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: '#f8fafc', color: '#374151', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}>
                      <Download size={14} /> Download
                    </button>
                    <button style={{
                      padding: '9px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: '#f8fafc', color: '#374151', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    }}>
                      <Share2 size={14} /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* E-Sign Modal */}
      {showSignModal && selectedDoc && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '500px', maxWidth: '90vw' }}>
            <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>E-Sign Document</h2>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>{selectedDoc.name}</p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                Type your full name to sign
              </label>
              <input
                value={signatureName}
                onChange={e => setSignatureName(e.target.value)}
                placeholder="Your full name"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            {signatureName && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>
                  Choose signature style
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {signatureStyles.map((s, i) => (
                    <div
                      key={i}
                      onClick={() => setSignatureStyle(i)}
                      style={{
                        padding: '16px 20px', borderRadius: '10px',
                        border: `2px solid ${signatureStyle === i ? '#6366f1' : '#e2e8f0'}`,
                        background: signatureStyle === i ? '#f5f3ff' : '#f8fafc', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      }}
                    >
                      <span style={{ fontFamily: s.font, fontSize: s.size, fontStyle: s.style as any, fontWeight: s.weight as any, color: '#1e293b' }}>
                        {signatureName}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '14px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
              <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                By clicking "Sign Document" you agree that this electronic signature is legally binding and equivalent to your handwritten signature.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setShowSignModal(false); setSignatureName(''); }}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#64748b' }}
              >Cancel</button>
              <button
                onClick={handleSign}
                disabled={!signatureName.trim() || isSigning}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                  background: signatureName.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#e2e8f0',
                  color: signatureName.trim() ? '#fff' : '#94a3b8',
                  fontWeight: 600, fontSize: '14px', cursor: signatureName.trim() ? 'pointer' : 'not-allowed',
                }}
              >{isSigning ? 'Signing...' : 'Sign Document'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '480px', maxWidth: '90vw' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Upload Document</h2>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); const file = e.dataTransfer.files[0]; if (file) handleFileUpload(file.name); }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#6366f1' : '#e2e8f0'}`,
                borderRadius: '14px', padding: '40px', textAlign: 'center', cursor: 'pointer',
                background: dragOver ? '#f5f3ff' : '#f8fafc', marginBottom: '20px', transition: 'all 0.2s',
              }}
            >
              <Upload size={36} color="#6366f1" strokeWidth={1.5} style={{ marginBottom: '12px' }} />
              <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>Drag and drop files here</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>or click to browse — PDF, DOCX, XLSX supported</div>
              <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f.name); }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Or enter document name manually</label>
              <input
                value={uploadedFileName}
                onChange={e => setUploadedFileName(e.target.value)}
                placeholder="e.g. Investment Agreement.pdf"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowUploadModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: 600, fontSize: '14px', cursor: 'pointer', color: '#64748b' }}>Cancel</button>
              <button onClick={() => handleFileUpload(uploadedFileName)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};