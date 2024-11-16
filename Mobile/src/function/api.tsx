import employeeService from "../services/employee.service";
import { handleResponse } from "./index";
import { Alert } from "react-native";

export const LichLamViec = async (id: number) => {
    const response = await employeeService.lichLamViec(id);
    const data = handleResponse(response);
    return data;
}




