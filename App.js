import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

// 스크린 컴포넌트들
import LoginScreen from "./screen/LoginScreen";
import HomeScreen from "./screen/HomeScreen";
import KaKaoLoginScreen from "./screen/KaKaoLoginScreen";
import SignupScreen from "./screen/SignupScreen";
import MypageScreen from "./screen/MypageScreen";
import MyPage from "./screen/MypageScreen";
import DeliveryHistory from "./screen/DeliveryHistory";
import DeliveryHistoryDetail from "./screen/DeliveryHistoryDetail";
import { RecoilRoot } from "recoil";

// 네비게이터 생성
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Drawer 네비게이터 정의
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="홈" component={HomeScreen} />
      <Drawer.Screen name="배달 내역 확인" component={DeliveryHistory} />
      {/* <Drawer.Screen name="일별 상세" component={DeliveryHistoryDetail} /> */}
      <Drawer.Screen name="마이페이지" component={MyPage} />
    </Drawer.Navigator>
  );
}

// Stack 네비게이터 정의
function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="KaKaoLoginScreen"
        component={KaKaoLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignupScreen"
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Mypage"
        component={MypageScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryHistory"
        component={DeliveryHistory}
        options={{
          headerTitle: "배달 내역 확인",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#94D35C",
          },
          headerTitleStyle: {
            fontSize: 25,
          },
          headerBackTitle: "☰",
        }}
      />
      <Stack.Screen
        name="DeliveryHistoryDetail"
        component={DeliveryHistoryDetail}
        options={{
          headerTitle: "일별 상세",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#94D35C",
          },
          headerTitleStyle: {
            fontSize: 25,
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </RecoilRoot>
  );
}
