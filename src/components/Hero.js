import React from 'react';
import { motion } from 'framer-motion';
import { LinkButton } from './LinkButton';
import { BlackWhiteInstagramProfile } from './InstagramEmbed';

export default function Hero() {
  return (
    <>
      <section id="home" className="h-screen flex flex-col justify-center items-center bg-cover bg-center" style={{ backgroundImage: "url('/bwbar.jpg')" }}>
        <div className="bg-black/50 p-16 rounded-lg text-center backdrop-blur">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl font-heading mb-4">
            Black&White Bar
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="text-lg mb-6">
            Muğla'da samimi atmosfer ve el yapımı içecekler
          </motion.p>
          <LinkButton to="menu">Menüyü Görüntüle</LinkButton>
        </div>
      </section>
      <BlackWhiteInstagramProfile />
    </>
  );
}