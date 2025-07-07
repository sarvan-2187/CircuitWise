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

// Safer imageCapture type to avoid build errors on server
type SafeImageCapture = {
  new (track: MediaStreamTrack): {
    takePhoto: () => Promise<Blob>;
  };
};

declare global {
  interface Window {
    imageCapture: SafeImageCapture;
  }
}

const ToolSection = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const capture = new window.imageCapture(track);
      const blob = await capture.takePhoto();
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
          <pre className="w-full overflow-auto bg-black text-white text-xs p-4 rounded-xl">
            {JSON.stringify(analysisResult, null, 2)}
          </pre>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </section>
  );
};

export default ToolSection;
