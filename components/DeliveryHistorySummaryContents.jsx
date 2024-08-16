import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRecoilState } from "recoil";
import { navigationState } from "../atom/navigation";

const DeliveryHistorySummaryContents = ({
  deliveryHistories,
  setDeliveryHistories,
  refreshHistories,
  // startDate,
  // endDate,
  // latest,
  // oldest,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [recoilNavigation, setRecoilNavigation] =
    useRecoilState(navigationState);

  const onRefresh = async () => {
    setRefreshing(true);
    // console.log(latest, "*****");
    // console.log(oldest, "*****");
    await refreshHistories();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.summaryContainer}>
      <ScrollView
        style={styles.summaryScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {deliveryHistories.map((el, i) => (
          <View key={i} style={styles.deliveryHistoryContainer}>
            <View style={styles.deliveryHistoryLeft}>
              <View style={styles.deliveryHistoryLeftTop}>
                <View>
                  <Text style={styles.deliveryHistoryContent}>
                    {el.deliveryHistoryCreatedAt.substring(2)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.deliveryHistoryContent}>
                    {el.deliveryDay}
                  </Text>
                </View>
              </View>
              <View>
                <Text style={styles.deliveryHistoryContent}>
                  {el.deliveryCount}회
                </Text>
              </View>
            </View>
            <View style={styles.deliveryHistoryRight}>
              <View>
                <Text style={styles.deliveryHistoryContent}>
                  {el.deliveryTotalIncome}원
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  console.log(el, "여기 11111");
                  recoilNavigation.navigate("DeliveryHistoryDetail", {
                    deliveryHistoryId: el.deliveryHistoryId,
                    deliveryHistoryCreatedAt: el.deliveryHistoryCreatedAt,
                  });
                }}
              >
                <Text style={styles.deliveryHistoryContentNav}>＞</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    height: 500,
  },

  summaryScroll: {
    flex: 1,
    paddingRight: 10,
  },

  deliveryHistoryContainer: {
    marginTop: 30,
    paddingBottom: 15,
    paddingRight: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#b5b4b1",
  },

  deliveryHistoryContent: {
    fontSize: 20,
  },

  deliveryHistoryContentNav: {
    fontSize: 20,
    color: "#b5b4b1",
    fontWeight: "900",
  },

  deliveryHistoryLeft: {
    gap: 10,
  },

  deliveryHistoryLeftTop: {
    flexDirection: "row",
    gap: 10,
  },

  deliveryHistoryRight: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 10,
  },
});

export default DeliveryHistorySummaryContents;
