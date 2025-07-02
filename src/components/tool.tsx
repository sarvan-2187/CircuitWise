'use client';

import React, { useState } from 'react';

type ComponentSummaryItem = {
  type: string;
  count: number;
};

type ICAssignment = {
  [label: string]: {
    type: string;
  };
};

type PinConnection = {
  from: string;
  to: string;
};

type WireCount = {
  total_circuit_connections: number;
  total_power_connections: number;
  overall_total: number;
};

type AnalysisResult = {
  component_summary: ComponentSummaryItem[];
  ic_assignment: ICAssignment;
  pin_connections: PinConnection[];
  wire_count: WireCount;
  assumptions: string[];
};

const ToolSection = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setAnalysisResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setAnalysisResult(null);
    }
  };

  const triggerFileSelect = () => {
    const input = document.getElementById('fileInput') as HTMLInputElement;
    input?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyzeImage = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/circuit-analyzer', {
        method: 'POST',
        body: formData,
      });

      const data: AnalysisResult | { error: string } = await response.json();

      if (!response.ok || 'error' in data) {
        throw new Error('error' in data ? data.error : 'Analysis failed');
      }

      setAnalysisResult(data as AnalysisResult);
    } catch (err) {
      setError((err as Error).message || 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tool" className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center w-full max-w-2xl gap-8">
        {/* Heading */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Upload Your Circuit Diagram
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Drop a circuit image or tap to select. CircuitWise will analyze wire counts, logic ICs, and connections.
          </p>
        </div>

        {/* Upload Box */}
        <div
          className="relative w-full border-2 border-dashed border-gray-500 rounded-xl px-6 py-10 md:p-10 flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-sm cursor-pointer transition-all hover:border-white shadow-lg hover:shadow-cyan-400/20"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={triggerFileSelect}
        >
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            className="hidden"
            onChange={handleFileInputChange}
          />
          {!previewUrl ? (
            <div className="text-center">
              <p className="text-lg md:text-xl text-gray-300 font-medium">
                Drag & Drop your image here
              </p>
              <p className="text-sm text-gray-500">or click to select (PNG, JPG, WebP)</p>
            </div>
          ) : (
            <div className="relative w-full">
              <img
                src={previewUrl}
                alt="Uploaded Preview"
                className="w-full max-h-96 object-contain rounded-lg shadow-md"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition"
              >
                ✖
              </button>
              <p className="text-sm text-gray-400 mt-2 text-center break-all">{image?.name}</p>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        {image && !analysisResult && (
          <button
            onClick={handleAnalyzeImage}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-md font-semibold transition-all"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Circuit'}
          </button>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Output Display */}
        {analysisResult && (
          <div className="w-full bg-zinc-900 rounded-xl p-6 mt-6 shadow-lg border border-cyan-800 text-white space-y-6">
            {/* 🔩 Components */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Components</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {analysisResult.component_summary.map((comp, idx) => (
                  <div key={idx} className="bg-zinc-800 rounded-xl p-4 shadow shadow-cyan-800/20">
                    <h4 className="text-lg font-bold text-white">{comp.type}</h4>
                    <p className="text-sm text-green-300 mt-2">Count: {comp.count}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 📦 IC Assignments */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">IC Assignments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(analysisResult.ic_assignment).map(([icLabel, details], idx) => (
                  <div key={idx} className="bg-zinc-800 rounded-xl p-4 shadow shadow-cyan-800/20">
                    <h4 className="text-lg font-bold text-white">{icLabel}</h4>
                    <p className="text-sm text-gray-300 mt-2">Type: {details.type}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔗 Pin Connections */}
            {analysisResult.pin_connections?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Pin Connections</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysisResult.pin_connections.map((conn, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-800 rounded-xl p-3 shadow shadow-cyan-800/10 flex items-center justify-between"
                    >
                      <span className="text-sm text-white font-medium">
                        From: <span className="text-green-400">{conn.from}</span>
                      </span>
                      <span className="text-sm text-white font-medium">
                        To: <span className="text-green-400">{conn.to}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 🧵 Wire Count */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Wire Count</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">Total Circuit Connections</p>
                  <p className="text-2xl text-green-300">{analysisResult.wire_count.total_circuit_connections}</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">Total Power Connections</p>
                  <p className="text-2xl text-green-300">{analysisResult.wire_count.total_power_connections}</p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">Overall Total</p>
                  <p className="text-2xl text-green-400">{analysisResult.wire_count.overall_total}</p>
                </div>
              </div>
            </div>

            {/* 📌 Assumptions */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Assumptions</h3>
              <ul className="list-disc pl-6 text-sm text-gray-300 space-y-1">
                {analysisResult.assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ToolSection;
