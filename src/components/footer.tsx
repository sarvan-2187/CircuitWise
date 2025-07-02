'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Footer = () => {
  const teamMembers = [
    {
      name: 'NAGARAMPALLI SARVAN KUMAR',
      image: 'sarvan.png',
      linkedin: 'https://www.linkedin.com/in/nagarampalli-sarvan-kumar/',
    },
    {
      name: 'M DHEERAJ VAMSI KRISHNA',
      image: 'dheeraj.png',
      linkedin:
        'https://www.linkedin.com/in/medarametla-dheeraj-vamsi-krishna-981b62341',
    },
    {
      name: 'MUSALI REDDY MANISH REDDY',
      image: 'manish.png',
      linkedin:
        'https://www.linkedin.com/in/reddy-manish-291742321',
    },
  ];

  return (
    <footer className="py-10 px-4 border-t border-white/10">
      <motion.div
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Left: Text & Tagline */}
        <motion.div
          className="text-center md:text-left space-y-2"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Built by Team - Group 3
          </h2>
          <p className="text-sm text-gray-400">
            Proudly engineered for CircuitWise. Made with 💡 & logic gates.
          </p>
        </motion.div>

        {/* Right: Members */}
        <motion.div
          className="flex flex-col md:flex-row gap-6 items-center justify-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-white/10 border border-white/20 overflow-hidden shadow-md hover:shadow-cyan-500/30 transition"
                whileHover={{ rotate: 3 }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-300 font-medium w-28 break-words hover:text-cyan-400 transition-all duration-200"
              >
                {member.name}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom Line */}
      <motion.div
        className="mt-8 text-center text-xs text-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        © {new Date().getFullYear()} CircuitWise | All Rights Reserved
      </motion.div>
    </footer>
  );
};

export default Footer;
