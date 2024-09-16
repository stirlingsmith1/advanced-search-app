import React, { useState } from 'react';
import axios from 'axios';
import './SearchComponent.css';

const initialProducts = [
    { id: 1, name: 'Chocolate Cake', description: 'Rich and creamy chocolate cake', image: 'https://images.unsplash.com/photo-1517427294546-5aa121f68e8a?q=80&w=3164&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 2, name: 'Blueberry Muffin', description: 'Freshly baked blueberry muffin', image: 'https://images.unsplash.com/photo-1722251172860-39856cdd3bcd?q=80&w=2400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 3, name: 'Croissant', description: 'Flaky and buttery croissant', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 4, name: 'Bagel', description: 'Chewy bagel with sesame seeds', image: 'https://images.unsplash.com/photo-1707079266703-b67f36a881f1?q=80&w=3216&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 5, name: 'Donut', description: 'Classic glazed donut', image: 'https://images.unsplash.com/photo-1709384357762-48812ab41732?q=80&w=3054&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 6, name: 'Cupcake', description: 'Vanilla cupcake with sprinkles', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=2293&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 7, name: 'Macaron', description: 'Deliciously colorful macarons', image: 'https://images.unsplash.com/photo-1706170498499-a12be93c842e?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 8, name: 'Cinnamon Roll', description: 'Warm and gooey cinnamon roll', image: 'https://images.unsplash.com/photo-1514509152927-0403a1b6a2d8?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 9, name: 'Banana Bread', description: 'Moist and flavorful banana bread', image: 'https://images.unsplash.com/photo-1606101204735-85ad3a8bfd81?q=80&w=2712&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 10, name: 'Apple Pie', description: 'Homemade apple pie with lattice crust', image: 'https://images.unsplash.com/photo-1601000938365-f182c5ec2f77?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
  ];
  
  
  

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(initialProducts);
  const [useLocalSearch, setUseLocalSearch] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Perform local filtering
  const performLocalSearch = (term) => {
    const filtered = initialProducts.filter(item =>
      item.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  // Perform server-side search with pagination
  const fetchServerSearch = async (term, page = 1) => {
    try {
      const response = await axios.get(`http://localhost:4001/products`, {
        params: {
          name_like: term,
          _page: page,
          _limit: itemsPerPage,
        },
      });
      setFilteredItems(response.data);
      setError(''); // Clear previous errors
    } catch (error) {
      setError('Error fetching search results. Please try again.');
    }
  };


  const debouncedServerSearch = debounce(fetchServerSearch, 300);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); 
    if (useLocalSearch) {
      performLocalSearch(term);
    } else {
      debouncedServerSearch(term);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (!useLocalSearch) {
      fetchServerSearch(searchTerm, page);
    }
  };

  return (
    <div className="search-container">
      <h2>Advanced Search</h2>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="checkbox-container">
        <input
          type="checkbox"
          checked={useLocalSearch}
          onChange={() => setUseLocalSearch(!useLocalSearch)}
        />
        <label className="checkbox-label">Use Local Search</label>
      </div>

      <div className="search-results">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="card">
              <img src={item.image} alt={item.name} className="card-image" />
              <div className="card-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>

      
      {!useLocalSearch && (
        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <button onClick={() => handlePageChange(currentPage + 1)}>Next</button>
        </div>
      )}

      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SearchComponent;
