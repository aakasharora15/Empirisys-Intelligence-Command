"use client";

import { useState, useRef } from 'react';
import { SFCylinderSplit1x2 as Database, SFIcloudAndArrowUp as UploadCloud, SFTextDocument as FileText, SFTablecells as FileSpreadsheet, SFDocument as FileIcon, SFCheckmarkCircle as CheckCircle2, SFExclamationmarkTriangle as AlertTriangle, SFArrowClockwise as Loader2, SFMagnifyingglass as Search, SFTrash as Trash2, SFShield as ShieldCheck, SFBolt as Zap } from 'sf-symbols-lib/monochrome';
import HeroSection from '@/components/ui/HeroSection';
import { cn } from '@/lib/utils';

// Mock initial data for the knowledge library
const INITIAL_LIBRARY = [
  { id: 'doc_1', name: 'Empirisys_Q3_Strategic_Playbook.pdf', type: 'PDF', date: '2026-06-15', size: '4.2 MB', status: 'ACTIVE' },
  { id: 'doc_2', name: 'Competitor_Battlecards_2026.pptx', type: 'PPTX', date: '2026-06-12', size: '12.8 MB', status: 'ACTIVE' },
  { id: 'doc_3', name: 'HSE_Software_Market_Analysis.docx', type: 'DOCX', date: '2026-06-10', size: '2.1 MB', status: 'ACTIVE' },
  { id: 'doc_4', name: 'DNV_vs_Sphera_Pricing_Matrix.xlsx', type: 'XLSX', date: '2026-06-05', size: '840 KB', status: 'ACTIVE' },
];

export default function TrainingDataPage() {
  const [library, setLibrary] = useState(INITIAL_LIBRARY);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload simulation state
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    // 1. Add file to library with PROCESSING status
    const newDoc = {
      id: `doc_${Date.now()}`,
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      date: new Date().toISOString().split('T')[0],
      size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      status: 'PROCESSING'
    };
    
    setLibrary(prev => [newDoc, ...prev]);

    // 2. Simulate AI Vectorization and chunking taking a few seconds
    setTimeout(() => {
      setLibrary(prev => prev.map(doc => 
        doc.id === newDoc.id ? { ...doc, status: 'ACTIVE' } : doc
      ));
    }, 4500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(processFile);
    }
  };

  const handleDelete = (id: string) => {
    setLibrary(prev => prev.filter(doc => doc.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
      case 'PPTX': return <FileText className="h-5 w-5 text-orange-500" />;
      case 'XLSX': return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'DOCX': return <FileText className="h-5 w-5 text-blue-500" />;
      default: return <FileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredLibrary = library.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-16 bg-background min-h-screen z-10 relative">
      {/* Hero Header */}
      <HeroSection
        title={
          <span className="flex items-center gap-2">
            <span>AI Knowledge &</span>
            <span className="text-accent italic font-serif">Training Hub.</span>
          </span>
        }
        subtitle="Upload strategic frameworks pitch decks and internal IP to continuously train the Empirisys intelligence engine"
        moduleLabel="MODULE 08 AI TRAINING DATA"
        belowContent={
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            {/* KPI Cards */}
            <div className="glass-card flex-1 p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <p className="text-micro font-bold text-text-secondary uppercase tracking-wider">Active Documents</p>
                <p className="text-xl font-bold text-text-primary">{library.filter(d => d.status === 'ACTIVE').length}</p>
              </div>
            </div>
            <div className="glass-card flex-1 p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-micro font-bold text-text-secondary uppercase tracking-wider">Indexed Vectors</p>
                <p className="text-xl font-bold text-text-primary">142.5K</p>
              </div>
            </div>
            <div className="glass-card flex-1 p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-micro font-bold text-text-secondary uppercase tracking-wider">System Status</p>
                <p className="text-footnote font-bold text-accent">Online & Learning</p>
              </div>
            </div>
          </div>
        }
      />

      {/* Main Container */}
      <div className="w-full px-6 md:px-10 space-y-8 max-w-[1600px] mx-auto relative z-20">

        {/* Upload Dropzone */}
        <div 
          className={cn(
            "w-full rounded-3xl border-2 border-dashed transition-all duration-300 ease-in-out p-12 flex flex-col items-center justify-center text-center relative overflow-hidden group cursor-pointer",
            isDragging 
              ? "border-accent bg-accent/5" 
              : "border-card-border bg-card/30 hover:border-accent/50 hover:bg-card/50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="h-16 w-16 rounded-full bg-background border border-card-border shadow-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10">
            <UploadCloud className="h-8 w-8 text-accent" />
          </div>
          
          <h3 className="text-lg font-bold text-text-primary mb-2 relative z-10">
            Drag & Drop to Train the AI
          </h3>
          <p className="text-xs text-text-secondary max-w-md relative z-10">
            Upload PDF, Word, PowerPoint, or Excel files. The AI will automatically chunk, vectorize, and embed these documents into its knowledge graph to improve future insights and outputs.
          </p>
          
          <button className="mt-6 px-6 py-2.5 bg-panel border border-card-border hover:border-accent text-text-primary rounded-xl text-xs font-bold transition-all relative z-10">
            Browse Files
          </button>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect}
            className="hidden" 
            multiple 
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          />
        </div>

        {/* Knowledge Library Table */}
        <div className="glass-card rounded-3xl shadow-sm border border-card-border overflow-hidden flex flex-col">
          <div className="p-6 border-b border-card-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card/50">
            <div>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                Knowledge Library
              </h3>
              <p className="text-micro text-text-secondary mt-1">
                Manage documents currently loaded into the AI context window
              </p>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Search library..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-card-border rounded-full pl-9 pr-4 py-2 text-xs text-text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-[#060D0E] border-b border-card-border">
                <tr>
                  <th className="p-4 text-micro font-bold text-text-secondary uppercase tracking-wider w-[40%]">Document Name</th>
                  <th className="p-4 text-micro font-bold text-text-secondary uppercase tracking-wider">Type</th>
                  <th className="p-4 text-micro font-bold text-text-secondary uppercase tracking-wider">Upload Date</th>
                  <th className="p-4 text-micro font-bold text-text-secondary uppercase tracking-wider">Size</th>
                  <th className="p-4 text-micro font-bold text-text-secondary uppercase tracking-wider">AI Status</th>
                  <th className="p-4 text-micro font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {filteredLibrary.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-text-secondary text-sm">
                      No documents found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredLibrary.map((doc) => (
                    <tr key={doc.id} className="hover:bg-card/30 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-background border border-card-border flex items-center justify-center shrink-0">
                            {getFileIcon(doc.type)}
                          </div>
                          <span className="text-xs font-semibold text-text-primary truncate">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-panel border border-card-border rounded text-micro font-mono text-text-secondary">
                          {doc.type}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-text-secondary">
                        {doc.date}
                      </td>
                      <td className="p-4 text-xs text-text-secondary">
                        {doc.size}
                      </td>
                      <td className="p-4">
                        {doc.status === 'ACTIVE' ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                            <span className="text-micro font-bold text-accent uppercase tracking-wider">Active in Context</span>
                          </div>
                        ) : doc.status === 'PROCESSING' ? (
                          <div className="flex items-center gap-1.5">
                            <Loader2 className="h-4 w-4 text-accent animate-spin" />
                            <span className="text-micro font-bold text-accent uppercase tracking-wider">Vectorizing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4 text-[#DC2626]" />
                            <span className="text-micro font-bold text-[#DC2626] uppercase tracking-wider">Failed</span>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 text-text-secondary hover:text-[#DC2626] hover:bg-[#DC2626]/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove from Knowledge Base"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
