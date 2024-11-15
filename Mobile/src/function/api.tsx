import employeeService from "../services/employee.service";
import { handleResponse } from "./index";
import { Alert } from "react-native";

interface CheckInData {
    date: string;
    reason: string;
    staff_id: number;
    time_end: string;
    time_start: string;
}


export const LichLamViec = async (id: number) => {
    const response = await employeeService.lichLamViec(id);
    const data = handleResponse(response);
    return data;
}


export const CheckIn = async (checkInData: CheckInData) => {
    try {
        const response = await employeeService.checkIn(checkInData);
        const responseData = handleResponse(response);
        return responseData;
    } catch (error: any) {
        if(error.response.status === 400){
            Alert.alert('Chấm công', 'Bạn đã chấm công');
        }
    }
}


export const CheckOut = async (id: number,checkOutData: CheckInData) => {
    console.log(id,checkOutData);
    try {
        const response = await employeeService.checkOut(id,checkOutData);
        const responseData = handleResponse(response);
        console.log(responseData);
        if(responseData.status === 200){
            Alert.alert('Chấm công', 'Chấm công thành công');
        }
        return responseData;

    } catch (error: any) {
        if(error.response.status === 400){
            Alert.alert('Chấm công', 'Bạn đã chấm công');
        }
    }
}




