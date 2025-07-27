import React from 'react';
export default function Footer() {
  return (
    <footer className="py-6 md:py-8 text-center text-gray-500 text-xs md:text-sm px-2 md:px-0">
      <div className="mb-2">
        © {new Date().getFullYear()} Black&White Bar — Muğla, Türkiye
      </div>
      <div className="text-xs">
        Şeyh, Koca Mustafa Efendi Cd., 48000 Menteşe/Muğla
      </div>
    </footer>
  );
}
