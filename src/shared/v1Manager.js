import axios from 'axios';

class ApiManager {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.instance = axios.create({ baseURL });
  }

  async get(url, params = {}, config = {}) {
    console.log(`[ApiManager][GET] URL: ${this.baseURL}${url} | Params:`, params, config);
    try {
      const response = await this.instance.get(url, { params, headers: config?.headers });
      console.log('[ApiManager][GET] Success:', response.data);
      return response;
    } catch (error) {
      console.error('[ApiManager][GET] Error:', error);
      throw error;
    }
  }

  async post(url, data = {}, config = {}) {
    console.log(`[ApiManager][POST] URL: ${this.baseURL}${url} | Data:`, data, config);
    try {
      const response = await this.instance.post(url, data, config);
      console.log('[ApiManager][POST] Success:', response.data);
      return response;
    } catch (error) {
      console.error('[ApiManager][POST] Error:', error);
      throw error;
    }
  }

  async put(url, data = {}, config = {}) {
    console.log(`[ApiManager][PUT] URL: ${this.baseURL}${url} | Data:`, data, config);
    try {
      const response = await this.instance.put(url, data, config);
      console.log('[ApiManager][PUT] Success:', response.data);
      return response;
    } catch (error) {
      console.error('[ApiManager][PUT] Error:', error);
      throw error;
    }
  }
}

// Exportamos una instancia lista para usar en v1
const v1Manager = new ApiManager('https://development.jalocompany.tech/split_mate');

export default v1Manager;
export { ApiManager };