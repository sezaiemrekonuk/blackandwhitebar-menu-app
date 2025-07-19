import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="fixed w-full bg-primary/50 backdrop-blur z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to='/' className="cursor-pointer">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Black&White" className="w-10 h-10 rounded-full" />
            <div className="text-2xl font-heading">Black&White</div>
          </div>
        </Link>
        <div className="space-x-6">
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
      </div>
    </nav>
  );
}
