import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/carListing.css';

const CarListing = () => {
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    description: '',
    imageUrl: ''
  });
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: ''
  });

  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5000/api/cars');
      setCars(response.data);
    } catch (error) {
      setError('Error fetching cars: ' + (error.response?.data?.error || error.message));
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    setSelectedCar(null);
    setError(null);
    setFormData({
      brand: '',
      model: '',
      year: '',
      price: '',
      description: '',
      imageUrl: ''
    });
  };

  const handleShow = (car = null) => {
    if (car) {
      setSelectedCar(car);
      setFormData(car);
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateImageUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!validateImageUrl(formData.imageUrl)) {
        setError('Please enter a valid image URL');
        setLoading(false);
        return;
      }

      if (selectedCar) {
        await axios.put(`http://localhost:5000/api/cars/${selectedCar.id}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/cars', formData);
      }
      await fetchCars();
      handleClose();
    } catch (error) {
      setError('Error saving car: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        setLoading(true);
        setError(null);
        await axios.delete(`http://localhost:5000/api/cars/${id}`);
        await fetchCars();
      } catch (error) {
        setError('Error deleting car: ' + (error.response?.data?.error || error.message));
        console.error('Error deleting car:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredCars = cars.filter(car => {
    const matchesSearch =
      car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = !filters.brand || car.brand.toLowerCase() === filters.brand.toLowerCase();
    const matchesModel = !filters.model || car.model.toLowerCase() === filters.model.toLowerCase();
    const matchesMinPrice = !filters.minPrice || car.price >= Number(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || car.price <= Number(filters.maxPrice);
    const matchesMinYear = !filters.minYear || car.year >= Number(filters.minYear);
    const matchesMaxYear = !filters.maxYear || car.year <= Number(filters.maxYear);

    return matchesSearch && matchesBrand && matchesModel &&
      matchesMinPrice && matchesMaxPrice &&
      matchesMinYear && matchesMaxYear;
  });

  // Get unique brands and models for filters
  const uniqueBrands = [...new Set(cars.map(car => car.brand))];
  const uniqueModels = [...new Set(cars.map(car => car.model))];

  return (
    <div className="container-fluid mt-5" id="main-container">
      <div className="row">
        {/* Sidebar with filters */}
        <div className="col-md-3">
          <div className="position-sticky">
            <div className="card" id="filter">
              <div className="card-body">
                <h5 className="card-title mb-4">Search & Filters</h5>

                {/* Search Bar */}
                <InputGroup className="mb-4 mx-3 search-bar">
                  <InputGroup.Text>
                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search cars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>

                {/* Filters */}
                <Form>
                  {/* Brand Filter */}
                  <Form.Group className="mb-3">
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                      as="select"
                      value={filters.brand}
                      onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                    >
                      <option value="">All Brands</option>
                      {uniqueBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {/* Model Filter */}
                  <Form.Group className="mb-3">
                    <Form.Label>Model</Form.Label>
                    <Form.Control
                      as="select"
                      value={filters.model}
                      onChange={(e) => setFilters({ ...filters, model: e.target.value })}
                    >
                      <option value="">All Models</option>
                      {uniqueModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </Form.Control>
                  </Form.Group>

                  {/* Price Range */}
                  <Form.Group className="mb-3">
                    <Form.Label>Price Range</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      />
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      />
                    </div>
                  </Form.Group>

                  {/* Year Range */}
                  <Form.Group className="mb-3">
                    <Form.Label>Year Range</Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="number"
                        placeholder="Min"
                        value={filters.minYear}
                        onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                      />
                      <Form.Control
                        type="number"
                        placeholder="Max"
                        value={filters.maxYear}
                        onChange={(e) => setFilters({ ...filters, maxYear: e.target.value })}
                      />
                    </div>
                  </Form.Group>

                  {/* Reset Filters Button */}
                  <Button
                    variant="secondary"
                    className="w-100"
                    onClick={() => {
                      setFilters({
                        brand: '',
                        model: '',
                        minPrice: '',
                        maxPrice: '',
                        minYear: '',
                        maxYear: ''
                      });
                      setSearchTerm('');
                    }}
                  >
                    Reset Filters
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>

        
        <div className="col-md-9">
          {/* Car Post */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Car Listing</h2>
              <FontAwesomeIcon icon="fa-solid fa-square-plus" className='icon' onClick={() => handleShow()}/>
          </div>

          {/* Error message display */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="text-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Car List*/}
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {filteredCars.length > 0 ? (
              filteredCars.map(car => (
                <div key={car.id} className="col">
                  <div className="card h-100">
                    <img
                      src={car.imageUrl}
                      className="card-img-top"
                      alt={`${car.brand} ${car.model}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{car.brand} {car.model}</h5>
                      <p className="card-text">
                        Year: {car.year}<br />
                        Price: ${car.price.toLocaleString()}<br />
                        {car.description}
                      </p>
                    </div>
                    <div className="card-footer bg-transparent">
                      <div className="d-flex justify-content-between">
                        <Button variant="primary" onClick={() => handleShow(car)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleDelete(car.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <h4>No cars found matching your criteria</h4>
                <p>Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar with filters */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCar ? 'Edit Car' : 'Add New Car'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    imageUrl: e.target.value
                  }));
                  // Update preview if URL is valid
                  if (validateImageUrl(e.target.value)) {
                    setImagePreview(e.target.value);
                  }
                }}
                required
                placeholder="https://example.com/car-image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={imagePreview || 'https://placehold.co/300x200?text=Preview'}
                    alt="Car preview"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: '200px',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/300x200?text=Invalid+Image+URL';
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleClose} className="me-2" disabled={loading}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>

                {/* For a new car: "Save" → [spinner] "Saving..." → "Save" */}
                {/* For editing: "Update" → [spinner] "Updating..." → "Update" */}
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {selectedCar ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  selectedCar ? 'Update' : 'Save'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CarListing;