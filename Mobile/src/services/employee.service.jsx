import apiService from "./api.service";
import { API_CONFIG } from "./config";

class EmployeeService {
    constructor(baseUrl = API_CONFIG.BASE_URL + "/api/employee") {
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

    async get(user_id) {
        return (await this.api.get(`/${user_id}`)).data;
    }

    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async lichLamViec(id) {
        return (await this.api.get(`/lich-lam-viec/${id}`)).data;
    }

    async checkIn(data) {
        return (await this.api.post(`/check-in`, data)).data;
    }

    async checkOut(id, data) {
        return (await this.api.put(`/check-out/${id}`, data)).data;
    }

    async fetchChamCong(nhanvien_id, date) {
        return (await this.api.get(`/cham-cong/${nhanvien_id}/${date}`)).data;
    }
}

export default new EmployeeService();