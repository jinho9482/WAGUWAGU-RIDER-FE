import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import KakaoMap from './components/KakaoMap';
import WebView from 'react-native-webview';
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { changeActivationState } from './api/RiderApi';
import { getDeliveryRequests } from './api/DeliveryRequest';



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
      setActivationText("비활성화")
      setActivationState("현재 온라인 상태입니다.");
      await changeActivationState(46, "on");
      const res = await getDeliveryRequests(46, {latitude: location.coords.latitude, longitude: location.coords.longitude});
      setDeliveryRequests(res);
    } else {
      setActivationText("활성화")
      setActivationState("현재 오프라인 상태입니다.");
      await changeActivationState(46, "off");
      setDeliveryRequests(null);
    }
  };

  const generateMapHtml = () => {
    if (location) {
      return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" name="viewport" content="width=device-width, initial-scale=1">
        <title>Kakao 지도 시작하기</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=a6546188cab40bea0d30c30a1d2c578d&libraries=services"></script>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          const { useEffect, useState } = React;
          
          const KakaoMap = () => {
            const [kakaoMap, setKakaoMap] = useState(null);    
            
            useEffect(() => {
              const mapContainer = document.getElementById('map');
              const locPosition = new kakao.maps.LatLng(${location.coords.latitude}, ${location.coords.longitude});  
              const mapOption = {
                center: locPosition,
                level: 3,
              };
              setKakaoMap(new kakao.maps.Map(mapContainer, mapOption)); 
            }, []);
            
            

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
                marker.setMap(kakaoMap);
                const infowindow = new kakao.maps.InfoWindow({
                    position : markerPosition, 
                    content : iwContent 
                });
                infowindow.open(kakaoMap, marker);
                
                kakao.maps.event.addListener(marker, 'click', function() {
                  // 마커 위에 인포윈도우를 표시합니다
                  if (confirm("배달 신청하시겠습니까?")) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(req));
                  }
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
            marker.setMap(kakaoMap);
            return <div id="map" style={{width:"100vw", height:"100vh"}}></div>
          };
          

          ReactDOM.render(<KakaoMap />, document.getElementById('root'));
        </script>
      </body>
      </html>
      `;
    };
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
      console.log(currentLocation);
      setLocation(currentLocation); 
    })();
  }, []);
  
  useEffect(() => {
    setMapHtml(generateMapHtml());
  }, [location, deliveryRequests]);  


  const handleMessage = (event) => {
    console.log(event);
    setActivationButtonDisabled(true);
    setOrderedItem(JSON.parse(event.nativeEvent.data));
  };

  return (
    <View style={styles.webviewContainer}>
      <WebView
          style={styles.webview}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          onMessage={handleMessage}
        />
      <Pressable style={styles.menu}>
        <Text style={styles.menuText}>☰</Text>
      </Pressable>
      <View style={styles.amount}>
        <Text style={styles.amountText}>30000원</Text>
      </View>
      <Pressable style={styles.gps} onPress={setCurrentLocation}>
        <Text style={styles.gpsText}>➤</Text>
      </Pressable>
      {orderedItem && activationText === "비활성화" && 
      <View style={styles.orderedItem}>
        <Text style={styles.orderedItemTitle}>수락한 가게 정보를 안내 드려요</Text>
        <Text style={styles.orderedItemContents}>{orderedItem.storeName}</Text>
        <Text style={styles.orderedItemContents}>{orderedItem.storeAddress}</Text>
        <Pressable style={styles.orderedItemButton}>
          <Text style={styles.orderedItemButtonText}>이동하시겠습니까?</Text>
        </Pressable>
      </View>
      }
      <Pressable style={styles.activationButton} onPress={clickOnActivationButton} disabled={activationButtonDisabled}>
        <Text style={styles.activationText}>{activationText}</Text>
      </Pressable>
      <Text style={styles.activationState}>{activationState}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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