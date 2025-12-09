import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiSearch, FiGrid, FiList } from 'react-icons/fi';
import './MenuPage.css';

interface Category {
  id: number;
  name_key: string;
  display_order: number;
  icon: string;
}

interface MenuItem {
  id: number;
  category_id: number;
  name_key: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_popular: boolean;
  preparation_time: number;
  calories: number;
}

const MenuPage = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    fetchMenuItems();
  }, [selectedCategory, searchTerm, sortBy, i18n.language]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/menu/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const params: any = {
        language: i18n.language,
        sortBy
      };
      
      if (selectedCategory) {
        params.categoryId = selectedCategory;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await axios.get('/api/menu/items', { params });
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories;

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <div className="container">
          <h1 className="menu-title">{t('menu.title')}</h1>
          <p className="menu-subtitle">Discover our selection of craft beers and delicious food</p>
        </div>
      </div>

      <div className="container">
        <div className="menu-controls">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder={t('menu.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="menu-filters">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">{t('menu.sortByName')}</option>
              <option value="price">{t('menu.sortByPrice')}</option>
              <option value="popular">{t('menu.sortByPopular')}</option>
            </select>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <FiGrid size={20} />
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <FiList size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="menu-layout">
          <aside className="menu-sidebar">
            <h3>{t('menu.filterByCategory')}</h3>
            <div className="category-list">
              <button
                className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                {t('menu.allCategories')}
              </button>
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {t(`categories.${category.name_key}`)}
                </button>
              ))}
            </div>
          </aside>

          <main className="menu-content">
            {loading ? (
              <div className="loading-container">
                <div className="loading"></div>
                <p>{t('common.loading')}</p>
              </div>
            ) : items.length === 0 ? (
              <div className="no-items">
                <p>No items found</p>
              </div>
            ) : (
              <div className={`menu-items ${viewMode}`}>
                {items.map((item) => (
                  <div key={item.id} className="menu-item card">
                    {item.image_url && (
                      <div className="item-image">
                        <img src={item.image_url || '/placeholder-food.jpg'} alt={item.name} />
                        {item.is_popular && (
                          <span className="popular-badge">Popular</span>
                        )}
                      </div>
                    )}
                    <div className="item-content">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-meta">
                        {item.preparation_time && (
                          <span className="meta-item">⏱ {item.preparation_time} min</span>
                        )}
                        {item.calories && (
                          <span className="meta-item">🔥 {item.calories} cal</span>
                        )}
                      </div>
                      <div className="item-footer">
                        <span className="item-price">{item.price} {t('common.currency')}</span>
                        <button className="btn btn-primary btn-sm">
                          {t('menu.addToCart')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
