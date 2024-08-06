import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import DeliveryHistoryDetailContents from "../components/DeliveryHistoryDetailContents";
import DeliveryHistoryDetailHeader from "../components/DeliveryHistoryDetailHeader";
import { getHistoryDetailsByHistoryId } from "../api/DeliveryHistoryDetail";
import DeliveryHistoryHeader from "../components/DeliveryHistoryDetailHeader";

const DeliveryHistoryDetail = ({ route }) => {
  console.log(route, "*****route******");
  const [deliveryHistoryDetails, setdeliveryHistoryDetails] = useState([]);

  const getDeliveryHistoryDetails = async () => {
    const res = await getHistoryDetailsByHistoryId(
      route.params.deliveryHistoryId
    );
    const sortedDetails = sortLatestFirst(res);
    setdeliveryHistoryDetails(sortedDetails);
    return sortedDetails;
  };

  const sortLatestFirst = (details) => {
    const sortedDetails = details.sort(
      (a, b) =>
        new Date(b.deliveryHistoryDetailCreatedAt) -
        new Date(a.deliveryHistoryDetailCreatedAt)
    );
    return sortedDetails;
  };

  useEffect(() => {
    getDeliveryHistoryDetails();
  }, []);

  return (
    <View>
      <DeliveryHistoryDetailHeader title="일별 상세" />

      <View style={styles.main}>
        <View style={styles.duration}>
          <Text style={styles.durationText}>
            {route.params.deliveryHistoryCreatedAt.substring(2)}
          </Text>
        </View>
        <DeliveryHistoryDetailContents
          deliveryHistoryDetails={deliveryHistoryDetails}
          setdeliveryHistoryDetails={setdeliveryHistoryDetails}
          getDeliveryHistoryDetails={getDeliveryHistoryDetails}
        />
      </View>
    </View>
  );
};

export default DeliveryHistoryDetail;

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 30,
    alignItems: "center",
  },

  duration: {
    marginTop: 40,
  },

  durationText: {
    fontWeight: "600",
    fontSize: 20,
  },
});
