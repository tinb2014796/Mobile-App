import apiService from "./api.service";
import { API_CONFIG } from "./config";

class PayService {
    constructor(baseUrl = API_CONFIG.BASE_URL + "/api") {
        this.api = apiService(baseUrl);
    }

    async create(data) {
        return (await this.api.post("/create-order", data)).data;
    }
}

export default PayService;
