import apiService from "./api.service";
import { API_CONFIG } from "./config";

interface ProductService {
    api: any;
}

class ProductService {
    constructor(baseUrl = API_CONFIG.BASE_URL + "/api") {
        this.api = apiService(baseUrl);
    }

    async getAll() {
        return (await this.api.get('/products')).data;
    }

    async getByCategory(id: string | number) {
        return (await this.api.get(`/products/category/${id}`)).data;
    }

    async getDetail(id: string | number) {
        return (await this.api.get(`/product/${id}`)).data;
    }

    async create(data: any) {
        const headers = { 'Content-Type': 'multipart/form-data' };
        return (await this.api.post("/product", data, { headers })).data;
    }

    async deleteAll() {
        return (await this.api.delete("/product")).data;
    }

    async get(id: string | number) {
        return (await this.api.get(`/product/${id}`)).data;
    }

    async update(id: string | number, data: any) {
        const headers = { 'Content-Type': 'multipart/form-data' };
        return (await this.api.put(`/product/${id}`, data, { headers })).data;
    }

    async delete(id: string | number) {
        return (await this.api.delete(`/product/${id}`)).data;
    }
}

export default new ProductService();
