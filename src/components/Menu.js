import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

// Function to extract size from item name and return a sortable value
const getSizeValue = (name) => {
  const lowerName = name.toLowerCase();
  
  // Define size order (smaller numbers = smaller sizes)
  const sizeOrder = {
    'small': 1,
    's': 1,
    'medium': 2,
    'm': 2,
    'large': 3,
    'l': 3,
    'x-large': 4,
    'xl': 4,
    'xlarge': 4,
    '2x-large': 5,
    '2xl': 5,
    '2xlarge': 5,
    'xx-large': 5,
    'xxl': 5,
    'xxlarge': 5,
    '3x-large': 6,
    '3xl': 6,
    '3xlarge': 6,
    'xxx-large': 6,
    'xxxl': 6,
    'xxxlarge': 6,
    '4x-large': 7,
    '4xl': 7,
    '4xlarge': 7,
    'xxxx-large': 7,
    'xxxxl': 7,
    'xxxxlarge': 7
  };

  // Check for size indicators in the name
  for (const [size, value] of Object.entries(sizeOrder)) {
    if (lowerName.includes(size)) {
      return value;
    }
  }
  
  // If no size found, return 0 (will be sorted alphabetically)
  return 0;
};

// Function to sort items by size first, then alphabetically
const sortItemsBySize = (a, b) => {
  const sizeA = getSizeValue(a.name);
  const sizeB = getSizeValue(b.name);
  
  // If both items have sizes, sort by size
  if (sizeA > 0 && sizeB > 0) {
    return sizeA - sizeB;
  }
  
  // If only one item has size, put the one with size first
  if (sizeA > 0 && sizeB === 0) {
    return -1;
  }
  if (sizeA === 0 && sizeB > 0) {
    return 1;
  }
  
  // If neither has size, sort alphabetically
  return a.name.localeCompare(b.name);
};

export default function Menu() {
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get('table') < 100 ? searchParams.get('table') : null;
  const [categoryFilter, setCategoryFilter] = useState('');
  const [openCategory, setOpenCategory] = useState(null);

  // Happy Hour window: 09:00 to 19:00 Istanbul time (UTC+3)
  function isHappyHourNow() {
    // Get current time in UTC+3 (Istanbul)
    const now = new Date();
    // Convert to UTC+3
    const utc3 = new Date(now.getTime() + (3 * 60 - now.getTimezoneOffset()) * 60000);
    const hour = utc3.getHours();
    return hour >= 9 && hour < 19;
  }
  const showHH = isHappyHourNow();

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

      // Sort them to be like: Fıçı Bira, Şişe, Shot, Import, Atıştırmalık, others
      menuArray.sort((a, b) => {
        const order = ['Fıçı Bira', 'Şişe', 'Atıştırmalık', 'Shot', 'Import', 'Alkolsüz'];
        return order.indexOf(a.category) - order.indexOf(b.category);
      });

      setMenuData(menuArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      setLoading(false);
    }
  };

  // Get all categories for filter dropdown
  const allCategories = menuData.map(cat => cat.category);

  // Filtered menu data
  const filteredMenuData = categoryFilter
    ? menuData.filter(cat => cat.category === categoryFilter)
    : menuData;

  if (loading) {
    return (
      <section id="menu" className="py-10 sm:py-20 px-2 sm:px-4">
        <div className="text-center">
          <div className="text-accent text-lg sm:text-xl">Menü yükleniyor...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="menu" className="py-10 sm:py-20 px-2 sm:px-4">
      {/* Table Information Banner */}
      {tableNumber && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md sm:max-w-4xl mx-auto mb-6 sm:mb-8 bg-accent/20 border border-accent rounded-xl p-4 sm:p-6 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">🍽️</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-heading text-accent">Masa {tableNumber}</h3>
              <p className="text-gray-300 text-xs sm:text-sm">Bu masadan menüyü görüntülüyorsunuz</p>
            </div>
          </div>
        </motion.div>
      )}

      <h2 className="text-2xl sm:text-4xl font-heading text-center mb-8 sm:mb-12">Menümüz</h2>

      {/* Category Filter Bar */}
      <div className="max-w-md sm:max-w-4xl mx-auto mb-6 flex flex-wrap gap-2 justify-center">
        <button
          className={`px-3 py-1 rounded-full border text-xs sm:text-base ${categoryFilter === '' ? 'bg-accent text-primary border-accent' : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'}`}
          onClick={() => { setCategoryFilter(''); setOpenCategory(null); }}
        >
          Tümü
        </button>
        {allCategories.map(cat => (
          <button
            key={cat}
            className={`px-3 py-1 rounded-full border text-xs sm:text-base ${categoryFilter === cat ? 'bg-accent text-primary border-accent' : 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600'}`}
            onClick={() => { setCategoryFilter(cat); setOpenCategory(cat); }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-md sm:max-w-4xl mx-auto space-y-4 sm:space-y-8">
        {filteredMenuData.map((cat, i) => (
          <div key={i}>
            {/* Accordion Header */}
            <button
              className="w-full flex justify-between items-center py-3 px-4 bg-primary/70 rounded-lg border-accent/50 border-b-2 shadow font-semibold text-lg sm:text-2xl mb-2 focus:outline-none"
              onClick={() => setOpenCategory(openCategory === cat.category ? null : cat.category)}
              aria-expanded={openCategory === cat.category}
              aria-controls={`menu-cat-${i}`}
            >
              <span>{cat.category}</span>
              <svg
                className={`w-5 h-5 ml-2 transition-transform ${openCategory === cat.category ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Accordion Content */}
            <motion.div
              id={`menu-cat-${i}`}
              initial={false}
              animate={{ height: openCategory === cat.category ? 'auto' : 0, opacity: openCategory === cat.category ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              {openCategory === cat.category && (
                <div className="space-y-4 sm:space-y-6 mt-2">
                  {cat.items.sort(sortItemsBySize)
                    .filter(item => !(item.name && item.name.includes('H.H') && !showHH))
                    .map((item, j) => (
                      <motion.div 
                        key={j} 
                        initial="hidden" 
                        whileInView="visible" 
                        variants={fadeIn} 
                        transition={{ duration: 0.5 }} 
                        className="bg-primary/80 p-3  sm:p-4 rounded-xl hover:border-accent/70 transition-colors border border-accent/30 shadow-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                      >
                        <div className="flex-shrink-0">
                          <div className="overflow-hidden rounded-lg">
                            <img src={item.image || '/placeholder-food.jpg'} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 text-center sm:text-left">
                          <h4 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{item.name}</h4>
                          <p className="text-gray-300 text-xs sm:text-sm">{item.description}</p>
                        </div>
                        <div className="flex-shrink-0 mt-2 sm:mt-0">
                          <span className="text-accent font-bold text-base sm:text-2xl">₺{item.price}</span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
      
      {filteredMenuData.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-400 text-base sm:text-lg">Henüz menü öğesi bulunmuyor.</p>
        </div>
      )}

      {/* Table-specific footer */}
      {tableNumber && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md sm:max-w-4xl mx-auto mt-8 sm:mt-12 text-center"
        >
          <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6">
            <p className="text-gray-300 mb-1 sm:mb-2 text-xs sm:text-base">
              Masa {tableNumber} için sipariş vermek istiyorsanız
            </p>
            <p className="text-accent font-semibold text-xs sm:text-base">
              Garsonu çağırın veya masanızdaki QR kodu kullanın
            </p>
          </div>
        </motion.div>
      )}
    </section>
  );
}