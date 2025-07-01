'use client';

import Image from 'next/image';
import React, { useState } from 'react';

const ToolSection = () => {
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
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
        const fileInput = document.getElementById('fileInput');
        fileInput?.click();
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
            formData.append("image", image); // ✅ send the raw file

            const response = await fetch('/api/circuit-analyzer', {
                method: 'POST',
                body: formData, // ✅ auto sets Content-Type to multipart/form-data
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Analysis failed');
            setAnalysisResult(data);
        } catch (err: any) {
            setError(err.message || 'Unexpected error');
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
                    className="relative w-full border-2 border-dashed border-gray-500 rounded-xl px-24 py-10 md:p-10 flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-sm cursor-pointer transition-all hover:border-white shadow-lg hover:shadow-cyan-400/20"
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
                            <p className="text-lg md:text-xl md:max-w-md text-gray-300 font-medium">
                                Drag & Drop your image here
                            </p>
                            <p className="text-sm text-gray-500">or click to select (PNG, JPG, WebP)</p>
                        </div>
                    ) : (
                        <div className="relative w-full">
                            <Image
                                src={previewUrl}
                                alt="Uploaded Preview"
                                className="w-full max-h-96 object-contain rounded-lg shadow-md"
                            />
                            {/* ✖️ Remove Button */}
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
                {image && (
                    <button
                        onClick={handleAnalyzeImage}
                        className="bg-gray-100 hover:bg-gray-400 cursor-pointer text-black px-4 transition-all duration-500 py-2 rounded-md"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Circuit'}
                    </button>
                )}

                {/* Output Display */}
                {analysisResult && (
                    <div className="w-full bg-zinc-900 rounded-xl p-6 mt-6 shadow-lg border border-cyan-800 text-white space-y-6">

                        {/* 🔩 Component Summary - Bento Style Cards */}
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Components</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {(analysisResult.component_summary || []).map((comp: any, idx: number) => {
                                    const type = comp?.type || (typeof comp === "string" ? comp : "Unknown");
                                    const count = comp?.count || "x";

                                    return (
                                        <div
                                            key={idx}
                                            className="bg-zinc-800 rounded-xl p-4 shadow shadow-cyan-800/20 flex flex-col justify-between"
                                        >
                                            <h4 className="text-lg font-bold text-white">{type}</h4>
                                            <div className="text-sm text-green-300 mt-2">
                                                Count: <span className="font-semibold">{count}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>



                        {/* 📦 IC Assignments - Bento Cards */}
                        <div className="w-full mt-8">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4">IC Assignments</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {analysisResult.ic_assignment &&
                                    Object.entries(analysisResult.ic_assignment).map(
                                        ([icLabel, details]: [string, any], idx: number) => (
                                            <div
                                                key={idx}
                                                className="bg-zinc-800 rounded-xl p-4 shadow shadow-cyan-800/20 flex flex-col justify-between"
                                            >
                                                <div className="text-sm text-gray-400 mb-1">Label</div>
                                                <h4 className="text-lg font-bold text-white">{icLabel}</h4>

                                                <div className="mt-2 text-sm text-gray-300">
                                                    <span className=" text-green-300">Type:</span>{' '}
                                                    {details?.type || 'N/A'}
                                                </div>

                                               
                                            </div>
                                        )
                                    )}
                            </div>
                        </div>


                        {/* 🔗 Pin Connections - Bento Cards */}
                        <div className="w-full mt-8">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Pin Connections</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {Array.isArray(analysisResult.pin_connections) &&
                                    analysisResult.pin_connections.map((conn: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="bg-zinc-800 rounded-xl p-4 shadow shadow-cyan-800/20 flex flex-col justify-between"
                                        >
                                            <div className="text-sm text-gray-400">From</div>
                                            <p className="text-md text-green-300">{conn.from}</p>

                                            <div className="text-sm text-gray-400 mt-2">To</div>
                                            <p className="text-md text-green-300">{conn.to}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>


                        {/* 🧵 Wire Count - Bento Cards */}
                        <div className="w-full mt-8">
                            <h3 className="text-lg font-semibold text-cyan-400 mb-4">Wire Count</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-zinc-800 rounded-xl p-4 shadow shadow-cyan-800/20 text-center">
                                    <p className="text-sm text-gray-400 mb-1">Total Circuit Connections</p>
                                    <p className="text-2xl text-green-300">{analysisResult.wire_count?.total_circuit_connections}</p>
                                </div>
                                <div className="bg-zinc-800 rounded-xl p-4 shadow shadow-cyan-800/20 text-center">
                                    <p className="text-sm text-gray-400 mb-1">Total Power Connections</p>
                                    <p className="text-2xl text-green-300">{analysisResult.wire_count?.total_power_connections}</p>
                                </div>
                                <div className="bg-zinc-800 rounded-xl p-4 shadow shadow-green-800/20 text-center">
                                    <p className="text-sm text-gray-400 mb-1">Overall Total</p>
                                    <p className="text-2xl text-green-400">{analysisResult.wire_count?.overall_total}</p>
                                </div>
                            </div>
                        </div>


                        <div>
                            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Assumptions</h3>
                            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-300">
                                {analysisResult.assumptions?.map((item: any, idx: number) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}



                {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        </section>
    );
};

export default ToolSection;
