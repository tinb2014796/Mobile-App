import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TabNavigator from './TabNavigation';

const Stack = createStackNavigator();

const MainNavigator = () => {

    return (
        <Stack.Navigator 
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="TabNavigator" component={TabNavigator} />
        </Stack.Navigator>
    );
};

export default MainNavigator;