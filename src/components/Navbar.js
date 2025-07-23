import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="fixed w-full bg-primary/50 backdrop-blur z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-2 sm:p-4">
        <Link to='/' className="cursor-pointer">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Black&White" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
            <div className="text-lg sm:text-2xl font-heading">Black&White</div>
          </div>
        </Link>
        {/* Mobile menu button */}
        <button
          className="sm:hidden p-2 focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menüyü Aç/Kapat"
        >
          <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Desktop menu */}
        <div className="hidden sm:block space-x-4 md:space-x-6">
          {[
            { id: 'home', label: 'Ana Sayfa' },
            { id: 'menu', label: 'Menü' },
            { id: 'location', label: 'Konum' },
            { id: 'contact', label: 'İletişim' }
          ].map((sec) => {
            switch (sec.id) {
              case 'home':
                return  <Link key={sec.id} to='/' className="cursor-pointer hover:text-accent">
                  {sec.label}
                </Link>
              case 'menu':
                return <Link key={sec.id} to='/menu' className="cursor-pointer hover:text-accent">
                  {sec.label}
                </Link>
              default:
                return <ScrollLink key={sec.id} to={sec.id} smooth duration={500} className="cursor-pointer hover:text-accent">
                  {sec.label}
                </ScrollLink>
              }
          })}
          {auth.currentUser && (
            <Link to="/admin" className="text-accent hover:text-accent/80 font-medium">
              Admin
            </Link>
          )}
        </div>
        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-primary/95 shadow-lg flex flex-col items-center py-4 gap-2 sm:hidden animate-fade-in">
            {[
              { id: 'home', label: 'Ana Sayfa' },
              { id: 'menu', label: 'Menü' },
              { id: 'location', label: 'Konum' },
              { id: 'contact', label: 'İletişim' }
            ].map((sec) => {
              switch (sec.id) {
                case 'home':
                  return  <Link key={sec.id} to='/' className="cursor-pointer hover:text-accent text-lg" onClick={() => setMenuOpen(false)}>
                    {sec.label}
                  </Link>
                case 'menu':
                  return <Link key={sec.id} to='/menu' className="cursor-pointer hover:text-accent text-lg" onClick={() => setMenuOpen(false)}>
                    {sec.label}
                  </Link>
                default:
                  return <ScrollLink key={sec.id} to={sec.id} smooth duration={500} className="cursor-pointer hover:text-accent text-lg" onClick={() => setMenuOpen(false)}>
                    {sec.label}
                  </ScrollLink>
                }
            })}
            {auth.currentUser && (
              <Link to="/admin" className="text-accent hover:text-accent/80 font-medium text-lg" onClick={() => setMenuOpen(false)}>
                Admin
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
