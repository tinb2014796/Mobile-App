import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTab from '../navigations/HomeNavigation';
import ProfileTab from '../navigations/ProfileNavigation';
import AttendanceTab from '../navigations/AttendanceNavigation';
import ContactTab from '../navigations/ContactNavigation';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator 
            screenOptions={({route})=>({ 
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 70,
                    backgroundColor: '#161616',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0
                }, 
                tabBarIcon: ({focused, color, size}) => {
                    color = focused ? '#3B82F6' : '#9CA3AF';
                    switch (route.name) {
                        case 'HomeTab':
                            return <Icon name="home-outline" size={24} color={color} />
                        case 'AttendanceTab':
                            return <Icon name="calendar-outline" size={24} color={color} />
                        case 'ContactTab':
                            return <Icon name="mail-outline" size={24} color={color} />
                        case 'ProfileTab':
                            return <Icon name="person-outline" size={24} color={color} />
                    }
                }       
            })}  
        >
            <Tab.Screen name="HomeTab" component={HomeTab} options={{ headerShown: false }} /> 
            <Tab.Screen name="AttendanceTab" component={AttendanceTab} options={{ headerShown: false }} />
            <Tab.Screen name="ContactTab" component={ContactTab} options={{ headerShown: false }} />
            <Tab.Screen name="ProfileTab" component={ProfileTab} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
};

export default TabNavigator;