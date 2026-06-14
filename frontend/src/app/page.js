"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  // Animation Variants for the Staggered Reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 20 }
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-zinc-100 selection:text-zinc-900 overflow-y-auto relative">
      
      {/* React Bits Style Animated Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/20 blur-[120px] animate-[spin_15s_linear_infinite]" />
        <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/20 blur-[100px] animate-[spin_20s_linear_infinite_reverse]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-16 relative z-10">
        
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_#06b6d4]"></span>
            Policy Analysis Engine
          </div>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100">
            Intelligent Extraction
          </h1>
        </header>

        {/* Upload State */}
        <AnimatePresence mode="wait">
          {!result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              className="max-w-2xl"
            >
              <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => { 
                  e.preventDefault(); setIsDragging(false); 
                  if(e.dataTransfer.files[0]?.type === "application/pdf") setFile(e.dataTransfer.files[0]);
                }}
                onClick={() => !loading && fileInputRef.current?.click()}
                className={`
                  relative border transition-all duration-500 group overflow-hidden
                  ${loading ? "cursor-wait border-zinc-800 bg-zinc-900/20" : "cursor-pointer border-zinc-800 hover:border-zinc-500 bg-zinc-900/30 hover:bg-zinc-800/50"}
                  ${isDragging ? "border-cyan-500 bg-cyan-900/10 scale-[1.02]" : ""}
                `}
              >
                <input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} accept=".pdf" className="hidden" disabled={loading} />
                
                <div className="p-12 md:p-16 flex flex-col items-start space-y-6">
                  {loading ? (
                    <div className="space-y-6 w-full">
                      <div className="flex items-center gap-4">
                        <div className="w-5 h-5 border-2 border-cyan-600 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_15px_#06b6d4]" />
                        <p className="text-lg text-zinc-100 font-medium">{loadingText}...</p>
                      </div>
                      <div className="w-full h-1 bg-zinc-800 overflow-hidden rounded-full">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-1/3 animate-[indeterminate_1.5s_infinite_ease-in-out] origin-left" />
                      </div>
                    </div>
                  ) : file ? (
                    <div className="space-y-2">
                      <p className="text-xl text-zinc-100 font-medium">{file.name}</p>
                      <p className="text-sm text-cyan-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for extraction</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <svg className="w-8 h-8 text-zinc-500 group-hover:text-cyan-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <div>
                        <p className="text-lg text-zinc-300">Select a policy document</p>
                        <p className="text-sm text-zinc-500 mt-1">Drag and drop, or click to browse. PDF only.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!loading && (
                <motion.button
                  whileHover={{ scale: file ? 1.02 : 1 }}
                  whileTap={{ scale: file ? 0.98 : 1 }}
                  onClick={(e) => { e.stopPropagation(); handleExtract(); }}
                  disabled={!file}
                  className={`
                    mt-8 px-8 py-4 text-sm font-medium tracking-wide transition-all duration-300
                    ${!file 
                      ? "bg-zinc-900 text-zinc-600 cursor-not-allowed" 
                      : "bg-zinc-100 text-zinc-900 hover:bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"}
                  `}
                >
                  Start Analysis
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Dashboard */}
        {result && (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="space-y-24"
          >
            
            {/* Meta Header */}
            <motion.div variants={cardVariants} className="pb-12 border-b border-zinc-800/50 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <p className="text-sm font-medium text-cyan-500 tracking-widest uppercase">{result.insurance_company}</p>
                <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-zinc-100 leading-tight max-w-3xl">
                  {result.policy_name}
                </h2>
              </div>
              <button 
                onClick={() => {setResult(null); setFile(null);}}
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors border border-zinc-800 hover:border-zinc-500 px-6 py-3 bg-zinc-900/30 backdrop-blur-sm"
              >
                Analyze New Document
              </button>
            </motion.div>

            {/* Top Level Metrics */}
            {result.policy_metrics && (
              <motion.div variants={cardVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 hover:border-zinc-600/50 transition-colors rounded-xl space-y-2">
                  <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Policy Term</p>
                  <p className="text-2xl text-zinc-100 font-semibold">{result.policy_metrics.policy_term_duration || "N/A"}</p>
                </div>
                <div className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 hover:border-zinc-600/50 transition-colors rounded-xl space-y-2">
                  <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Grace Period</p>
                  <p className="text-2xl text-zinc-100 font-semibold">{result.policy_metrics.grace_period}</p>
                </div>
                <div className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 hover:border-zinc-600/50 transition-colors rounded-xl space-y-2">
                  <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">Free Look</p>
                  <p className="text-2xl text-zinc-100 font-semibold">{result.policy_metrics.free_look_period}</p>
                </div>
                <div className="p-6 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-xl space-y-2 border-b-2 border-b-cyan-500">
                  <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase">Settlement SLA</p>
                  <p className="text-2xl text-zinc-100 font-semibold">{result.policy_metrics.claim_settlement_time}</p>
                </div>
              </motion.div>
            )}

            {/* Primary Covers - Hover Grid */}
            <motion.div variants={cardVariants} className="space-y-8 pt-8">
              <h3 className="text-2xl font-medium text-zinc-100">Primary Coverages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.primary_covers?.map((cover, index) => (
                  <motion.div 
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    key={index} 
                    className="p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 hover:bg-zinc-800/40 hover:border-zinc-600 transition-all rounded-xl flex flex-col gap-4 shadow-xl shadow-black/20"
                  >
                    <div className="space-y-2">
                      <h4 className="text-lg font-medium text-zinc-200">{cover.cover_name}</h4>
                      <span className="inline-block px-3 py-1 bg-zinc-950 border border-zinc-800 text-xs font-medium text-zinc-400 rounded-full">
                        {cover.sum_insured_details}
                      </span>
                    </div>
                    {cover.key_features && cover.key_features.length > 0 && (
                      <ul className="space-y-2 mt-auto pt-4 border-t border-zinc-800/50">
                        {cover.key_features.map((feature, i) => (
                          <li key={i} className="text-sm text-zinc-400 leading-relaxed flex items-start gap-2">
                            <span className="text-cyan-500/50 mt-0.5">✦</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Critical Exclusions - Warning Grid */}
            <motion.div variants={cardVariants} className="space-y-8 pt-8">
              <div className="flex items-center gap-4">
                <h3 className="text-2xl font-medium text-zinc-100">Critical Exclusions</h3>
                <span className="text-xs font-medium text-red-400 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full animate-pulse">Notice</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.critical_exclusions?.map((exclusion, index) => (
                  <motion.div 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(127, 29, 29, 0.2)" }}
                    key={index} 
                    className="p-5 bg-red-950/10 border border-red-900/30 hover:border-red-500/50 rounded-xl flex items-start gap-3 transition-colors cursor-default"
                  >
                    <svg className="w-5 h-5 text-red-500/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <p className="text-sm text-zinc-300 leading-relaxed">{exclusion}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </motion.div>
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