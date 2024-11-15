import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './src/navigations/AuthNavigator';
import MainNavigation from './src/navigations/MainNavigation';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { selectAuth, authLogin , authLogout} from './src/redux/reducers/authReducers';
import authService from './src/services/auth.service';
import { handleResponse } from './src/function';
import CustomerNavigator from './src/navigations/CustomerNavigation';

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const authData = useSelector(selectAuth);
  const [customer, setCustomer] = useState<string | null>(null);

  useEffect(() => {
    checkLogin();
    checkCustomer();
  }, []);

  const checkCustomer = async () => {
    const customerData = await AsyncStorage.getItem('customer');
    if (customerData) {
      setCustomer(customerData);
    }
  };

  const checkLogin = async () => {
    try {
      if(!authData.user){
        const accessToken = await AsyncStorage.getItem('access_token');
        if (accessToken) {
          const response = await authService.getCurrentUser();
          const user = handleResponse(response);
          if(user.id){
            dispatch(
              authLogin({
                access_token: accessToken,
                user: user
              })
            );
          }else{
            await AsyncStorage.removeItem('access_token');
            dispatch(authLogout());
          }
        }
      }
    } catch (error) {
      console.error('Error checking login:', error);
      await AsyncStorage.removeItem('access_token');
      dispatch(authLogout());
    }
  };

  return (
    <NavigationContainer>
      {customer ? (
        <CustomerNavigator />
      ) : authData.access_token ? (
        <MainNavigation />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default App;