import { Clipboard, Image, Linking, Platform, Pressable, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { changeActivationState } from './api/RiderApi';
import { deleteDeliveryRequest, getDeliveryRequests } from './api/DeliveryRequestApi';
import SendIntentAndroid from 'react-native-send-intent';
import { YellowBox } from 'react-native-web';


export default function App() {

  const localImage = Image.resolveAssetSource(require('./assets/my-location-marker.png')).uri;
  const [location, setLocation] = useState(null); // 내 주소를 기본 값으로
  const [errorMsg, setErrorMsg] = useState(null);
  const [activationText, setActivationText] = useState("활성화");
  const [activationState, setActivationState] = useState("현재 오프라인 상태입니다.");
  const [deliveryRequests, setDeliveryRequests] = useState(null);
  const [mapHtml, setMapHtml] = useState("");
  const [orderedItem, setOrderedItem] = useState(null);
  const [activationButtonDisabled, setActivationButtonDisabled] = useState(false);
  const [naviHtml, setNaviHtml] = useState(null);
  const [deliveryButtonText, setDeliveryButtonText] = useState("이동하시겠습니까?");


  const onShouldStartLoadWithRequest = (event) => {
    const { url } = event;
  
    if (Platform.OS === 'android' && url.includes('intent')) {
      console.log("Android intent detected:", url);
  
      const fallbackURL = url.split('S.browser_fallback_url=')[1]?.split(';')[0];
      console.log("Fallback URL:", fallbackURL);
  
      Linking.canOpenURL((url))
        .then((supported) => {
          if (supported) {
            console.log("Opening intent URL:", url);
            return Linking.openURL((url));
          } else if (fallbackURL) {
            console.log("Intent not supported, opening fallback URL:", fallbackURL);
            return Linking.openURL(decodeURIComponent(fallbackURL));
          } else {
            ToastAndroid.show('앱 실행에 실패했습니다.', ToastAndroid.SHORT);
            console.log("No fallback URL available.");
          }
        })
        .catch((err) => {
          console.error("Error opening URL:", err);
        });
  
      return false;
    } else {
      Linking.openURL(url).catch(err => {
        alert('앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.');
        console.error("Error opening URL:", err);
      });
  
      return false;
    }
  };





  const setCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    // console.log(status);
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    setLocation(currentLocation);
  };

  const clickOnActivationButton = async () => {
    if (activationText === "활성화") {
      setActivationText("비활성화");
      setActivationState("현재 온라인 상태입니다.");
      await changeActivationState(46, "on");
      const res = await getDeliveryRequests(46, {latitude: location.coords.latitude, longitude: location.coords.longitude});
      setDeliveryRequests(res);
    } else {
      setActivationText("활성화")
      setActivationState("현재 오프라인 상태입니다.");
      await changeActivationState(46, "off");
      setDeliveryRequests(null);
    };
  };

  const generateMapHtml = () => {
    console.log(location);
    if (location) {
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
          
          const KakaoMap = () => {
            const mapContainer = document.getElementById('map');
            const locPosition = new kakao.maps.LatLng(${location.coords.latitude}, ${location.coords.longitude});  
            const mapOption = {
              center: locPosition,
              level: 6,
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);
            
            if (${JSON.stringify(deliveryRequests)} && ${JSON.stringify(deliveryRequests)}.length > 0) {
              for (const req of ${JSON.stringify(deliveryRequests)}) {
                const iwContent = '<div style="padding:5px; width:100%";>' + req.storeName + '<br>' + req.deliveryPay + '원<br>' + req.distanceFromStoreToRider + 'km</div>' // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
                const markerPosition = new kakao.maps.LatLng(req.storeLatitude, req.storeLongitude); //인포윈도우 표시 위치입니다
                // 마커를 생성합니다
                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                    clickable: true
                });
                // 마커가 지도 위에 표시되도록 설정합니다
                marker.setMap(map);
                const infowindow = new kakao.maps.InfoWindow({
                    position : markerPosition, 
                    content : iwContent 
                });
                infowindow.open(map, marker);
                
                kakao.maps.event.addListener(marker, 'click', function() {
                  // 마커 위에 인포윈도우를 표시합니다
                  if (confirm("배달 신청하시겠습니까?")) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(req));
                  };
                });
              };
            };
            const imageSrc = '${localImage}', // 마커이미지의 주소입니다    
              imageSize = new kakao.maps.Size(53, 50), // 마커이미지의 크기입니다
              imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                
            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
                markerPosition = new kakao.maps.LatLng(${location.coords.latitude}, ${location.coords.longitude}); // 마커가 표시될 위치입니다
            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                position: markerPosition, 
                image: markerImage // 마커이미지 설정 
            });
            marker.setMap(map);
          };
          KakaoMap();
          // return <div id="map" style={{width:"100vw", height:"100vh"}}></div>

          // ReactDOM.render(<KakaoMap />, document.getElementById('root'));
        </script>
      </body>
      </html>
      `;
    };
  };

  const turnOnNavi = () => {
    // console.log("내비게이션 on");
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Kakao JavaScript SDK</title>
        <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4" crossorigin="anonymous">
        </script>
        <script>
          Kakao.init('a6546188cab40bea0d30c30a1d2c578d'); // 사용하려는 앱의 JavaScript 키 입력
          console.log(Kakao.isInitialized());
        </script>
      </head>
      <body>
        <a id="start-navigation" href="javascript:startNavigation()">
          <img src="https://developers.kakao.com/assets/img/about/buttons/navi/kakaonavi_btn_medium.png"
            alt="길 안내하기 버튼" />
        </a>
        <script>
          function startNavigation() {
            Kakao.Navi.start({
              name: '현대백화점 판교점',
              x: 127.11205203011632,
              y: 37.39279717586919,
              coordType: 'wgs84',
            });
          }
        </script>
      </body>
    </html>
    `;
  };

  
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      // console.log(status);
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      // console.log(currentLocation);
      setLocation(currentLocation); 
    })();
  }, []);
  
  useEffect(() => {
    setMapHtml(generateMapHtml());
    // console.log(mapHtml);
  }, [location, deliveryRequests]);  

  // useEffect(() => {
  //   setNaviHtml(turnOnNavi());
  //   // console.log(mapHtml);
  // }, [naviHtml]);  


  const handleMessage = (event) => {
    console.log(event);
    setActivationButtonDisabled(true);
    setOrderedItem(JSON.parse(event.nativeEvent.data));
    console.log(event.nativeEvent.data);
    setDeliveryRequests(null);
  };

  const updateDeliveryState = async () => {
    if (deliveryButtonText === "이동하시겠습니까?") setDeliveryButtonText("픽업 완료 & 배달 시작");
    else if (deliveryButtonText === "픽업 완료 & 배달 시작") {
      setDeliveryButtonText("배달 완료"); 
      // 주문 상태 -> 배달 시작으로 업데이트 필요 (주문 도메인에서)
      
    } 
    else {
      // 배달 완료 건은 redis에서 삭제 및 postgres에 저장
      console.log(orderedItem.deliveryRequestId);
      await deleteDeliveryRequest(orderedItem.deliveryRequestId);
      // 주문 수락 건 창 끄고 기본값으로 세팅
      setOrderedItem(null);
      setDeliveryButtonText("이동하시겠습니까?");
      // 비활성화 버튼 다시 활성화
      setActivationButtonDisabled(false);
      // 주문 상태 -> 배달 완료로 업데이트 필요 (주문 도메인에서)
      


      // 다시 요청 목록 띄워줌
      const res = await getDeliveryRequests(46, {latitude: location.coords.latitude, longitude: location.coords.longitude});
      setDeliveryRequests(res);
    };
  };

  const copyToClipboard = () => {
    Clipboard.setString(orderedItem.storeAddress);
  };
  

  return (
    <View style={styles.webviewContainer}>
      <WebView
          style={styles.webview}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          onMessage={handleMessage}
        />
      
      <TouchableOpacity style={styles.menu}>
        <Text style={styles.menuText}>☰</Text>
      </TouchableOpacity >
      <View style={styles.amount}>
        <Text style={styles.amountText}>30000원</Text>
      </View>
      <TouchableOpacity style={styles.gps} onPress={setCurrentLocation}>
        <Text style={styles.gpsText}>➤</Text>
      </TouchableOpacity>
      {orderedItem && activationText === "비활성화" && 
      <View style={styles.orderedItem}>
        <View style={styles.copyContainer}>
          <Text style={styles.orderedItemTitle}>수락한 가게 정보를 안내 드려요</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.copyText}>주소 복사</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.orderedItemContents}>{orderedItem.storeName}</Text>
        <Text style={styles.orderedItemContents}>{orderedItem.storeAddress}</Text>
        <TouchableOpacity style={styles.orderedItemButton} onPress={updateDeliveryState}>
          <Text style={styles.orderedItemButtonText}>{deliveryButtonText}</Text>
        </TouchableOpacity>
        {/* <WebView source={{ html: turnOnNavi()}} originWhitelist={['*']} onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}/> */}
      </View>
      }
      <TouchableOpacity style={styles.activationButton} onPress={clickOnActivationButton} disabled={activationButtonDisabled}>
        <Text style={styles.activationText}>{activationText}</Text>
      </TouchableOpacity>
      <Text style={styles.activationState}>{activationState}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  copyContainer: {
    flexDirection: "row",
    columnGap: 20,
    justifyContent: 'space-between'
  },
  
  copyButton: {
    // marginTop: 10,
    borderRadius: 50,
    padding: 10,
    backgroundColor: "#94D35C",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },

  copyText: {
    fontSize: 12,
    fontWeight: '600'
  },

  webviewContainer: {
    flex: 1
  },

  
  webview: {
    marginTop: 18,
    flex: 1
  },
  
  menu: {
    position: "absolute",
    top: "5%",
    left: "5%",
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: "#94D35C",
    justifyContent: "center",
    alignItems: "center",
  },

  menuText: {
    fontSize: 30
  },

  amount: {
    alignSelf: "center",
    position: "absolute",
    top: "5%",
    borderRadius: 20,
    width: 120,
    height: 50,
    backgroundColor: "#94D35C",
    justifyContent: "center",
    alignItems: "center"
  },

  amountText: {
    fontSize: 20
  },

  gps: {
    position: "absolute",
    top: "5%",
    left: "80%",
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: "#94D35C",
    justifyContent: "center",
    alignItems: "center",
  },

  gpsText: {
    fontSize: 20
  },

  
  orderedItem: {
    position: "absolute",
    top: "15%",
    left: "5%",
    borderRadius: 20,
    width: "89%",
    // height: 90,
    backgroundColor: "#94D35C",
    padding: 15,
    backgroundColor: "rgba(73, 195, 247, 0.8)",

  },

  orderedItemTitle: {
    fontSize: 15,
    marginBottom: 5,
  },

  orderedItemContents: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: '600'
  },

  orderedItemButton: {
    marginTop: 10,
    borderRadius: 50,
    padding: 10,
    backgroundColor: "#94D35C",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },

  orderedItemButtonText: {
    fontSize: 15,
    fontWeight: '600'
  },

  activationButton: {
    alignSelf: "center",
    position: "absolute",
    top: "78%",
    borderRadius: 50,
    width: 90,
    height: 90,
    backgroundColor: "#94D35C",
    justifyContent: "center",
    alignItems: "center",
  },

  activationText: {
    fontSize: 20
  },

  activationState: {
    marginTop: 0,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#94D35C",
    textAlign: "center",
    fontSize: 20
  }
});