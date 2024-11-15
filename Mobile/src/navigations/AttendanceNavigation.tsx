import { createStackNavigator } from "@react-navigation/stack";
import AttendanceScreen from "../screens/AttendanceScreen";
import AttendanceDetailScreen from "../screens/AttendanceDetailScreen";
 // Added import for Icon and TouchableOpacity

const Stack = createStackNavigator();

const AttendanceNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Attendance" component={AttendanceScreen} options={{ headerShown: false }} />
            <Stack.Screen 
                name='AttendanceDetail' 
                component={AttendanceDetailScreen} 
                options={{ 
                    headerShown: true,
                    headerTitle: 'Xác nhận chấm công',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#0066b2', // Màu nền giống như trong hình
                    },
                    headerTintColor: '#fff', // Màu chữ và icon
                }} 
            />          
        </Stack.Navigator>
    );
};

export default AttendanceNavigation;