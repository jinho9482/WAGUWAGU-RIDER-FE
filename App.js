import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screen/LoginScreen'; // LoginScreen 컴포넌트 경로에 맞게 수정하세요
import HomeScreen from './screen/HomeScreen';
import KaKaoLoginScreen from "./screen/KaKaoLoginScreen";
import SignupScreen from "./screen/SignupScreen";
import MypageScreen from "./screen/MypageScreen"; // HomeScreen 컴포넌트 경로에 맞게 수정하세요

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Main" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="KaKaoLoginScreen" component={KaKaoLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignupScreen" component={SignupScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Mypage" component={MypageScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
