'use client';

import React from 'react';
import Logo from '@/assets/chip.webp';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <section className="min-h-screen flex mt-20 items-center justify-center" id="home">
            <div className="flex flex-col items-center justify-center gap-6 px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Image
                        src={Logo}
                        width={150}
                        height={150}
                        alt="Logo"
                        className="size-25 md:size-50 animate-pulse drop-shadow-xl"
                    />
                </motion.div>

                <div className="flex flex-col items-center justify-center text-center space-y-4">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent tracking-wide">
                        Welcome to CircuitWise
                    </h1>
                    <p className="w-full md:max-w-2xl text-md text-gray-300 backdrop-blur-sm px-2 py-2 rounded-xl bg-white/5 border border-white/10 shadow-md">
                        CircuitWise is an intelligent AI tool that automates wire count, estimates circuit cost,
                        and provides detailed connection instructions - all from your digital circuit diagrams.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="flex flex-wrap justify-center gap-6 mt-6"
                >
                    <a href="#tool">
                        <button className="cursor-pointer bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-400 transition-all duration-300 shadow-lg">
                            Get Started
                        </button>
                    </a>
                    <button className="cursor-pointer bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-all duration-300 shadow-md">
                        View Demo
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
