import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary relative px-2 sm:px-0">
      {/* Go to Website Link - Top Left */}
      <Link
        to="/"
        className="absolute top-4 sm:top-6 left-4 sm:left-6 text-accent hover:text-accent/80 transition-colors flex items-center gap-2 z-10 font-medium text-xs sm:text-base"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Web Sitesine Dön
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-4 sm:p-8 rounded-xl shadow-xl w-full max-w-xs sm:max-w-md"
      >
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-heading text-accent mb-2">Admin Girişi</h1>
          <p className="text-gray-300 text-xs sm:text-base">Black&White Bar Yönetim Paneli</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 sm:p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent text-white text-xs sm:text-base"
              placeholder="admin@blackwhitebar.com"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 sm:p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent text-white text-xs sm:text-base"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-2 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-base">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        {/* Help Text */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            Admin bilgileriniz yok mu? 
            <br />
            <span className="text-accent">Yöneticinizle iletişime geçin.</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
} 