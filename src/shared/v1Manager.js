import axios from 'axios';

class ApiManager {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.instance = axios.create({ baseURL });
  }

  async get(url, params = {}) {
    console.log(`[ApiManager][GET] URL: ${this.baseURL}${url} | Params:`, params);
    try {
      const response = await this.instance.get(url, { params });
      console.log('[ApiManager][GET] Success:', response.data);
      return response;
    } catch (error) {
      console.error('[ApiManager][GET] Error:', error);
      throw error;
    }
  }

  async post(url, data = {}) {
    console.log(`[ApiManager][POST] URL: ${this.baseURL}${url} | Data:`, data);
    try {
      const response = await this.instance.post(url, data);
      console.log('[ApiManager][POST] Success:', response.data);
      return response;
    } catch (error) {
      console.error('[ApiManager][POST] Error:', error);
      throw error;
    }
  }
}

// Exportamos una instancia lista para usar en v1
const v1Manager = new ApiManager('https://development.jalocompany.tech/split_mate');

export default v1Manager;
export { ApiManager };