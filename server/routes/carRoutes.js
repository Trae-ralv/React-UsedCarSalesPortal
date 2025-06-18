const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, '../database/cars.json');

// Ensure database file exists
const ensureDbExists = async () => {
  try {
    await fs.access(dbPath);
  } catch (error) {
    const initialData = { cars: [] };
    await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2));
  }
};

// Read database
const readDatabase = async () => {
  await ensureDbExists();
  const data = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(data);
};

// Write database
const writeDatabase = async (data) => {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
};

// Validate car data
const validateCar = (car) => {
  const requiredFields = ['brand', 'model', 'year', 'price', 'description', 'imageUrl'];
  const missingFields = requiredFields.filter(field => !car[field]);
  
  if (missingFields.length) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (isNaN(car.year) || car.year < 1900 || car.year > new Date().getFullYear() + 1) {
    throw new Error('Invalid year');
  }

  if (isNaN(car.price) || car.price < 0) {
    throw new Error('Invalid price');
  }

  try {
    new URL(car.imageUrl);
  } catch {
    throw new Error('Invalid image URL');
  }
};

// Get all cars
router.get('/', async (req, res) => {
  try {
    const db = await readDatabase();
    res.json(db.cars);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cars: ' + error.message });
  }
});

// Add new car
router.post('/', async (req, res) => {
  try {
    validateCar(req.body);
    const db = await readDatabase();
    const newCar = {
      id: Date.now(),
      ...req.body
    };
    db.cars.push(newCar);
    await writeDatabase(db);
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ error: 'Error creating car: ' + error.message });
  }
});

// Update car
router.put('/:id', async (req, res) => {
  try {
    validateCar(req.body);
    const db = await readDatabase();
    const carId = parseInt(req.params.id);
    const carIndex = db.cars.findIndex(car => car.id === carId);
    
    if (carIndex === -1) {
      return res.status(404).json({ error: 'Car not found' });
    }

    db.cars[carIndex] = { ...db.cars[carIndex], ...req.body };
    await writeDatabase(db);
    res.json(db.cars[carIndex]);
  } catch (error) {
    res.status(400).json({ error: 'Error updating car: ' + error.message });
  }
});

// Delete car
router.delete('/:id', async (req, res) => {
  try {
    const db = await readDatabase();
    const carId = parseInt(req.params.id);
    const initialLength = db.cars.length;
    db.cars = db.cars.filter(car => car.id !== carId);
    
    if (db.cars.length === initialLength) {
      return res.status(404).json({ error: 'Car not found' });
    }

    await writeDatabase(db);
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting car: ' + error.message });
  }
});

module.exports = router;