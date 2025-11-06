import { useState, useEffect } from 'react';
import api from '../services/api';
import NavAuthenticated from '../components/NavAuthenticated';

function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '1',
    image: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api
      .get('/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Products fetch error:', err);
        setError('Failed to load products.');
        setTimeout(() => setError(''), 3000);
      });

    api.get('/orders')
      .then(res => {
        setOrders(res.data);
      })
      .catch(err => {
        console.error('Orders fetch error:', err);
        setError('Failed to load orders.');
        setTimeout(() => setError(''), 3000);
      });

    api.get('/orders/reports')
      .then(res => {
        setReports(res.data);
      })
      .catch(err => {
        console.error('Reports fetch error:', err);
        setError('Failed to load reports.');
        setTimeout(() => setError(''), 3000);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('category', newProduct.category);
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      if (newProduct.image) {
        formData.append('file', newProduct.image);
      }

      await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Refetch products to get the latest list
      const res = await api.get('/products');
      setProducts(res.data);
      
      setSuccess('Product added successfully!');
      setNewProduct({ name: '', category: '', price: '', stock: '1', image: null });
      // Clear the file input visually
      document.querySelector('input[type="file"]').value = '';
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Add product error:', err);
      setError(err.response?.data?.detail || 'Failed to add product. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleRemoveProduct = async (productId) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
        setSuccess('Product removed successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Remove product error:', err);
        setError(err.response?.data?.detail || 'Failed to remove product.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleProcessOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to mark this order as processed?')) {
      try {
        await api.post(`/orders/${orderId}/process`);
        setOrders(orders.filter(o => o._id !== orderId));
        // Refresh reports list
        const res = await api.get('/orders/reports');
        setReports(res.data);
        setSuccess('Order processed successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Process order error:', err);
        setError(err.response?.data?.detail || 'Failed to process order.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleDownloadReport = async (filename) => {
    try {
      const response = await api.get(`/orders/reports/${filename}`, {
        responseType: 'blob', // Important for file downloads
      });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download report.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-text-light px-4 py-6 font-sans">
      <NavAuthenticated />
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Admin Panel</h2>
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
            {error}
            <button
              onClick={() => setError('')}
              className="ml-4 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}
        {success && (
          <div className="bg-green-600 text-white p-4 rounded-lg mb-6 text-center">
            {success}
            <button
              onClick={() => setSuccess('')}
              className="ml-4 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-wood-accent mb-8">
          <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="w-full p-2 rounded-lg bg-gray-800 text-text-light border border-wood-accent"
              required
            />
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              placeholder="Category"
              className="w-full p-2 rounded-lg bg-gray-800 text-text-light border border-wood-accent"
              required
            />
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="w-full p-2 rounded-lg bg-gray-800 text-text-light border border-wood-accent"
              step="0.01"
              required
            />
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              placeholder="Stock"
              className="w-full p-2 rounded-lg bg-gray-800 text-text-light border border-wood-accent"
              required
            />
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-2 rounded-lg bg-gray-800 text-text-light border border-wood-accent"
            />
            <button
              type="submit"
              className="w-full bg-wood-accent text-dark-bg py-2 rounded-lg hover:bg-opacity-80 transition"
            >
              Add Product
            </button>
          </form>
        </div>
        <h3 className="text-xl font-semibold mb-4">Existing Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-gray-800 rounded-lg shadow-md border border-wood-accent p-4"
            >
              <img
                src={product.image_url || '/fallback-image.jpg'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
                onError={(e) => {
                  console.error(`Failed to load image: ${product.image_url || 'fallback'}`);
                  e.target.src = '/fallback-image.jpg';
                  e.target.onerror = null; // Prevent infinite retry loop
                }}
              />
              <h4 className="text-lg font-semibold text-text-light">{product.name}</h4>
              <p className="text-gray-400 text-sm">{product.category}</p>
              <p className="text-text-light font-semibold mt-2">₹{product.price ? product.price.toFixed(2) : 'N/A'}</p>
              <p className="text-gray-400 text-sm">Stock: {product.stock}</p>
              <button
                onClick={() => handleRemoveProduct(product._id)}
                className="mt-4 w-full bg-red-600 text-white py-1 rounded-lg hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mb-4 mt-8">Recent Orders</h3>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-wood-accent">
          {orders.length === 0 ? (
            <p className="text-center">No orders have been placed yet.</p>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="p-6 bg-gray-800 rounded-lg border border-wood-accent shadow-lg">
                  {/* Order Header */}
                  <div className="border-b border-wood-accent pb-3 mb-4">
                    <p className="text-lg font-bold text-wood-accent">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-400">Status: <span className="capitalize text-yellow-400">{order.status}</span></p>
                  </div>

                  {/* Customer Information */}
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-wood-accent mb-2">Customer Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p><span className="font-semibold">Name:</span> {order.user_name || 'N/A'}</p>
                      <p><span className="font-semibold">Email:</span> {order.user_email}</p>
                      <p><span className="font-semibold">Phone:</span> {order.phone_number || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Product Information */}
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-wood-accent mb-2">Product Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      <p><span className="font-semibold">Product:</span> {order.product_name || 'N/A'}</p>
                      <p><span className="font-semibold">Category:</span> {order.product_category || 'N/A'}</p>
                      <p><span className="font-semibold">Price per Unit:</span> ₹{order.product_price ? order.product_price.toFixed(2) : '0.00'}</p>
                      <p><span className="font-semibold">Quantity:</span> {order.quantity}</p>
                      <p className="md:col-span-2"><span className="font-semibold text-green-400">Total Amount:</span> <span className="text-green-400 font-bold">₹{order.item_total ? order.item_total.toFixed(2) : '0.00'}</span></p>
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-wood-accent mb-2">Delivery Address</h4>
                    <div className="text-sm space-y-1">
                      <p>{order.delivery_address || 'N/A'}</p>
                      <p>{order.city || 'N/A'}, {order.state || 'N/A'} - {order.pincode || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleProcessOrder(order._id)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Mark as Processed & Send Email
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-4 mt-8">Download Reports</h3>
        <div className="bg-gray-900 p-6 rounded-lg shadow-md border border-wood-accent">
          {reports.length === 0 ? (
            <p className="text-center">No reports available for download.</p>
          ) : (
            <div className="space-y-2">
              {reports.map(report => (
                <button
                  key={report}
                  onClick={() => handleDownloadReport(report)}
                  className="block text-blue-400 hover:underline text-left"
                >
                  {report}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;