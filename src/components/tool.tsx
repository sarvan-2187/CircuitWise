'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => {
    document.getElementById('fileInput')?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleAnalyzeImage = async () => {
    if (!image) return;

    try {
      setLoading(true);
      setError(null);
      setAnalysisResult(null);

      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/circuit-analyzer', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed');
      setAnalysisResult(data);
    } catch (err) {
      const e = err as Error;
      setError(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tool" className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center w-full max-w-2xl gap-8">

        {/* 🔠 Heading */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Upload Your Circuit Diagram
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Drop a circuit image or tap to select. CircuitWise will analyze wire counts, logic ICs, and connections.
          </p>
        </motion.div>

        {/* 🖼️ Upload Box */}
        <motion.div
          className="relative w-full border-2 border-dashed border-gray-500 rounded-xl px-6 md:px-24 py-10 md:p-10 flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-sm cursor-pointer transition-all hover:border-white shadow-lg hover:shadow-cyan-400/20"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={triggerFileSelect}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            className="hidden"
            onChange={handleFileInputChange}
            aria-label="Upload circuit image"
          />
          {!previewUrl ? (
            <div className="text-center">
              <p className="text-lg md:text-xl md:max-w-md text-gray-300 font-medium">
                Drag & Drop your image here
              </p>
              <p className="text-sm text-gray-500">or click to select (PNG, JPG, WebP)</p>
            </div>
          ) : (
            <motion.div
              className="relative w-full"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={previewUrl}
                alt="Uploaded Preview"
                className="w-full max-h-96 object-contain rounded-lg shadow-md"
                width={500}
                height={300}
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
            </motion.div>
          )}
        </motion.div>

        {/* 🔍 Analyze Button */}
        {image && (
          <motion.button
            onClick={handleAnalyzeImage}
            className="bg-gray-100 hover:bg-gray-400 cursor-pointer text-black px-4 transition-all duration-500 py-2 rounded-md"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {loading ? 'Analyzing...' : 'Analyze Circuit'}
          </motion.button>
        )}

        {/* 📊 Analysis Output */}
        {analysisResult && (
          <motion.div
            className="w-full bg-zinc-900 rounded-xl p-6 mt-6 shadow-lg border border-cyan-800 text-white space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Components */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Components</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {analysisResult.component_summary.map((comp, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-zinc-800 rounded-xl p-4 shadow shadow-cyan-800/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <h4 className="text-lg font-bold text-white">{comp.type}</h4>
                    <p className="text-sm text-green-300 mt-2">Count: {comp.count}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* IC Assignments */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">IC Assignments</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(analysisResult.ic_assignment).map(([label, details], idx) => (
                  <motion.div
                    key={idx}
                    className="bg-zinc-800 rounded-xl p-4 shadow shadow-cyan-800/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <h4 className="text-lg font-bold text-white">{label}</h4>
                    <p className="text-sm text-gray-300 mt-2">Type: {details.type}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pin Connections */}
            {analysisResult.pin_connections?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Pin Connections</h3>
                <ul className="list-disc pl-6 text-sm text-gray-300 space-y-1">
                  {analysisResult.pin_connections.map((conn, idx) => (
                    <li key={idx}>
                      From <span className="text-green-400">{conn.from}</span> to{' '}
                      <span className="text-green-400">{conn.to}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Wire Count */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">Wire Count</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">Total Circuit Connections</p>
                  <p className="text-2xl text-green-300">
                    {analysisResult.wire_count?.total_circuit_connections ?? '—'}
                  </p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">Total Power Connections</p>
                  <p className="text-2xl text-green-300">
                    {analysisResult.wire_count?.total_power_connections ?? '—'}
                  </p>
                </div>
                <div className="bg-zinc-800 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-400 mb-1">Overall Total</p>
                  <p className="text-2xl text-green-400">
                    {analysisResult.wire_count?.overall_total ?? '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Assumptions */}
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">Assumptions</h3>
              <ul className="list-disc pl-6 text-sm text-gray-300 space-y-1">
                {analysisResult.assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* ⚠️ Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-md text-sm mt-4"
            >
              ⚠️ This analysis is generated by AI and may contain inaccuracies. Please verify the results with your professor or a subject expert.
            </motion.div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </section>
  );
};

export default ToolSection;
