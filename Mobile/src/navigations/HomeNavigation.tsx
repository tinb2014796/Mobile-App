import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }}/>
        </Stack.Navigator>
    );
};

export default AppNavigator;