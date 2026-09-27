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
      <svg viewBox="0 0 220 170" role="img" aria-label="Abstract football movement line illustration">
        <path d="M34 143c16-51 36-85 66-99 21-10 35 5 28 27-7 19-33 28-46 45-12 15-10 36 13 42 35 9 83-12 99-54" />
        <path d="M62 77l18 14m-4-29l21 8m22-20l10 21m-18 20l23 9m-9 27l24-7" />
        <circle cx="153" cy="112" r="14" />
        <path d="M143 104l10 6 9-5m-8 21l-1-16" />
      </svg>
      <span>CR7 · MY INSPIRATION</span>
    </motion.div>
  );
}
