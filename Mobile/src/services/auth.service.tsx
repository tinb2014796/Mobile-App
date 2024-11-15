import apiService from "./api.service";
import { API_CONFIG } from "./config";

interface AuthService {
    api: any;
}

class AuthService {
    constructor(baseUrl = API_CONFIG.BASE_URL + "/api") {
        this.api = apiService(baseUrl);
    }
    async login(data: any) {
        return this.api.post("/login", data);
    }

    async register(data: any) {
        return this.api.post("/register", data);
    }

    async logout() {
        return this.api.get("/logout");
    }

    async getCurrentUser() {
        return this.api.get("/current-user");
    }

    async loginCustomer(data: any) {
        return this.api.post("/login-customer", data);
    }

    async registerCustomer(data: any) {
        return this.api.post("/register-customer", data);
    }
}

export default new AuthService();
