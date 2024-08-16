import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REST_API_KEY = "f8609808f0ad80f284bc679eb3d80315";
const REDIRECT_URI = "http://221.151.189.125:8081/Home";

const KaKaoLoginScreen = () => {
  const navigation = useNavigation();
  const [isCodeProcessed, setIsCodeProcessed] = React.useState(false);

  const handleNavigationChange = async (navState) => {
    const { url } = navState;
    const exp = "code=";
    const condition = url.indexOf(exp);

    if (condition !== -1 && !isCodeProcessed) {
      setIsCodeProcessed(true); // 인증 코드 처리 상태 업데이트

      const authorize_code = url.substring(condition + exp.length);
      console.log(authorize_code);

      try {
        const response = await axios.get(
          `http://34.41.123.200/api/v1/riders/callback?code=${authorize_code}`
        );
        const accessToken = response.data;

        if (accessToken) {
          console.log("Access Token:", accessToken);
          await AsyncStorage.setItem("access_token", accessToken);
          navigation.navigate("SignupScreen");
        } else {
          Alert.alert("Error", "Failed to retrieve access token");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
        Alert.alert("Error", "An error occurred while fetching access token");
      }
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        onNavigationStateChange={handleNavigationChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: "#fff",
  },
});

export default KaKaoLoginScreen;
