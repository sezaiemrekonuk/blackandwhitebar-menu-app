import React from 'react';
export default function Footer() {
  return (
    <footer className="py-6 md:py-8 text-center text-gray-500 text-xs md:text-sm px-2 md:px-0">
      © {new Date().getFullYear()} Black&White Bar — Muğla, Türkiye
    </footer>
  );
}
