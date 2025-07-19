import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Menu() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') < 100 ? searchParams.get('table') : null;

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const q = query(collection(db, 'menuItems'), orderBy('category'), orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      // Group items by category
      const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});

      // Convert to array format
      const menuArray = Object.keys(groupedItems).map(category => ({
        category,
        items: groupedItems[category]
      }));

      setMenuData(menuArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="menu" className="py-20 px-4">
        <div className="text-center">
          <div className="text-accent text-xl">Menü yükleniyor...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-20 px-4">
      {/* Table Information Banner */}
      {tableNumber && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-8 bg-accent/20 border border-accent rounded-xl p-6 text-center"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">🍽️</span>
            </div>
            <div>
              <h3 className="text-xl font-heading text-accent">Masa {tableNumber}</h3>
              <p className="text-gray-300 text-sm">Bu masadan menüyü görüntülüyorsunuz</p>
            </div>
          </div>
        </motion.div>
      )}

      <h2 className="text-4xl font-heading text-center mb-12">Menümüz</h2>
      <div className="max-w-4xl mx-auto space-y-16">
        {menuData.map((cat, i) => (
          <div key={i}>
            <motion.h3 initial="hidden" whileInView="visible" variants={fadeIn} className="text-3xl font-semibold mb-8">
              {cat.category}
            </motion.h3>
            <div className="space-y-6">
              {cat.items.map((item, j) => (
                <motion.div 
                  key={j} 
                  initial="hidden" 
                  whileHover={{ scale: 1.02 }} 
                  whileInView="visible" 
                  variants={fadeIn} 
                  transition={{ duration: 0.5 }} 
                  className="bg-primary/80 p-4 rounded-xl shadow-xl flex items-center gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="overflow-hidden rounded-lg">
                      <img src={item.image || '/placeholder-food.jpg'} alt={item.name} className="w-24 h-24 object-cover" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-semibold mb-2">{item.name}</h4>
                    <p className="text-gray-300 text-sm">{item.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-accent font-bold text-lg">₺{item.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {menuData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Henüz menü öğesi bulunmuyor.</p>
        </div>
      )}

      {/* Table-specific footer */}
      {tableNumber && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-12 text-center"
        >
          <div className="bg-gray-800/50 rounded-xl p-6">
            <p className="text-gray-300 mb-2">
              Masa {tableNumber} için sipariş vermek istiyorsanız
            </p>
            <p className="text-accent font-semibold">
              Garsonu çağırın veya masanızdaki QR kodu kullanın
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
}