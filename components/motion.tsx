'use client';
import { motion } from 'framer-motion';

export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionArticle = motion.article;

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
