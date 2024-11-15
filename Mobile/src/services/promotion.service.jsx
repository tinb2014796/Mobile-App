import apiService from "./api.service";
import { API_CONFIG } from "./config";
//http://192.168.101.11:8000/api/promotions/customer

class PromotionService {
    constructor(baseUrl = API_CONFIG.BASE_URL + "/api/promotions") {
        this.api = apiService(baseUrl);
    }

    async getPromotions() {
        return (await this.api.get("/customer")).data;
    }

    async getPromotionDetail(id) {
        return (await this.api.get(`/customer/${id}`)).data;
    }
    
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
}

export default new PromotionService();