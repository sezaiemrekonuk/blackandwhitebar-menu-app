import React from 'react';
import { motion } from 'framer-motion';

export default function MapSection() {
  return (
    <section id="location" className="py-12 px-2 sm:px-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="w-full"
      >
        {/* Address and Hours Section */}
        <div className="mb-8 text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl md:text-4xl font-heading mb-6"
          >
            Konum & Çalışma Saatleri
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
            {/* Address */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-black/20 backdrop-blur rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Adres</h3>
              <p className="text-lg leading-relaxed">
                Şeyh, Koca Mustafa Efendi Cd.,<br />
                48000 Menteşe/Muğla
              </p>
            </motion.div>

            {/* Working Hours */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-black/20 backdrop-blur rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-3 text-yellow-400">Çalışma Saatleri</h3>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between">
                  <span>Pazartesi - Cuma:</span>
                  <span>15:00 - 02:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Cumartesi:</span>
                  <span>15:00 - 02:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Pazar:</span>
                  <span>15:00 - 02:00</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5, duration: 0.8 }}
          className="w-full h-64 sm:h-96"
        >
          <iframe 
            title="location" 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3177.322968460498!2d28.365803600000003!3d37.2163073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14bf6d04fb1a909f%3A0xf279d71bf15f24b9!2sBlack%20%26%20White!5e0!3m2!1str!2str!4v1753642444518!5m2!1str!2str" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full" 
          />
        </motion.div>
      </motion.div>
    </section>
  );
}