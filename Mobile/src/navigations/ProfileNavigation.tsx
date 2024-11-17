import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "../screens/Employee/ProfileScreen";

const Stack = createStackNavigator();

const ProfileNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default ProfileNavigation;