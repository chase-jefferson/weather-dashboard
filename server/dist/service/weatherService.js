import dotenv from 'dotenv';
dotenv.config();
// TODO: Define a class for the Weather object
class Weather {
    constructor(temperature, humidity, windSpeed, description) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.description = description;
    }
}
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        this.baseURL = 'https://api.openweathermap.org/data/2.5';
        this.apiKey = process.env.API_KEY || '66e829bb32b3b760e96d339d956ef245';
        this.cityName = '';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        const data = await response.json();
        return data[0];
    }
    // private async fetchLocationData(query: string) {}
    // TODO: Create destructureLocationData method
    destructureLocationData(locationData) {
        const { lat, lon } = locationData;
        return { latitude: lat, longitude: lon };
    }
    // private destructureLocationData(locationData: Coordinates): Coordinates {}
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        return encodeURIComponent(this.cityName);
    }
    // private buildGeocodeQuery(): string {}
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        return `lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}&units=imperial`;
    }
    // private buildWeatherQuery(coordinates: Coordinates): string {}
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const query = this.buildGeocodeQuery();
        const locationData = await this.fetchLocationData(query);
        return this.destructureLocationData(locationData);
    }
    // private async fetchAndDestructureLocationData() {}
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        const query = this.buildWeatherQuery(coordinates);
        const response = await fetch(`${this.baseURL}/weather?${query}`);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return await response.json();
    }
    // private async fetchWeatherData(coordinates: Coordinates) {}
    // TODO: Build parseCurrentWeather method
    parseCurrentWeather(response) {
        const { temp, humidity, wind_speed } = response.main;
        const { description } = response.weather[0];
        return new Weather(temp, humidity, wind_speed, description);
    }
    // private parseCurrentWeather(response: any) {}
    // TODO: Complete buildForecastArray method
    buildForecastArray(currentWeather, weatherData) {
        const forecastArray = weatherData.map((data) => {
            const { temp, humidity, wind_speed } = data.main;
            const { description } = data.weather[0];
            return new Weather(temp, humidity, wind_speed, description);
        });
        forecastArray.unshift(currentWeather);
        return forecastArray;
    }
    // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        this.cityName = city;
        const coordinates = await this.fetchAndDestructureLocationData();
        const weatherData = await this.fetchWeatherData(coordinates);
        const currentWeather = this.parseCurrentWeather(weatherData);
        const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
        return forecastArray;
    }
}
export default new WeatherService();
