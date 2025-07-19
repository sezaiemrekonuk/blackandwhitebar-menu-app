import React from 'react';
import { motion } from 'framer-motion';

export default function MapSection() {
  return (
    <motion.section id="location" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} className="w-full h-96">
      <iframe title="location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0197!2d28.36308!3d36.55528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cde750d4b8c8e7%3A0x7a8fd7a0b4d3c4e8!2sMuğla!5e0!3m2!1sen!2str!4v1627844668693!5m2!1sen!2str" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
    </motion.section>
  );
}