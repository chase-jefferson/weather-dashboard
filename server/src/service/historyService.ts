// Import fs and path correctly as ES modules
import fs from 'fs';
import path from 'path';

// Define a City class with name and id properties
class City {
    id: any;
    name: any;

    constructor(id: any, name: any) {
        this.id = id;
        this.name = name;
    }
}

// HistoryService class
class HistoryService {
    saveCity(_city: any) {
        throw new Error('Method not implemented.');
    }

    // Read method to read from the searchHistory.json file
    async read() {
        const filePath = path.join(__dirname, 'searchHistory.json');
        try {
            const data = await fs.promises.readFile(filePath, 'utf-8');
            const cities = JSON.parse(data);
            return cities.map((city: { id: any; name: any; }) => new City(city.id, city.name));
        }
        catch (error) {
            console.error('Error reading search history:', error);
            return [];
        }
    }

    // Write method to write to the searchHistory.json file
    async write(cities: any) {
        const filePath = path.join(__dirname, 'searchHistory.json');
        try {
            const data = JSON.stringify(cities, null, 2);
            await fs.promises.writeFile(filePath, data, 'utf-8');
        }
        catch (error) {
            console.error('Error writing search history:', error);
        }
    }

    // Get cities from the searchHistory.json file
    async getCities() {
        return await this.read();
    }

    // Add a new city to the search history
    async addCity(city: any) {
        const cities = await this.read();
        const id = (cities.length + 1).toString();
        cities.push(new City(id, city));
        await this.write(cities);
    }

    // Remove a city by id from the search history
    async removeCity(id: any) {
        const cities = await this.read();
        const updatedCities = cities.filter((city: { id: any; }) => city.id !== id);
        await this.write(updatedCities);
    }
}

export default new HistoryService();

