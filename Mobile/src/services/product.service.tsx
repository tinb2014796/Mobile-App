import apiService from "./api.service";
import { API_CONFIG } from "./config";

interface ProductService {
    api: any;
}

class ProductService {
    constructor(baseUrl = API_CONFIG.BASE_URL + "/api/product") {
        this.api = apiService;
    }

    async getAll() {
        return this.api.get('/api/product');
    }

    async create(data: any) {
        const headers = { 'Content-Type': 'multipart/form-data' };
        return this.api.post("/api/product", data, { headers });
    }

    async deleteAll() {
        return this.api.delete("/api/product");
    }

    async get(id: string | number) {
        return this.api.get(`/api/product/${id}`);
    }

    async update(id: string | number, data: any) {
        const headers = { 'Content-Type': 'multipart/form-data' };
        return this.api.put(`/api/product/${id}`, data, { headers });
    }

    async delete(id: string | number) {
        return this.api.delete(`/api/product/${id}`);
    }
}

export default new ProductService();
