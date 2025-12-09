import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiCalendar, FiUser, FiEye } from 'react-icons/fi';
import './BlogPage.css';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  is_featured: boolean;
  views_count: number;
  published_at: string;
  category_name: string;
  first_name: string;
  last_name: string;
}

const BlogPage = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/blog/posts');
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const featuredPost = posts.find(p => p.is_featured);
  const regularPosts = posts.filter(p => !p.is_featured);

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <div className="container">
          <h1 className="blog-title">{t('nav.blog')}</h1>
          <p className="blog-subtitle">News, stories, and updates from Beer8</p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="loading-container">
            <div className="loading"></div>
            <p>{t('common.loading')}</p>
          </div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="featured-post card">
                <div className="featured-image">
                  <img 
                    src={featuredPost.featured_image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200'} 
                    alt={featuredPost.title} 
                  />
                  <span className="featured-badge">Featured</span>
                </div>
                <div className="featured-content">
                  <span className="post-category">{featuredPost.category_name}</span>
                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.excerpt}</p>
                  <div className="post-meta">
                    <span><FiUser size={16} /> {featuredPost.first_name} {featuredPost.last_name}</span>
                    <span><FiCalendar size={16} /> {formatDate(featuredPost.published_at)}</span>
                    <span><FiEye size={16} /> {featuredPost.views_count} views</span>
                  </div>
                  <button className="btn btn-primary">Read More</button>
                </div>
              </div>
            )}

            {/* Regular Posts Grid */}
            <div className="posts-grid">
              {regularPosts.map((post) => (
                <div key={post.id} className="post-card card">
                  <div className="post-image">
                    <img 
                      src={post.featured_image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'} 
                      alt={post.title} 
                    />
                  </div>
                  <div className="post-content">
                    <span className="post-category">{post.category_name}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="post-meta">
                      <span><FiCalendar size={14} /> {formatDate(post.published_at)}</span>
                      <span><FiEye size={14} /> {post.views_count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {posts.length === 0 && !loading && (
              <div className="no-posts">
                <p>No blog posts available yet. Check back soon!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
