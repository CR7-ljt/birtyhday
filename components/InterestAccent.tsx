'use client';

import { motion } from 'framer-motion';

/** 兴趣点缀：可从 BirthdayExperience 的 enableInterestAccent 开关移除。 */
export function InterestAccent({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`interest-accent ${className}`}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <svg viewBox="0 0 220 170" role="img" aria-label="Abstract celebration movement line illustration">
        <path d="M28 140c22-48 42-78 70-93 22-12 39 1 33 24-5 20-31 31-43 48-10 15-4 35 20 39 34 6 78-15 87-51" />
        <path d="M60 80l19 13m-5-30l22 7m21-20l11 20m-17 21l24 8m-10 27l25-6" />
        <circle cx="154" cy="112" r="13" />
        <path d="M145 105l9 6 9-5m-8 20l-1-15" />
      </svg>
      <span>A MOMENT TO CELEBRATE</span>
    </motion.div>
  );
}
