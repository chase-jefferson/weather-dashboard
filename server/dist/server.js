import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import routes from './routes/index.js'; // Import routes if you have them in a separate file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the client dist folder
app.use(express.static('client/dist'));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to connect the routes (if you're using routes/index.js)
app.use(routes);

// Serve index.html for GET request to the root
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

// GET request to fetch search history
app.get('/api/weather/history', (_req, res) => {
  fs.readFile('searchHistory.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read search history.' });
    }

    const history = JSON.parse(data);
    res.json(history);
  });
});

// POST request to save a city and return its weather data
app.post('/api/weather', (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  const newCity = {
    id: uuidv4(),
    name: cityName,
    // In a real-world scenario, fetch weather data for the city
    weatherData: {
      temperature: '25°C',
      condition: 'Sunny',
    },
  };

  // Read the current search history and update it with the new city
  fs.readFile('searchHistory.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read search history.' });
    }

    const history = JSON.parse(data);
    history.push(newCity);

    // Write the updated history back to the file
    fs.writeFile('searchHistory.json', JSON.stringify(history, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to save city.' });
      }
      res.json(newCity);
    });
  });
});

// Start the server on the port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
