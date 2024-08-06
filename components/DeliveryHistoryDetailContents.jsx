import { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const DeliveryHistoryDetailContents = ({
  deliveryHistoryDetails,
  setDeliveryHistoryDetails,
  getDeliveryHistoryDetails,
}) => {
  const [refreshingDetail, setRefreshingDetail] = useState(false);

  const onRefreshDetail = async () => {
    setRefreshingDetail(true);
    const res = await getDeliveryHistoryDetails();
    console.log(
      "\n===========================================================\n",
      res,
      "\n===========================================================\n"
    );
    setTimeout(() => {
      setRefreshingDetail(false);
    }, 1000);
  };

  return (
    <View style={styles.detailContainer}>
      <ScrollView
        style={styles.detailScroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshingDetail}
            onRefresh={onRefreshDetail}
          />
        }
      >
        {deliveryHistoryDetails.map((el, i) => (
          <View key={i} style={styles.deliveryHistoryDetailContainer}>
            <View style={styles.deliveryHistoryDetailLeft}>
              <View>
                <Text style={styles.deliveryHistoryDetailContent}>
                  {el.storeName}
                </Text>
              </View>
              <View>
                <Text style={styles.deliveryHistoryDetailContent}>
                  {el.deliveryHistoryDetailCreatedAt.substring(11, 16)}
                </Text>
              </View>
            </View>
            <View style={styles.deliveryHistoryDetailRight}>
              <Text style={styles.deliveryHistoryDetailContent}>
                {el.deliveryIncome}원
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    height: 600,
    marginTop: 20,
  },

  detailScroll: {
    flex: 1,
    paddingRight: 10,
  },

  deliveryHistoryDetailContainer: {
    marginTop: 30,
    paddingBottom: 15,
    paddingRight: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#b5b4b1",
  },

  deliveryHistoryDetailContent: {
    fontSize: 20,
  },

  deliveryHistoryDetailContentNav: {
    fontSize: 20,
    color: "#b5b4b1",
  },

  deliveryHistoryDetailLeft: {
    gap: 10,
  },

  deliveryHistoryDetailLeftTop: {
    flexDirection: "row",
    gap: 10,
  },

  deliveryHistoryDetailRight: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 20,
  },
});

export default DeliveryHistoryDetailContents;
