import React from 'react';
import { motion } from 'framer-motion';

export default function InstagramEmbed({ postUrl, title = "Instagram Post" }) {
  // Extract post ID from URL if needed
  const getEmbedUrl = (url) => {
    // Convert regular Instagram URL to embed URL
    if (url.includes('instagram.com/p/')) {
      return url + 'embed/';
    }
    if (url.includes('instagram.com/reel/')) {
      return url + 'embed/';
    }
    return url;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="bg-primary/80 rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-center">{title}</h3>
        </div>
        <div className="relative">
          <iframe
            src={getEmbedUrl(postUrl)}
            title={title}
            className="w-full h-96"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            allowFullScreen={true}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Component to embed Black&White Muğla Instagram profile
export function BlackWhiteInstagramProfile() {
  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl font-heading text-center mb-12">Instagram'da Bizi Takip Edin</h2>
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-primary/80 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-6 border-b border-gray-600">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                    <img src="/logo.jpg" alt="Black&White" className="w-10 h-10 rounded-full" />
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold">@blackwhitemugla</h3>
                <p className="text-gray-300 text-sm">Black&White Bar Muğla</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <iframe
              src="https://www.instagram.com/blackwhitemugla/embed"
              title="Black&White Muğla Instagram"
              className="w-full h-[600px]"
              frameBorder="0"
              scrolling="no"
              allowTransparency={true}
              allowFullScreen={true}
            />
          </div>
          <div className="p-4 bg-gray-800/50 text-center">
            <a 
              href="https://www.instagram.com/blackwhitemugla/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram'da Görüntüle
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Alternative component for multiple Instagram posts
export function InstagramFeed({ posts = [] }) {
  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl font-heading text-center mb-12">Instagram</h2>
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <InstagramEmbed 
              key={index}
              postUrl={post.url}
              title={post.title || `Post ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Component for Instagram stories highlight
export function InstagramStories({ stories = [] }) {
  return (
    <section className="py-20 px-4">
      <h2 className="text-4xl font-heading text-center mb-12">Instagram Hikayeleri</h2>
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <div className="w-64 h-96 bg-primary/80 rounded-xl shadow-xl overflow-hidden">
                <div className="p-3 border-b border-gray-600">
                  <h3 className="text-sm font-medium text-center truncate">{story.title}</h3>
                </div>
                <div className="relative h-80">
                  <iframe
                    src={story.url}
                    title={story.title}
                    className="w-full h-full"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency={true}
                    allowFullScreen={true}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 