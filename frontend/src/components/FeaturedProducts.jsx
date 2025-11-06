// import { Link } from 'react-router-dom';

// function FeaturedProducts({ products }) {
//   const baseUrl = 'http://localhost:8000'; // Base URL for backend

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//       {products.length === 0 ? (
//         <p className="text-center text-gray-400 col-span-full">
//           No featured products available.
//         </p>
//       ) : (
//         products.map(product => (
//           <div
//             key={product._id}
//             className="bg-gray-800 rounded-lg shadow-md border border-wood-accent p-4"
//           >
//             <img
//               src={`${baseUrl}${product.image}`}
//               alt={product.name}
//               className="w-full h-48 object-cover rounded-md mb-4"
//               onError={(e) => {
//                 console.error(`Failed to load image: ${baseUrl}${product.image}`);
//                 e.target.src = '/fallback-image.jpg'; // Fallback image
//               }}
//             />
//             <h3 className="text-lg font-semibold text-text-light">{product.name}</h3>
//             <p className="text-gray-400 text-sm">{product.description}</p>
//             <p className="text-text-light font-semibold mt-2">${product.price.toFixed(2)}</p>
//             <Link
//               to="/dashboard"
//               className="mt-4 block text-center bg-wood-accent text-dark-bg py-2 rounded-lg hover:bg-opacity-80 transition"
//             >
//               View Details
//             </Link>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default FeaturedProducts;


import { Link } from 'react-router-dom';

function FeaturedProducts({ products }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.length === 0 ? (
        <p className="text-center text-gray-400 col-span-full">
          No featured products available.
        </p>
      ) : (
        products.map(product => (
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
            <h3 className="text-lg font-semibold text-text-light">{product.name}</h3>
            <p className="text-gray-400 text-sm">{product.category}</p>
            <p className="text-text-light font-semibold mt-2">₹{product.price.toFixed(2)}</p>
            <Link
              to="/dashboard"
              className="mt-4 block text-center bg-wood-accent text-dark-bg py-2 rounded-lg hover:bg-opacity-80 transition"
            >
              View Details
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default FeaturedProducts;