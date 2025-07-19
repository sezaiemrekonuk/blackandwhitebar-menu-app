import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signOut } from 'firebase/auth';
import { db, storage, auth } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [menuItems, setMenuItems] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'messages'

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null,
    imageUrl: ''
  });

  useEffect(() => {
    fetchMenuItems();
    fetchContactMessages();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const q = query(collection(db, 'menuItems'), orderBy(sortBy));
      const querySnapshot = await getDocs(q);
      const items = [];
      const cats = new Set();
      
      querySnapshot.forEach((doc) => {
        const item = { id: doc.id, ...doc.data() };
        items.push(item);
        cats.add(item.category);
      });
      
      setMenuItems(items);
      setCategories(Array.from(cats));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    try {
      const q = query(collection(db, 'contactMessages'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const messages = [];
      
      querySnapshot.forEach((doc) => {
        const message = { id: doc.id, ...doc.data() };
        messages.push(message);
      });
      
      setContactMessages(messages);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return '';
    
    setUploading(true);
    try {
      const storageRef = ref(storage, `menu-images/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;
      
      if (formData.image) {
        imageUrl = await handleImageUpload(formData.image);
      }

      const itemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: imageUrl,
        createdAt: new Date()
      };

      if (editingItem) {
        await updateDoc(doc(db, 'menuItems', editingItem.id), itemData);
      } else {
        await addDoc(collection(db, 'menuItems'), itemData);
      }

      setFormData({ name: '', description: '', price: '', category: '', image: null, imageUrl: '' });
      setEditingItem(null);
      setShowForm(false);
      fetchMenuItems();
    } catch (error) {
      console.error('Error saving menu item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: null,
      imageUrl: item.image
    });
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
      try {
        // Delete image from storage if exists
        if (item.image) {
          const imageRef = ref(storage, item.image);
          await deleteObject(imageRef);
        }
        
        await deleteDoc(doc(db, 'menuItems', item.id));
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'contactMessages', messageId));
        fetchContactMessages();
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const filteredItems = menuItems.filter(item => 
    filterCategory ? item.category === filterCategory : true
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="text-accent text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Header */}
      <header className="bg-gray-800 p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-heading text-accent">Black&White Bar Admin</h1>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Web Sitesine Git
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'menu' 
                ? 'bg-accent text-primary' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            Menü Yönetimi
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'messages' 
                ? 'bg-accent text-primary' 
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            İletişim Mesajları ({contactMessages.length})
          </button>
        </div>

        {/* Menu Management Tab */}
        {activeTab === 'menu' && (
          <>
            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setFormData({ name: '', description: '', price: '', category: '', image: null, imageUrl: '' });
                  setShowForm(true);
                }}
                className="px-6 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90"
              >
                + Yeni Menü Öğesi
              </button>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-accent"
              >
                <option value="name">İsme Göre Sırala</option>
                <option value="price">Fiyata Göre Sırala</option>
                <option value="category">Kategoriye Göre Sırala</option>
              </select>
            </div>

            {/* Menu Items Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-xl shadow-xl overflow-hidden"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={item.image || '/placeholder-food.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className="text-accent font-bold text-lg">₺{item.price}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                        {item.category}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {sortedItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Henüz menü öğesi bulunmuyor.</p>
              </div>
            )}
          </>
        )}

        {/* Contact Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {contactMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 p-6 rounded-xl shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{message.name}</h3>
                    <p className="text-accent">{message.email}</p>
                    <p className="text-gray-400 text-sm">
                      {message.timestamp?.toDate?.()?.toLocaleString('tr-TR') || 'Tarih bilgisi yok'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      message.status === 'new' 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-green-500/20 text-green-300'
                    }`}>
                      {message.status === 'new' ? 'Yeni' : 'Okundu'}
                    </span>
                    <button
                      onClick={() => handleDeleteMessage(message.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-gray-300">{message.message}</p>
                </div>
              </motion.div>
            ))}

            {contactMessages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Henüz mesaj bulunmuyor.</p>
              </div>
            )}
          </div>
        )}

        {/* Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-heading mb-6">
                  {editingItem ? 'Menü Öğesini Düzenle' : 'Yeni Menü Öğesi'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">İsim</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Kategori</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Açıklama</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      rows="3"
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Fiyat (₺)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Fotoğraf</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
                      className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-accent"
                    />
                    {formData.imageUrl && (
                      <div className="mt-2">
                        <img src={formData.imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className="flex-1 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent/90 disabled:opacity-50"
                    >
                      {loading || uploading ? 'Kaydediliyor...' : (editingItem ? 'Güncelle' : 'Kaydet')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 