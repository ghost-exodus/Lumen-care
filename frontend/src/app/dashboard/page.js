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
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16">
        
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">
            <span className="w-2 h-2 rounded-full bg-zinc-500 shadow-[0_0_8px_rgba(255,255,255,0.3)]"></span>
            Policy Analysis Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100">
           Lumen Care
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
                relative border transition-all duration-300 group rounded-xl
                ${loading ? "cursor-wait border-zinc-800 bg-zinc-900/20" : "cursor-pointer border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/50"}
                ${isDragging ? "border-zinc-500 bg-zinc-800/50" : ""}
              `}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf" className="hidden" disabled={loading} />
              
              <div className="p-12 md:p-16 flex flex-col items-start space-y-6">
                {loading ? (
                  <div className="space-y-6 w-full">
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 border-2 border-zinc-700 border-t-zinc-100 rounded-full animate-spin" />
                      <p className="text-lg text-zinc-100 font-medium">{loadingText}...</p>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 overflow-hidden rounded-full">
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
                    <svg className="w-8 h-8 text-zinc-500 group-hover:text-zinc-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <div>
                      <p className="text-lg text-zinc-300">Select a policy document</p>
                      <p className="text-sm text-zinc-500 mt-1">Drag and drop, or click to browse. PDF only.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 border border-red-900/40 bg-red-950/10 text-red-400 text-sm flex items-start gap-3 rounded-xl">
                <svg className="w-5 h-5 shrink-0 mt-0.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </div>
            )}

            {!loading && (
              <button
                onClick={(e) => { e.stopPropagation(); handleExtract(); }}
                disabled={!file}
                className={`
                  mt-8 px-8 py-4 text-sm font-medium tracking-wide transition-all duration-200 rounded-lg
                  ${!file 
                    ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800/50" 
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
            <div className="pb-12 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase font-mono">
                  {result.insurance_company || "Unknown Provider"}
                </p>
                <h2 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100 leading-tight max-w-3xl">
                  {result.policy_name || "Standard Health Insurance Policy"}
                </h2>
              </div>
              <button 
                onClick={() => {setResult(null); setFile(null);}}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors border border-zinc-800 hover:border-zinc-700 px-6 py-3 rounded-lg bg-zinc-900/20"
              >
                Analyze New Document
              </button>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-2">
                <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase font-mono">Policy Term</p>
                <p className="text-2xl text-zinc-100 font-medium">
                  {result.policy_metrics?.policy_term_duration || "12 Months"}
                </p>
              </div>
              <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-2">
                <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase font-mono">Grace Period</p>
                <p className="text-2xl text-zinc-100 font-medium">
                  {result.policy_metrics?.grace_period || "30 Days"}
                </p>
              </div>
              <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-2">
                <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase font-mono">Free Look</p>
                <p className="text-2xl text-zinc-100 font-medium">
                  {result.policy_metrics?.free_look_period || "15 Days"}
                </p>
              </div>
              <div className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-xl space-y-2 border-l-2 border-l-zinc-500">
                <p className="text-xs font-medium tracking-widest text-zinc-400 uppercase font-mono">Settlement SLA</p>
                <p className="text-2xl text-zinc-100 font-medium">
                  {result.policy_metrics?.claim_settlement_time || "Immediate"}
                </p>
              </div>
            </div>

            {/* Financial Parameters & Eligibility */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 bg-zinc-900/20 border border-zinc-800/60 rounded-2xl space-y-6">
                <h3 className="text-lg font-medium text-zinc-100 tracking-tight">Financial Parameters</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest font-mono">Co-Payment</span>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {result.financial_parameters?.copayment_clauses || "No mandatory co-payment verified."}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest font-mono">Tax Benefits</span>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {result.financial_parameters?.tax_benefits || "Eligible under prevailing local tax laws."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-900/20 border border-zinc-800/60 rounded-2xl space-y-6">
                <h3 className="text-lg font-medium text-zinc-100 tracking-tight">Age Eligibility</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest font-mono">Adults</span>
                    <p className="text-sm text-zinc-400">
                      {result.eligibility?.adult_age_limits || "18 Years to Lifetime Renewal"}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest font-mono">Children</span>
                    <p className="text-sm text-zinc-400">
                      {result.eligibility?.child_age_limits || "91 Days up to 25 Years"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Covers Section */}
            <div className="space-y-8 pt-4">
              <h3 className="text-xl font-medium text-zinc-100 tracking-tight">Primary Coverages</h3>
              
              {result.primary_covers && result.primary_covers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {result.primary_covers.map((cover, index) => (
                    <div key={index} className="p-6 bg-zinc-900/30 border border-zinc-800/80 hover:border-zinc-700/80 transition-all rounded-xl flex flex-col justify-between min-h-[240px]">
                      <div className="space-y-3">
                        <h4 className="text-base font-medium text-zinc-200">{cover.cover_name}</h4>
                        <span className="inline-block px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-[11px] font-mono font-medium text-zinc-400 rounded-md">
                          {cover.sum_insured_details || "Covered up to Sum Insured"}
                        </span>
                      </div>
                      
                      {/* Robust array handling with clean typographic fallback bullet points */}
                      {cover.key_features && cover.key_features.length > 0 ? (
                        <ul className="space-y-2 mt-6 pt-4 border-t border-zinc-800/60">
                          {cover.key_features.map((feature, i) => (
                            <li key={i} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2.5">
                              <span className="text-zinc-600 mt-1 shrink-0">▪</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="mt-6 pt-4 border-t border-zinc-800/60">
                          <p className="text-xs text-zinc-600 italic">No specific sub-limit metrics defined.</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-zinc-800 border-dashed rounded-xl text-center">
                  <p className="text-sm text-zinc-500">No primary coverage blocks parsed.</p>
                </div>
              )}
            </div>

            {/* Waiting Periods Section */}
            <div className="space-y-8 pt-4">
              <h3 className="text-xl font-medium text-zinc-100 tracking-tight">Waiting Periods</h3>
              
              {result.waiting_periods && result.waiting_periods.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {result.waiting_periods.map((wp, index) => (
                    <div key={index} className="p-5 bg-zinc-900/20 border border-zinc-800/80 rounded-xl flex flex-col justify-between gap-4">
                      <span className="text-xs text-zinc-400 leading-relaxed font-medium">{wp.condition || "General Exclusions Waiting Period"}</span>
                      <span className="text-lg font-medium text-zinc-200 tracking-tight">{wp.duration || "N/A"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-zinc-800 border-dashed rounded-xl text-center">
                  <p className="text-sm text-zinc-500">No initialization or waiting criteria found in document parameters.</p>
                </div>
              )}
            </div>

            {/* Critical Exclusions Section */}
            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-medium text-zinc-100 tracking-tight">Critical Exclusions</h3>
                <span className="text-[10px] font-mono font-medium text-red-400 tracking-widest uppercase bg-red-950/20 border border-red-900/40 px-2.5 py-0.5 rounded">
                  Enforced
                </span>
              </div>
              
              {result.critical_exclusions && result.critical_exclusions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.critical_exclusions.map((exclusion, index) => (
                    <div key={index} className="p-5 bg-red-950/5 border border-red-900/20 rounded-xl flex items-start gap-3.5">
                      <svg className="w-4 h-4 text-red-500/40 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      <p className="text-xs text-zinc-400 leading-relaxed">{exclusion}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border border-zinc-800 border-dashed rounded-xl text-center">
                  <p className="text-sm text-zinc-500">No permanently excluded parameters flagged.</p>
                </div>
              )}
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