import { createStackNavigator } from "@react-navigation/stack";
import ContactScreen from "../screens/ContactScreen";

const Stack = createStackNavigator();

const ContactNavigation = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    ); 
};

export default ContactNavigation;