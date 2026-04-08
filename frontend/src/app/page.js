"use client";

import { useState, useRef, useEffect } from "react";

export default function IntelligentPolicyAnalyzer() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Initializing analysis");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  // Authentic, professional loading states
  useEffect(() => {
    if (!loading) return;
    const texts = [
      "Reading document structure",
      "Parsing coverage metrics",
      "Identifying waiting periods",
      "Extracting exclusions",
      "Compiling final report"
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % texts.length;
      setLoadingText(texts[i]);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Invalid file type. Please upload a PDF.");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Extraction failed. Please verify the document and try again.");

      const data = await response.json();
      
      setTimeout(() => {
        setResult(data);
        setLoading(false);
      }, 600); 
    } catch (err) {
      setError(err.message || "An unexpected error occurred during processing.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-zinc-300 font-sans selection:bg-zinc-100 selection:text-zinc-900 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-16">
        
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">
            <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
            Policy Analysis Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100">
            Intelligent Extraction
          </h1>
        </header>

        {/* Upload State */}
        {!result && (
          <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !loading && fileInputRef.current?.click()}
              className={`
                relative border transition-all duration-300 group
                ${loading ? "cursor-wait border-zinc-800 bg-zinc-900/20" : "cursor-pointer border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 hover:bg-zinc-900/50"}
                ${isDragging ? "border-zinc-500 bg-zinc-800/50" : ""}
              `}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" disabled={loading} />
              
              <div className="p-12 md:p-16 flex flex-col items-start space-y-6">
                {loading ? (
                  <div className="space-y-6 w-full">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 border-2 border-zinc-600 border-t-zinc-100 rounded-full animate-spin" />
                      <p className="text-lg text-zinc-100 font-medium">{loadingText}...</p>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-zinc-400 w-1/3 animate-[indeterminate_1.5s_infinite_ease-in-out] origin-left" />
                    </div>
                  </div>
                ) : file ? (
                  <div className="space-y-2">
                    <p className="text-xl text-zinc-100 font-medium">{file.name}</p>
                    <p className="text-sm text-zinc-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for extraction</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <svg className="w-8 h-8 text-zinc-400 group-hover:text-zinc-100 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <div>
                      <p className="text-lg text-zinc-300">Select a policy document</p>
                      <p className="text-sm text-zinc-500 mt-1">Drag and drop, or click to browse. PDF only.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 border border-red-900/50 bg-red-900/10 text-red-400 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </div>
            )}

            {!loading && (
              <button
                onClick={(e) => { e.stopPropagation(); handleExtract(); }}
                disabled={!file}
                className={`
                  mt-8 px-8 py-4 text-sm font-medium tracking-wide transition-all duration-200
                  ${!file 
                    ? "bg-zinc-900 text-zinc-600 cursor-not-allowed" 
                    : "bg-zinc-100 text-zinc-900 hover:bg-white active:scale-[0.98] shadow-sm"}
                `}
              >
                Start Analysis
              </button>
            )}
          </div>
        )}

        {/* Results Data Structure */}
        {result && (
          <div className="animate-in fade-in duration-700 ease-out space-y-24">
            
            {/* Meta Header */}
            <div className="pb-12 border-b border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <p className="text-sm font-medium text-zinc-500 tracking-wide uppercase">{result.insurance_company}</p>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100 leading-tight max-w-3xl">
                  {result.policy_name}
                </h2>
              </div>
              <button 
                onClick={() => {setResult(null); setFile(null);}}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors border border-zinc-800 hover:border-zinc-600 px-6 py-3"
              >
                Analyze New Document
              </button>
            </div>

            {/* Top Level Metrics */}
            {result.policy_metrics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                <div className="space-y-2">
                  <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Grace Period</p>
                  <p className="text-2xl text-zinc-100">{result.policy_metrics.grace_period}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Free Look</p>
                  <p className="text-2xl text-zinc-100">{result.policy_metrics.free_look_period}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Settlement SLA</p>
                  <p className="text-2xl text-zinc-100">{result.policy_metrics.claim_settlement_time}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              
              {/* Primary Covers */}
              <div className="lg:col-span-7 space-y-12">
                <h3 className="text-xl font-medium text-zinc-100 border-b border-zinc-800 pb-4">Primary Coverages</h3>
                <div className="space-y-12">
                  {result.primary_covers?.map((cover, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <h4 className="text-lg text-zinc-200">{cover.cover_name}</h4>
                        <span className="text-sm font-medium text-zinc-500">{cover.sum_insured_details}</span>
                      </div>
                      {cover.key_features && cover.key_features.length > 0 && (
                        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                          {cover.key_features.map((feature, i) => (
                            <li key={i} className="text-sm text-zinc-400 leading-relaxed flex items-start gap-3">
                              <span className="text-zinc-600 mt-1">—</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Waiting Periods & Exclusions Sidebar */}
              <div className="lg:col-span-5 space-y-16">
                
                {/* Waiting Periods */}
                <div className="space-y-8">
                  <h3 className="text-xl font-medium text-zinc-100 border-b border-zinc-800 pb-4">Waiting Periods</h3>
                  <div className="space-y-6">
                    {result.waiting_periods?.map((wp, index) => (
                      <div key={index} className="flex items-start justify-between gap-6">
                        <span className="text-sm text-zinc-400 leading-relaxed">{wp.condition}</span>
                        <span className="text-sm font-medium text-zinc-200 whitespace-nowrap">{wp.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Exclusions */}
                <div className="space-y-8">
                  <h3 className="text-xl font-medium text-zinc-100 border-b border-zinc-800 pb-4 flex items-center justify-between">
                    Critical Exclusions
                    <span className="text-xs font-normal text-red-400/80 uppercase tracking-widest bg-red-400/10 px-2 py-1">Notice</span>
                  </h3>
                  <ul className="space-y-5">
                    {result.critical_exclusions?.map((exclusion, index) => (
                      <li key={index} className="text-sm text-zinc-400 leading-relaxed pl-4 border-l border-zinc-800">
                        {exclusion}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes indeterminate {
          0% { transform: translateX(-100%) scaleX(0.2); }
          50% { transform: translateX(0%) scaleX(0.5); }
          100% { transform: translateX(300%) scaleX(0.2); }
        }
      `}} />
    </main>
  );
}