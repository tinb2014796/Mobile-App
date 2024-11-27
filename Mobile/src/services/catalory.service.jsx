import apiService from "./api.service";
import { API_CONFIG } from "./config";

class CategoryService {
    constructor(baseUrl = API_CONFIG.BASE_URL + "/api") {
        this.api = apiService(baseUrl);
    }

    async getAll() {
        return (await this.api.get('/categories')).data;
    }
    async get(id) {
        return (await this.api.get(`/category-products/${id}`)).data;
    }
    // async create(data) {
    //     const headers = { 'Content-Type': 'multipart/form-data' };
    //     return (await this.api.post("/category", data, { headers })).data;
    // }

    // async deleteAll() {
    //     return (await this.api.delete("/category")).data;
    // }

    

    // async update(id, data) {
    //     const headers = { 'Content-Type': 'multipart/form-data' };
    //     return (await this.api.put(`/category/${id}`, data, { headers })).data;
    // }

    // async delete(id) {
    //     return (await this.api.delete(`/category/${id}`)).data;
    // }
}

export default new CategoryService();
