const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { getCurrentTimestamp } = require('../utils/helpers');


const dbPath = path.join(__dirname, '../database/users.json');

// Read database
const readDatabase = async () => {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        const initialData = { users: [] };
        await fs.writeFile(dbPath, JSON.stringify(initialData, null, 2));
        return initialData;
    }
};

// Write database
const writeDatabase = async (data) => {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
};

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for:', username);

        if (!username || !password) {
            console.log('Missing credentials');
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const db = await readDatabase();
        console.log('Database read successful');

        const user = db.users.find(u => {
            const match = u.username === username && u.password === password;
            console.log('Checking user:', u.username, 'Match:', match);
            return match;
        });

        if (user) {
            console.log('User found, login successful');
            const { password, ...userWithoutPassword } = user;
            res.json({
                ...userWithoutPassword,
                loginTime: getCurrentTimestamp
            });
        } else {
            console.log('User not found or password incorrect');
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error during login: ' + error.message });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const db = await readDatabase();

        // Check if username already exists
        if (db.users.some(u => u.username === username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Check if email already exists
        if (db.users.some(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Validate input
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const newUser = {
            id: Date.now(),
            username,
            password,
            email,
            createdAt: getCurrentTimestamp()

        };

        db.users.push(newUser);
        await writeDatabase(db);

        // Don't send password back to client
        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: 'Error during registration' });
    }
});

module.exports = router;