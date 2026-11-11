import React from 'react';
import { motion } from 'framer-motion';

export function FadeInUp({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "", 
  distance = 30,
  once = false 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInScale({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  className = "", 
  once = false 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, amount: 0.15 }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  className = "", 
  staggerDelay = 0.1, 
  once = false 
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.15 }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.55, 
            ease: [0.21, 0.47, 0.32, 0.98] 
          } 
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

