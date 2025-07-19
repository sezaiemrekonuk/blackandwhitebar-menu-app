import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', msg: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Save to Firestore
      await addDoc(collection(db, 'contactMessages'), {
        name: form.name,
        email: form.email,
        message: form.msg,
        timestamp: serverTimestamp(),
        status: 'new'
      });

      // Reset form and show success
      setForm({ name: '', email: '', msg: '' });
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-primary/80">
      <h2 className="text-4xl font-heading text-center mb-8">İletişime Geçin</h2>
      
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-6 bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-center"
        >
          Teşekkürler, {form.name}! Mesajınız başarıyla gönderildi.
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-6 bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center"
        >
          {error}
        </motion.div>
      )}

      <motion.form 
        onSubmit={submit} 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 1 }} 
        className="max-w-md mx-auto space-y-6"
      >
        <input 
          name="name" 
          value={form.name} 
          onChange={handle} 
          required 
          placeholder="Ad" 
          disabled={loading}
          className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent disabled:opacity-50" 
        />
        <input 
          name="email" 
          type="email" 
          value={form.email} 
          onChange={handle} 
          required 
          placeholder="E-posta" 
          disabled={loading}
          className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent disabled:opacity-50" 
        />
        <textarea 
          name="msg" 
          value={form.msg} 
          onChange={handle} 
          required 
          rows="5" 
          placeholder="Mesaj" 
          disabled={loading}
          className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent disabled:opacity-50"
        ></textarea>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          transition={{ type: 'spring', stiffness: 300 }} 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-accent text-primary font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Gönderiliyor...' : 'Gönder'}
        </motion.button>
      </motion.form>
    </section>
  );
}