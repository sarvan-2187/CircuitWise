'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Define all types

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

// Declare global ImageCapture to avoid TS errors
declare global {
  interface Window {
    ImageCapture: typeof ImageCapture;
  }
}

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

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileSelect = () => document.getElementById('fileInput')?.click();

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

  const handleCaptureImage = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const track = mediaStream.getVideoTracks()[0];
      const imageCapture = new (window as typeof window & { ImageCapture: typeof ImageCapture }).ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      setImage(new File([blob], 'captured-image.jpg', { type: 'image/jpeg' }));
      setPreviewUrl(URL.createObjectURL(blob));
      track.stop();
    } catch {
      setError('Camera capture failed');
    }
  };

  return (
    <section id="tool" className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="flex flex-col items-center w-full max-w-2xl gap-8">

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
            Drop or capture your circuit. Analyze components, connections, and wires instantly.
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-4">
          <motion.button
            onClick={triggerFileSelect}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upload Image
          </motion.button>
          <motion.button
            onClick={handleCaptureImage}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Capture Image
          </motion.button>
        </div>

        <input
          type="file"
          accept="image/*"
          id="fileInput"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {previewUrl && (
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
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition"
            >✖</button>
            <p className="text-sm text-gray-400 mt-2 text-center break-all">{image?.name}</p>
          </motion.div>
        )}

        {image && (
          <motion.button
            onClick={handleAnalyzeImage}
            className="bg-gray-100 hover:bg-gray-400 text-black px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Analyze Circuit'}
          </motion.button>
        )}

        {analysisResult && (
          <motion.div
            className="w-full bg-zinc-900 rounded-xl p-6 mt-6 text-white space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">🔧 Components</h3>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {analysisResult.component_summary.map((comp, idx) => (
                  <li key={idx}>{comp.type} — Count: {comp.count}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">🧠 IC Assignments</h3>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {Object.entries(analysisResult.ic_assignment).map(([label, details], idx) => (
                  <li key={idx}>{label} — {details.type}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">🔌 Pin Connections</h3>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {analysisResult.pin_connections.map((conn, idx) => (
                  <li key={idx}>{conn.from} → {conn.to}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">📈 Wire Count</h3>
              <ul className="list-disc list-inside text-sm text-gray-300">
                <li>Total Circuit: {analysisResult.wire_count.total_circuit_connections}</li>
                <li>Power Connections: {analysisResult.wire_count.total_power_connections}</li>
                <li>Overall Total: {analysisResult.wire_count.overall_total}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-400">📌 Assumptions</h3>
              <ul className="list-disc list-inside text-sm text-gray-300">
                {analysisResult.assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-yellow-300">
              ⚠️ This is an AI-generated analysis. Please verify the result for accuracy.
            </p>
          </motion.div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </section>
  );
};

export default ToolSection;
