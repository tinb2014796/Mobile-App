import apiService from "./api.service";
import { API_CONFIG } from "./config";

class OrderService {
    constructor(baseUrl = API_CONFIG.BASE_URL + "/api/orders") {
        this.api = apiService(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async create(data) {
        return (await this.api.post("/customer/", data)).data;
    }

    async deleteAll() {
        return (await this.api.delete("/")).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async getDetail(id) {
        return (await this.api.get(`/detail/${id}`)).data;
    }

    async getOrdersByCustomerId(id, date) {
        return (await this.api.get(`/customer/${id}`, { params: { date } })).data;
    }
}

export default new OrderService();
