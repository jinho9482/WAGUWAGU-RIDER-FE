import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "react-native-ui-datepicker";
import DeliveryHistoryHeader from "../components/DeliveryHistoryHeader";
import DeliveryHistorySummaryContents from "../components/DeliveryHistorySummaryContents";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDeliveryHistoriesByRiderId } from "../api/DeliveryHistory";
import { getHistorySummaryByHistoryId } from "../api/DeliveryHistoryDetail";
import { useRecoilState } from "recoil";
import { navigationState } from "../atom/navigation";

const DeliveryHistory = ({ navigation }) => {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 3))
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 3))
  );
  const [displayStartDate, setDisplayStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 3))
  );
  const [displayEndDate, setDisplayEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 3))
  );
  const [showCalender, setShowCalendar] = useState(false);
  const [latest, setLatest] = useState("sortSettingBoxClicked");
  const [oldest, setOldest] = useState(null);

  const [deliveryHistories, setDeliveryHistories] = useState([]);
  const [filteredDeliveryHistories, setFilteredDeliveryHistories] = useState(
    []
  );
  const [recoilNavigation, setRecoilNavigation] =
    useRecoilState(navigationState);

  const getDeliveryHistories = async () => {
    const riderId = await AsyncStorage.getItem("riderId");
    const res = await getDeliveryHistoriesByRiderId(riderId);
    const arr = [];
    for (let history of res) {
      const summary = await getHistorySummaryByHistoryId(
        history.deliveryHistoryId
      );
      arr.push({
        ...history,
        deliveryCount: summary.deliveryCount,
        deliveryTotalIncome: summary.deliveryTotalIncome,
      });
    }
    setDeliveryHistories(arr);
    return arr;
  };

  const initCondition = async () => {
    const originalHistories = await getDeliveryHistories();
    console.log(
      "\n************** Original histories from initCondition*****************\n",
      originalHistories,
      "\n*********************************************************************\n"
    );
    const filteredHistories = filterDuration(originalHistories);
    console.log(
      "\n************** filtered histories from initCondition*****************\n",
      filteredHistories,
      "\n*********************************************************************\n"
    );
    const sortedHistories = sortLatestFirst(filteredHistories);
    console.log(
      "\n************** sorted Histories from initCondition*****************\n",
      sortedHistories,
      "\n********************************************************************\n"
    );
  };

  const refreshHistories = async () => {
    const originalHistories = await getDeliveryHistories();
    console.log(
      "\n************** Original histories from refreshHistories*****************\n",
      originalHistories,
      "\n*********************************************************************\n"
    );
    console.log(startDate);
    console.log(endDate);
    const filteredHistories = filterDuration(originalHistories);
    console.log(
      "\n************** filtered histories from refreshHistories*****************\n",
      filteredHistories,
      "\n*********************************************************************\n"
    );
    console.log(latest);
    if (latest) sortLatestFirst(filteredHistories);
    else sortOldestFirst(filteredHistories);
  };

  const setCondition = () => {
    if (startDate && endDate) {
      setDisplayStartDate(startDate);
      setDisplayEndDate(endDate);
      setShowCalendar(false);
      const filteredHistories = filterDuration(deliveryHistories);
      if (latest) sortLatestFirst(filteredHistories);
      else sortOldestFirst(filteredHistories);
    } else Alert.alert("알람", "시작과 끝 날짜를 선택해주세요");
  };

  const sortLatestFirst = (histories) => {
    const sortedHistories = histories.sort(
      (a, b) =>
        new Date(b.deliveryHistoryCreatedAt) -
        new Date(a.deliveryHistoryCreatedAt)
    );
    setFilteredDeliveryHistories(sortedHistories);
    return sortedHistories;
  };

  const sortOldestFirst = (histories) => {
    const sortedHistories = histories.sort(
      (a, b) =>
        new Date(a.deliveryHistoryCreatedAt) -
        new Date(b.deliveryHistoryCreatedAt)
    );
    setFilteredDeliveryHistories(sortedHistories);
    return sortedHistories;
  };

  const filterDuration = (histories) => {
    const arr = [];
    histories.forEach((history) => {
      const createdAt = new Date(history.deliveryHistoryCreatedAt);
      if (createdAt >= startDate && createdAt <= endDate) arr.push(history);
    });
    // setFilteredDeliveryHistories(arr);
    return arr;
  };

  const setSortButtonLatest = () => {
    setLatest("sortSettingBoxClicked");
    setOldest(null);
  };

  const setSortButtonOldest = () => {
    setLatest(null);
    setOldest("sortSettingBoxClicked");
  };

  useEffect(() => {
    initCondition();
    if (navigation) {
      setRecoilNavigation(navigation);
    }
  }, []);

  return (
    <View>
      <DeliveryHistoryHeader title="배달 내역 확인" />

      <View style={styles.main}>
        <View style={styles.duration}>
          <Text style={styles.durationText}>
            {displayStartDate &&
              displayEndDate &&
              new Date(displayStartDate).toLocaleDateString().substring(2) +
                "  ~  " +
                new Date(displayEndDate).toLocaleDateString().substring(2)}{" "}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.filterSetting}
          onPress={() => setShowCalendar(!showCalender)}
        >
          <Text style={styles.filterButtonText}>설정</Text>
        </TouchableOpacity>

        <DeliveryHistorySummaryContents
          deliveryHistories={filteredDeliveryHistories}
          setDeliveryHistories={setFilteredDeliveryHistories}
          refreshHistories={refreshHistories}
          // startDate={startDate}
          // endDate={endDate}
          // latest={latest}
          // oldest={oldest}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCalender}
          onRequestClose={() => setShowCalendar(!showCalender)}
          style={styles.modal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <View style={styles.durationSetting}>
                <Text style={styles.durationSettingText}>기간 설정</Text>
              </View>
              <View style={styles.datePicker}>
                <DateTimePicker
                  locale="kr"
                  mode="range"
                  startDate={startDate}
                  endDate={endDate}
                  onChange={({ startDate, endDate }) => {
                    setStartDate(startDate);
                    setEndDate(endDate);
                  }}
                />
              </View>
              <View style={styles.durationSetting}>
                <Text style={styles.durationSettingText}>정렬 기준</Text>
              </View>
              <View style={styles.sortSetting}>
                <TouchableOpacity
                  style={[styles.sortSettingBox, styles[latest]]}
                  onPress={setSortButtonLatest}
                >
                  <Text style={styles.sortSettingText}>최신 순</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sortSettingBox, styles[oldest]]}
                  onPress={setSortButtonOldest}
                >
                  <Text style={styles.sortSettingText}>오래된 순</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.settingButton}
                onPress={setCondition}
              >
                <Text style={styles.settingButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

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

  modalBackground: {
    marginTop: "auto",
    paddingBottom: 20,
    backgroundColor: "white",
    paddingHorizontal: 30,
  },

  modalBox: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  durationSetting: {
    marginVertical: 25,
    alignSelf: "flex-start",
  },

  durationSettingText: {
    fontSize: 18,
    fontWeight: "500",
  },

  datePicker: {
    height: 300,
    backgroundColor: "white",
  },

  filterSetting: {
    marginTop: 30,
    marginBottom: 20,
    width: 80,
    borderRadius: 20,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#EECAD5",
  },

  filterButtonText: {
    fontSize: 20,
  },

  sortSetting: {
    flexDirection: "row",
    width: "100%",
  },

  sortSettingBox: {
    flex: 1,
    borderColor: "black",
    borderStyle: "solid",
    borderWidth: 1,
    paddingVertical: 10,
  },

  sortSettingBoxClicked: {
    backgroundColor: "#EECAD5",
  },

  sortSettingText: {
    textAlign: "center",
    fontSize: 20,
  },

  settingButton: {
    marginTop: 20,
    width: "100%",
    borderRadius: 20,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EECAD5",
    alignSelf: "flex-end",
  },

  settingButtonText: {
    fontSize: 25,
    fontWeight: "500",
    paddingVertical: 2,
  },
});

export default DeliveryHistory;
