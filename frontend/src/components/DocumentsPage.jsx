import React, { useState, useCallback } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle, File } from 'lucide-react';

const DocumentsPage = () => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([
    { id: 1, name: 'GST_Return_April_2025.pdf', size: '1.2 MB', status: 'processed', type: 'PDF' },
    { id: 2, name: 'TDS_Certificate_Q4.xlsx', size: '840 KB', status: 'processed', type: 'XLS' },
    { id: 3, name: 'Balance_Sheet_FY24.pdf', size: '2.1 MB', status: 'processing', type: 'PDF' },
  ]);

  const processUploads = async (selectedFiles) => {
    const newFiles = selectedFiles.map((f, i) => ({
      id: Date.now() + i,
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2) + ' MB',
      status: 'uploading',
      type: f.name.split('.').pop().toUpperCase(),
      rawFile: f
    }));

    setFiles(prev => [...newFiles, ...prev]);

    for (const fileObj of newFiles) {
      const formData = new FormData();
      formData.append('file', fileObj.rawFile);

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setFiles(prev => prev.map(f =>
            f.id === fileObj.id ? { ...f, status: 'processed' } : f
          ));
        } else {
          setFiles(prev => prev.map(f =>
            f.id === fileObj.id ? { ...f, status: 'error' } : f
          ));
        }
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === fileObj.id ? { ...f, status: 'error' } : f
        ));
      }
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    processUploads(dropped);
  }, []);

  const handleFileInput = (e) => {
    const selected = Array.from(e.target.files);
    processUploads(selected);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const statusIcon = (status) => {
    if (status === 'processed') return <CheckCircle size={16} className="text-emerald-400" />;
    if (status === 'processing' || status === 'uploading') return (
      <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
    );
    return <AlertCircle size={16} className="text-red-400" />;
  };

  const typeColor = (type) => {
    if (type === 'PDF') return 'bg-red-500/10 text-red-400';
    if (type === 'XLS' || type === 'XLSX') return 'bg-green-500/10 text-green-400';
    return 'bg-blue-500/10 text-blue-400';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Document Manager</h2>
        <p className="text-slate-400 mt-1">Upload PDFs or Excel files for AI-powered tax analysis.</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
          dragOver
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/3'
        }`}
      >
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
            <Upload size={28} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-lg font-semibold">Drop files here or <span className="text-indigo-400 underline">browse</span></p>
            <p className="text-slate-400 text-sm mt-1">Supports PDF, XLS, XLSX — Max 25MB each</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.xls,.xlsx"
            onChange={handleFileInput}
          />
        </label>
      </div>

      {/* File List */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText size={18} className="text-indigo-400" /> Uploaded Documents
          <span className="ml-auto text-sm text-slate-400 font-normal">{files.length} file{files.length !== 1 ? 's' : ''}</span>
        </h3>
        <div className="space-y-3">
          {files.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <File size={32} className="mx-auto mb-2 opacity-30" />
              <p>No documents uploaded yet.</p>
            </div>
          )}
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${typeColor(file.type)}`}>
                {file.type}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{file.size}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  {statusIcon(file.status)}
                  <span className="capitalize">{file.status}</span>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
