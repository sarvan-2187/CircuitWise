'use client';

import React from 'react';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className=" py-10 px-4 border-t border-white/10">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left: Text & Tagline */}
                <div className="text-center md:text-left space-y-2">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                        Built by Team - Group 3
                    </h2>
                    <p className="text-sm text-gray-400">
                        Proudly engineered for CircuitWise. Made with 💡 & logic gates.
                    </p>
                </div>

                {/* Right: Members */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
                    {[
                        {
                            name: 'NAGARAMPALLI SARVAN KUMAR',
                            image: 'sarvan.png',
                            linkedin: 'https://www.linkedin.com/in/nagarampalli-sarvan-kumar/',
                        },
                        {
                            name: 'M DHEERAJ VAMSI KRISHNA',
                            image: 'dheeraj.png',
                            linkedin: 'https://www.linkedin.com/in/medarametla-dheeraj-vamsi-krishna-981b62341?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                        },
                        {
                            name: 'MUSALI REDDY MANISH REDDY',
                            image: 'manish.png',
                            linkedin: 'https://www.linkedin.com/in/reddy-manish-291742321?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                        },
                    ].map((member, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center gap-2"
                        >
                            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 overflow-hidden">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-gray-300 font-medium w-28 break-words hover:text-cyan-400 transition-all duration-200"
                            >
                                {member.name}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Line */}
            <div className="mt-8 text-center text-xs text-gray-100">
                © {new Date().getFullYear()} CircuitWise | All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;
