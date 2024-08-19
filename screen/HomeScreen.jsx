import {
  Alert,
  Image,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
// import Clipboard from '@react-native-clipboard/clipboard';
import WebView from "react-native-webview";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { changeActivationState } from "../api/Rider";
import {
  getDeliveryRequests,
  deleteDeliveryRequest,
  updateRiderAssigned,
} from "../api/DeliveryRequest";
import { updateOrderStateToRedis } from "../api/Order";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { deleteRiderLocation, saveRiderLocation } from "../api/RiderLocation";
import {
  createDeliveryHistory,
  getTodayDeliveryHistoryByRiderId,
} from "../api/DeliveryHistory";
import {
  createDeliveryHistoryDetail,
  getHistorySummaryByHistoryId,
} from "../api/DeliveryHistoryDetail";
import { ActivityIndicator } from "react-native-paper";

export default function HomeScreen({ navigation }) {
  // const localImage = "file:///assets/my-location-marker.png";
  // const localImage = require("../assets/my-location-marker.png").uri;
  const localImage = Image.resolveAssetSource(
    require("../assets/my-location-marker.png")
  ).uri;
  const [location, setLocation] = useState({
    coords: { latitude: 37.484918, longitude: 127.01629 },
  }); // 학원 주소를 기본 값으로
  const [errorMsg, setErrorMsg] = useState(null);
  const [activationText, setActivationText] = useState("활성화");
  const [activationState, setActivationState] =
    useState("현재 오프라인 상태입니다.");
  const [deliveryRequests, setDeliveryRequests] = useState(null);
  const [mapHtml, setMapHtml] = useState("");
  const [orderedItem, setOrderedItem] = useState(null);
  const [activationButtonDisabled, setActivationButtonDisabled] =
    useState(false);
  const [deliveryButtonText, setDeliveryButtonText] =
    useState("픽업 완료 & 배달 시작");

  const [intervalId, setIntervalId] = useState(null);
  const [deliveryIncome, setDeliveryIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deliveryIsDone, setDeliveryIsDone] = useState(null);
  const webviewRef = useRef(null);

  const setCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    // console.log(status);
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    const currentLocation = await getCurrentLocation();
    setLocation(currentLocation);
  };

  const getCurrentLocation = async () => {
    // 테스트
    const { status } = await Location.requestForegroundPermissionsAsync();
    // console.log(status);
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    // 원본
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return currentLocation;
  };

  const clickOnActivationButton = async () => {
    const riderId = await AsyncStorage.getItem("riderId");
    if (riderId) {
      if (activationText === "활성화") {
        setActivationText("비활성화");
        setActivationState("현재 온라인 상태입니다.");
        await changeActivationState(riderId, "on");

        // 원본
        // const currentLocation = await getCurrentLocation();
        // const res = await getDeliveryRequests(riderId, {
        //   latitude: currentLocation.coords.latitude,
        //   longitude: currentLocation.coords.longitude,
        // });

        // 집에서 하는 용
        const currentLocation = {
          coords: { latitude: 37.484918, longitude: 127.01629 },
        };
        const res = await getDeliveryRequests(riderId, {
          latitude: 37.484918,
          longitude: 127.01629,
        });

        setDeliveryRequests(res);
        setLocation(currentLocation);
      } else {
        setActivationText("활성화");
        setActivationState("현재 오프라인 상태입니다.");
        await changeActivationState(riderId, "off");
        setDeliveryRequests(null);
      }
    }
  };

  const generateMapHtml = () => {
    if (location) {
      // console.log(location, "mapHtml 렌더링");
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
          <title>Kakao 지도 시작하기</title>
          <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=a6546188cab40bea0d30c30a1d2c578d&libraries=services"></script>
        </head>
        <body>
          <div id="map" style="width:100%;height:100vh;"></div>
          <script>
              const mapContainer = document.getElementById('map');
              const locPosition = new kakao.maps.LatLng(${
                location.coords.latitude
              }, ${location.coords.longitude});  
              const mapOption = {
                center: locPosition,
                level: 6,
              };
              
              const map = new kakao.maps.Map(mapContainer, mapOption);
              
              // if (${activationText} === "비활성화") {
              //     kakao.maps.event.addListener(map, 'dragend', function() {
              //         window.ReactNativeWebView.postMessage("배달 목록 갱신");    
              //     });
              // }
              
              // 지도를 드래그하고 놓았을 때 (이동), 이동한 위치를 중심으로 deliveryRequests를 갱신하고 새로 렌더링 한다.
              // debug : deliveryRequest가 없다면 영원히 드래그해도 새 것을 가져오지 않음
              
              
              if (${JSON.stringify(deliveryRequests)} && ${JSON.stringify(
        deliveryRequests
      )}.length > 0) {
                  const storeAddressAndIndex = {}; // 가게 주소와 index를 넣음
                  const customOverlayName = []; // customOverlay 변수를 추가
                  let storeIndex = -1;
                  let requestIndex = -1;
                  for (const req of ${JSON.stringify(deliveryRequests)}) {
                  
                  requestIndex++;

                  function onClick(requestIndex) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(${JSON.stringify(
                      deliveryRequests
                    )}[requestIndex]));
                  }
                  
                  function closeOverlay(storeIndex) {
                    customOverlayName[storeIndex].setMap(null);     
                  }

                  if (storeAddressAndIndex[req.storeAddress] === undefined) { // 해당 가게 주소가 storeAddressAndIndex에 없다면,
                    storeIndex++;
                    storeAddressAndIndex[req.storeAddress] = storeIndex; // {조랭이네 : 0, 장꼬방 : 1, 짱구네 : 2}   

                    // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
                    const contentForRider = '<div style="padding:5px; width:fit-content; height:100%; background-color:white; border-radius:10px; border: 1px solid lightblue; box-shadow: 2px 2px 2px #60b6f7;">' + req.storeName + '<button style="margin-left: 10px; border: none; background-color: white;" onclick="closeOverlay(' + storeIndex + ')">❌</button><br>(' + req.distanceFromStoreToRider + 'km)<hr style="border-color:lightblue;">' + req.deliveryPay + '원<button style="margin-left: 10px; background-color:white; border: 1px solid skyblue; border-radius: 10px; box-shadow: 1px 1px 1px #60b6f7;" onclick="onClick(' + requestIndex + ')">수락</button></div>'

                    const markerPosition = new kakao.maps.LatLng(req.storeLatitude, req.storeLongitude); //인포윈도우 표시 위치입니다
                    // 마커를 생성합니다
                    const marker = new kakao.maps.Marker({
                        position: markerPosition,
                        clickable: true
                    });
                    // 마커가 지도 위에 표시되도록 설정합니다
                    marker.setMap(map);

                    customOverlayName[storeIndex] = new kakao.maps.CustomOverlay({
                      position: markerPosition,
                      content: contentForRider,
                      yAnchor: 1.5,
                    });

                    // customOverlayName[storeIndex].setMap(map);

                    kakao.maps.event.addListener(marker, 'click', function() {
                      customOverlayName[storeAddressAndIndex[req.storeAddress]].setMap(map);
                  });


                  } else {
                    const contentForRider = '<div style="margin-top: 8px">' + req.deliveryPay + '원<button style="margin-left: 10px; background-color:white; border: 1px solid skyblue; border-radius: 10px; box-shadow: 1px 1px 1px #60b6f7;" onclick="onClick(' + requestIndex + ')">수락</button></div></div>'
                    const originalContent = customOverlayName[storeAddressAndIndex[req.storeAddress]].getContent();
                    
                    const newContent = originalContent.substring(0, originalContent.length-6)  + contentForRider;
                
                    customOverlayName[storeAddressAndIndex[req.storeAddress]].setContent(newContent);
                  };               
                };
              };
              const imageSrc = '${localImage}', // 마커이미지의 주소입니다    
                imageSize = new kakao.maps.Size(53, 50), // 마커이미지의 크기입니다
                imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                  
              // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
              const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
                  markerPosition = new kakao.maps.LatLng(${
                    location.coords.latitude
                  }, ${location.coords.longitude}); // 마커가 표시될 위치입니다
              // 마커를 생성합니다
              const marker = new kakao.maps.Marker({
                  position: markerPosition, 
                  image: markerImage // 마커이미지 설정 
              });
              marker.setMap(map);          
          </script>
        </body>
        </html>
        `;
    }
  };

  const handleMessage = (event) => {
    console.log(event);
    Alert.alert(
      JSON.parse(event.nativeEvent.data).storeName,
      "\n수락 후에는 취소할 수 없습니다.\n배달 수락하시겠습니까?",
      [
        {
          text: "취소",
          onPress: () => console.log("배달 수락이 취소되었습니다"),
        },
        { text: "수락", onPress: () => assignRider(event) },
      ]
    );
  };

  const assignRider = async (event) => {
    // console.log(event);
    console.log(event);
    const nativeEventData = event.nativeEvent.data;
    const riderId = await AsyncStorage.getItem("riderId");

    // 화면 드래그 시, 배달 목록 갱신
    // if (nativeEventData === "배달 목록 갱신") {
    //   console.log("배달 목록 갱신");
    //   const newDeliveryRequests = await getDeliveryRequests(riderId, {
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude,
    //   });
    //   setDeliveryRequests(newDeliveryRequests);
    // }
    // 마커 눌렀을 때, 주문 도메인에 배달 수락 요청
    // else {
    const orderContents = JSON.parse(nativeEventData);
    console.log(orderContents, "주문 건");
    try {
      const res = await updateOrderStateToRedis(orderContents.orderId, {
        status: "배달 수락",
        riderId: riderId,
      });
      await updateRiderAssigned(orderContents.orderId);
      console.log("Redis에 assigned true로 변경 완료");
      setActivationButtonDisabled(true);
      setOrderedItem(orderContents);
      setDeliveryRequests(null);
    } catch (e) {
      Alert.alert(
        "요청 거절",
        "이미 배정이 완료되었습니다. 다른 요청건을 확인해주세요"
      );

      // 현재 위치 가져오기
      // 원본
      // const currentLocation = await getCurrentLocation();

      // 테스트
      const currentLocation = {
        coords: { latitude: 37.484918, longitude: 127.01629 },
      };

      // 요청 목록 갱신 필요
      const newDeliveryRequests = await getDeliveryRequests(riderId, {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setLocation(currentLocation);
      setDeliveryRequests(newDeliveryRequests);
    }
  };

  const updateDeliveryState = async () => {
    const riderId = await AsyncStorage.getItem("riderId");
    if (deliveryButtonText === "픽업 완료 & 배달 시작") {
      // 주문 상태 -> 배달 시작으로 업데이트 필요 (주문 도메인에서)
      await updateOrderStateToRedis(orderedItem.orderId, {
        status: "배달중",
        riderId: riderId,
      });
      setDeliveryButtonText("배달 완료");
      // 라이더 실시간 위치 매 1초마다 redis에 저장
      const refreshIntervalId = setInterval(() => {
        saveCurrentRiderLocation(riderId, orderedItem.orderId);
        console.log("실시간 위치 Redis에 저장 완료");
      }, 1000);
      setIntervalId(refreshIntervalId);
      console.log(refreshIntervalId);
    } else if (deliveryButtonText === "배달 완료") {
      // 라이더 실시간 위치 공유 종료
      clearInterval(intervalId);
      console.log("실시간 위치 공유 종료");
      setIntervalId(null);
      // 주문 상태 -> 배달 완료로 업데이트 필요 (주문 도메인에서)
      await updateOrderStateToRedis(orderedItem.orderId, {
        status: "배달 완료",
        riderId: riderId,
      });
      console.log("배달 완료 업데이트");
      await updateRiderAssigned(orderedItem.orderId);
      console.log("Redis에 assigned false로 변경 완료");
      // 라이더 위치 redis 에서 삭제
      await deleteRiderLocation(orderedItem.orderId);
      console.log("실시간 위치 redis에서 삭제 완료");
      // 주문 건 redis에서 삭제
      await deleteDeliveryRequest(orderedItem.deliveryRequestId); // 배정 완료됐다고 설정
      console.log("주문 건 redis에서 삭제 완료");
      // 배달 내역 생성
      const deliveryHistoryId = await createDeliveryHistory(riderId);
      console.log("배달 내역 생성");
      // 배달 상세 내역 생성
      const deliveryDetailRequest = {
        deliveryIncome: orderedItem.deliveryPay,
        storeName: orderedItem.storeName,
        orderId: orderedItem.orderId,
      };
      await createDeliveryHistoryDetail(
        deliveryHistoryId,
        deliveryDetailRequest
      );
      console.log("배달 상세 내역 생성 완료");
      // 오늘 수입 최신화
      setDeliveryIsDone({});
      // 주문 수락 건 창 끄고 기본값으로 세팅
      setOrderedItem(null);
      setDeliveryButtonText("픽업 완료 & 배달 시작");
      // 비활성화 버튼 다시 활성화
      setActivationButtonDisabled(false);
      // 현재 위치 가져오기
      const currentLocation = await getCurrentLocation();
      // 다시 요청 목록 띄워줌 (현재 위치 기준으로)
      // 원본
      // const newDeliveryRequests = await getDeliveryRequests(riderId, {
      //   latitude: currentLocation.coords.latitude,
      //   longitude: currentLocation.coords.longitude,
      // });

      // 테스트
      const newDeliveryRequests = await getDeliveryRequests(riderId, {
        latitude: 37.484918,
        longitude: 127.01629,
      });

      console.log("현재 위치 기준, 요청 목록 가져오기 완료");
      setDeliveryRequests(newDeliveryRequests);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(orderedItem.storeAddress);
  };

  const saveCurrentRiderLocation = async (riderId, orderId) => {
    const currentLocation = await getCurrentLocation();
    const req = {
      riderId: riderId,
      orderId: orderId,
      riderLatitude: currentLocation.coords.latitude,
      riderLongitude: currentLocation.coords.longitude,
    };
    await saveRiderLocation(req);
  };

  // useEffect(() => {
  //   setCurrentLocation();
  // }, []);

  const changeLocation = `
      (function(){
        map.setCenter(new kakao.maps.LatLng(${location.coords.latitude}, ${location.coords.longitude}));
        map.setLevel(6, {animate: true});
        marker.setPosition(new kakao.maps.LatLng(${location.coords.latitude}, ${location.coords.longitude}));
      })();
      `;

  const getTodayDeliveryHistory = async () => {
    const riderId = await AsyncStorage.getItem("riderId");
    console.log(riderId);
    const res = await getTodayDeliveryHistoryByRiderId(riderId);
    if (res === null) {
      setDeliveryIncome(0);
    } else {
      const summary = await getHistorySummaryByHistoryId(res.deliveryHistoryId);
      setDeliveryIncome(summary.deliveryTotalIncome);
    }
  };

  useEffect(() => {
    setMapHtml(generateMapHtml());
  }, [deliveryRequests]);

  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(changeLocation);
    }
  }, [location]);

  useEffect(() => {
    getTodayDeliveryHistory();
  }, [deliveryIsDone]);

  return (
    <>
      {/* <StatusBar backgroundColor="#EECAD5" barStyle="dark-content" /> */}
      <View style={styles.webviewContainer}>
        {loading && (
          <ActivityIndicator size="20" color="#EECAD5" style={styles.loading} />
        )}
        <WebView
          ref={webviewRef}
          style={styles.webview}
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          onMessage={handleMessage}
          injectedJavaScript={changeLocation}
          onLoadEnd={() => setLoading(false)}
        />
        <TouchableOpacity
          style={styles.menu}
          onPress={() => navigation.openDrawer()}
        >
          <Text style={styles.menuText}>☰</Text>
        </TouchableOpacity>
        <View style={styles.amount}>
          <Text style={styles.amountText}>{deliveryIncome}원</Text>
        </View>
        <TouchableOpacity style={styles.gps} onPress={setCurrentLocation}>
          <Text style={styles.gpsText}>➤</Text>
        </TouchableOpacity>
        {orderedItem && activationText === "비활성화" && (
          <View style={styles.orderedItem}>
            <View style={styles.copyContainer}>
              <Text style={styles.orderedItemTitle}>
                수락한 가게 정보를 안내 드려요
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={copyToClipboard}
              >
                <Text style={styles.copyText}>주소 복사</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.orderedItemContents}>
              {orderedItem.storeName}
            </Text>
            <Text style={styles.orderedItemContents}>
              {orderedItem.storeAddress}
            </Text>
            <Text style={styles.orderId}>
              주문 번호 : {orderedItem.orderId}
            </Text>
            {/* <Text style={[styles.orderedItemTitle, { fontWeight: "600" }]}>
              (픽업하실 때 영수증의 주문 번호와 맞는지 확인해주세요)
            </Text> */}
            <TouchableOpacity
              style={styles.orderedItemButton}
              onPress={updateDeliveryState}
            >
              <Text style={styles.orderedItemButtonText}>
                {deliveryButtonText}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          style={styles.activationButton}
          onPress={clickOnActivationButton}
          disabled={activationButtonDisabled}
        >
          <Text style={styles.activationText}>{activationText}</Text>
        </TouchableOpacity>
        <Text style={styles.activationState}>{activationState}</Text>
        {/* <WebView style={styles.kakaoNavi} source={{ html: turnOnNavi()}} originWhitelist={['*']} onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}/> */}
      </View>
    </>
  );
}
//
const styles = StyleSheet.create({
  copyContainer: {
    flexDirection: "row",
    columnGap: 20,
    justifyContent: "space-between",
  },

  copyButton: {
    // marginTop: 10,
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  copyText: {
    fontSize: 13,
    fontWeight: "600",
  },

  webviewContainer: {
    flex: 1,
  },

  loading: {
    justifyContent: "center",
    alignSelf: "center",
  },

  webview: {
    marginTop: -10,
    marginHorizontal: -10,
    flex: 1,
  },

  menu: {
    position: "absolute",
    top: "5%",
    left: "5%",
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: "#EECAD5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  menuText: {
    fontSize: 30,
  },

  amount: {
    alignSelf: "center",
    position: "absolute",
    top: "5%",
    borderRadius: 20,
    width: 120,
    height: 50,
    backgroundColor: "#EECAD5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  amountText: {
    fontSize: 20,
  },

  gps: {
    position: "absolute",
    top: "5%",
    left: "80%",
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: "#EECAD5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  gpsText: {
    fontSize: 20,
  },

  orderedItem: {
    position: "absolute",
    top: "15%",
    left: "5%",
    borderRadius: 20,
    width: "89%",
    padding: 15,
    backgroundColor: "#94d8ff",
  },

  orderedItemTitle: {
    fontSize: 15,
    marginBottom: 5,
  },

  orderedItemContents: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "600",
  },

  orderId: {
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "600",
  },

  orderedItemButton: {
    marginTop: 10,
    borderRadius: 50,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  orderedItemButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  activationButton: {
    alignSelf: "center",
    position: "absolute",
    top: "78%",
    borderRadius: 50,
    width: 90,
    height: 90,
    backgroundColor: "#EECAD5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  activationText: {
    fontSize: 20,
  },

  activationState: {
    marginTop: 0,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#EECAD5",
    textAlign: "center",
    fontSize: 20,
  },
});
