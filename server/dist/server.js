import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Ensure you have `node-fetch` installed
import { v4 as uuidv4 } from 'uuid';
import routes from './routes/index.js'; // Optional, if you're using routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// OpenWeatherMap API base URL and API key
const WEATHER_API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || "66e829bb32b3b760e96d339d956ef245"; // Use .env for security

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
app.post('/api/weather', async (req, res) => {
  const { cityName } = req.body;

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  try {
    // Fetch weather data from OpenWeatherMap API
    const weatherResponse = await fetch(
      `${WEATHER_API_BASE_URL}?q=${encodeURIComponent(cityName)}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!weatherResponse.ok) {
      throw new Error(`Failed to fetch weather data: ${weatherResponse.statusText}`);
    }

    const weatherData = await weatherResponse.json();

    // Construct the new city object with real weather data
    const newCity = {
      id: uuidv4(),
      name: cityName,
      weatherData: {
        temperature: `${weatherData.main.temp}°C`,
        condition: weatherData.weather[0].description,
      },
    };

    // Read the current search history and update it with the new city
    fs.readFile('searchHistory.json', 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Unable to read search history.' });
      }

      const history = JSON.parse(data || '[]'); // Handle empty file gracefully
      history.push(newCity);

      // Write the updated history back to the file
      fs.writeFile('searchHistory.json', JSON.stringify(history, null, 2), 'utf8', (err) => {
        if (err) {
          return res.status(500).json({ error: 'Unable to save city.' });
        }
        res.json(newCity);
      });
    });
  } catch (error) {
    console.error("Error fetching the weather data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server on the port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
