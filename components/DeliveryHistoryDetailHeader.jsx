import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import { useRecoilState } from "recoil";
import { navigationState } from "../atom/navigation";

const DeliveryHistoryHeader = ({ title }) => {
  const [recoilNavigation, setRecoilNavigation] =
    useRecoilState(navigationState);
  console.log(recoilNavigation, "HERE");
  return (
    <>
      <StatusBar backgroundColor="#94D35C" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menu}
          onPress={() => recoilNavigation.navigate("DeliveryHistory")}
        >
          <Text style={styles.menuText}>＜</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#94D35C",
    height: "10vh",
    paddingVertical: 10,
  },

  menu: {
    zIndex: 10000,
  },

  menuText: {
    position: "absolute",
    left: "5%",
    fontSize: 25,
    fontWeight: "900",
  },

  title: {
    textAlign: "center",
    fontSize: 25,
  },
});

export default DeliveryHistoryHeader;
