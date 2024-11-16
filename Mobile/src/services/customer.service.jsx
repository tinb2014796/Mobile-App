import apiService from "./api.service";
import { API_CONFIG } from "./config";

class CustomerService {
    constructor(baseUrl = API_CONFIG.BASE_URL + "/api/customer") {
        this.api = apiService(baseUrl);
    }

    async getAll() {
        return (await this.api.get("/")).data;
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async deleteAll() {
        return (await this.api.delete("/")).data;
    }

    async get(id) {
        return (await this.api.get(`/${id}/info`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async changePassword(data) {
        return (await this.api.put(`/change-password`, data)).data;
    }
}

export default new CustomerService();
