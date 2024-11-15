import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/Customer/HomeScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';
const Stack = createStackNavigator();

const CustomerNavigator = () => {

    return (
        <Stack.Navigator 
            screenOptions={{ headerShown: false }}
            initialRouteName="Home"
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
    );
};

export default CustomerNavigator;