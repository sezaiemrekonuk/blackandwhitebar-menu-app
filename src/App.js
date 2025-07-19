import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Menu from './components/Menu';
import MapSection from './components/MapSection';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPage from './components/AdminPage';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Route - Separate Layout */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* Main App Routes */}
        <Route path="/*" element={
          <div className="bg-primary text-white font-body">
            <Navbar />
            <Routes>
              <Route path='/' element={<Hero />} />
              <Route path="/menu" element={<Menu />} />
            </Routes>
            <MapSection />
            <Contact />
            <Footer />
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}