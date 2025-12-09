import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';
import './GalleryPage.css';

// Placeholder gallery data - in production this would come from API
const galleryImages = [
  { id: 1, category: 'interior', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', title: 'Main Hall' },
  { id: 2, category: 'food', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', title: 'Wood Fired Pizza' },
  { id: 3, category: 'interior', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', title: 'Bar Area' },
  { id: 4, category: 'food', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', title: 'Gourmet Burger' },
  { id: 5, category: 'events', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', title: 'Live Music Night' },
  { id: 6, category: 'food', url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800', title: 'Craft Beer Selection' },
  { id: 7, category: 'interior', url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', title: 'Terrace View' },
  { id: 8, category: 'food', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800', title: 'Fresh Salad' },
  { id: 9, category: 'team', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', title: 'Our Chef' },
  { id: 10, category: 'food', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', title: 'Signature Dishes' },
  { id: 11, category: 'events', url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', title: 'Birthday Party' },
  { id: 12, category: 'interior', url: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800', title: 'Cozy Corner' },
];

const GalleryPage = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<number | null>(null);

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'interior', label: 'Interior' },
    { key: 'food', label: 'Food' },
    { key: 'events', label: 'Events' },
    { key: 'team', label: 'Team' },
  ];

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (id: number) => {
    setLightboxImage(id);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const nextImage = () => {
    if (lightboxImage === null) return;
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[nextIndex].id);
  };

  const prevImage = () => {
    if (lightboxImage === null) return;
    const currentIndex = filteredImages.findIndex(img => img.id === lightboxImage);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxImage(filteredImages[prevIndex].id);
  };

  const currentImage = filteredImages.find(img => img.id === lightboxImage);

  return (
    <div className="gallery-page">
      <div className="gallery-hero">
        <div className="container">
          <h1 className="gallery-title">{t('nav.gallery')}</h1>
          <p className="gallery-subtitle">Explore our restaurant through photos</p>
        </div>
      </div>

      <div className="container">
        {/* Category Filter */}
        <div className="gallery-filters">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`filter-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => openLightbox(image.id)}
            >
              <img src={image.url} alt={image.title} loading="lazy" />
              <div className="gallery-item-overlay">
                <h3>{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && currentImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <FiX size={32} />
          </button>
          <button className="lightbox-prev" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            ‹
          </button>
          <button className="lightbox-next" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            ›
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={currentImage.url} alt={currentImage.title} />
            <h3>{currentImage.title}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
