"use client";

import { useState } from 'react';
import AdminRoute from '@/components/AdminRoute';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/context/ToastContext';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Plus, Trash2, X, Edit } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { Product, ProductCategory } from '@/data/products';
import styles from './page.module.css';

export default function AdminProducts() {
  const { products, loading } = useProducts();
  const { showToast } = useToast();
  const [animationParent] = useAutoAnimate<HTMLTableSectionElement>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'shoes' as ProductCategory,
    price: '',
    description: '',
    sizes: '',
    image: ''
  });

  const handleOpenModal = () => {
    setFormData({
      name: '', brand: '', category: 'shoes', price: '', description: '', sizes: '', image: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newRef = doc(collection(db, 'products'));
      const newProduct: Product = {
        id: newRef.id,
        name: formData.name,
        brand: formData.brand,
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description,
        image: formData.image,
        images: [formData.image],
        sizes: formData.sizes.split(',').map(s => s.trim()),
        rating: 5.0, // Default for new products
        reviews: 0,
        inStock: true,
        estimatedDelivery: '3-5 Business Days'
      };

      await setDoc(newRef, newProduct);
      showToast('Product added successfully!', 'success');
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to add product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteDoc(doc(db, 'products', id));
        showToast('Product deleted!', 'success');
      } catch (err) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  if (loading) return <AdminRoute><div className={styles.container}>Loading inventory...</div></AdminRoute>;

  return (
    <AdminRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Inventory</h1>
          <button className={styles.addBtn} onClick={handleOpenModal}>
            <Plus size={20} /> Add Product
          </button>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Sizes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody ref={animationParent}>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productCell}>
                      <img src={product.image} alt={product.name} className={styles.productImg} />
                      {product.name}
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.sizes.length} variants</td>
                  <td>
                    <button 
                      className={styles.actionBtn} 
                      onClick={() => handleDelete(product.id, product.name)}
                      title="Delete Product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    No products found. Add one above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add Product Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Add New Product</h2>
                <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Product Name</label>
                    <input required className={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Brand</label>
                    <input required className={styles.input} value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.formGroup}>
                    <label>Category</label>
                    <select required className={styles.input} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ProductCategory})}>
                      <option value="shoes">Shoes</option>
                      <option value="apparel">Apparel</option>
                      <option value="watches">Watches</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Price ($)</label>
                    <input required type="number" step="0.01" className={styles.input} value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Image URL (High quality, square aspect ratio preferred)</label>
                  <input required type="url" className={styles.input} value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." />
                </div>

                <div className={styles.formGroup}>
                  <label>Sizes (Comma separated)</label>
                  <input required className={styles.input} value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} placeholder="e.g. S, M, L or 7, 8, 9" />
                </div>

                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea required className={styles.input} rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
