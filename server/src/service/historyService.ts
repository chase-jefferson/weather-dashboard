const fs = require('fs').promises;
const path = require('path');

// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}
// TODO: Complete the HistoryService class
class HistoryService {
  saveCity(_city: any) {
    throw new Error('Method not implemented.');
  }
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    const filePath = path.join(__dirname, 'searchHistory.json');
    
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const cities = JSON.parse(data);
      return cities.map((city: { id: string; name: string }) => new City(city.id, city.name));
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }
  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    const filePath = path.join(__dirname, 'searchHistory.json');
    
    try {
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile(filePath, data, 'utf-8');
    } catch (error) {
      console.error('Error writing search history:', error);
    }
  }
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string): Promise<void> {
    const cities = await this.read();
    const id = (cities.length + 1).toString();
    cities.push(new City(id, city));
    await this.write(cities);
  }
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
  // async removeCity(id: string) {}
}

export default new HistoryService();
