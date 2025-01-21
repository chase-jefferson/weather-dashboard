import { Router } from 'express';
const router = Router();
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    const { city } = req.body;
    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }
    try {
        const weatherData = await WeatherService.getWeatherForCity(city);
        await HistoryService.saveCity(city);
        return res.json(weatherData);
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
});
// TODO: GET search history
router.get('/history', async (_req, _res) => { });
// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (_req, _res) => { });
export default router;
