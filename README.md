# 🏍️ 와구와구 배달 기사 앱

### 👤 담당자 : 조진호

## <br> 📃 핵심 기능

### 배달 기사 계정 관리 / 배달 건 수락, 시작, 완료 / 배달 내역 확인

- 배달 기사 계정 관리
- 지도 구현 (카카오맵 API 사용)
- 현재 위치로 이동
- 계정 활성화 버튼
- 가게별, 배달 건 별 수락 기능
- 배달 수락 후 배달 상태(시작, 완료) 업데이트
- 오늘 배달 수익 확인
- 날짜별 배달 요약 내역(배달 횟수, 배달 총 수익, 요일) 확인
- 배달 내역 최신 순, 오래된 순 정렬 및 기간 설정 기능
- 특정 날짜의 배달 상세 내역(배달 시간, 가게명, 수익) 확인

## <br> ⚙️ 기술스택

#### ✔️ 프론트엔드  
![react](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![expo](https://img.shields.io/badge/expo-000020?style=for-the-badge&logo=expo&logoColor=white)  

## <br>🏷️ 전체 프로젝트 링크
https://github.com/WAGUWAGUUU/WAGUWAGU

## <br>📃 화면 구성 및 기능 소개 (Video)

https://github.com/user-attachments/assets/28ee3ba9-a452-4219-afd1-1b09f6ba4344

## <br>🧾 배달 시퀀스 다이어그램

<img width="1057" alt="image" src="https://github.com/user-attachments/assets/12e40015-f39e-41e6-8f31-6e4a4e5eec0b">




## <br>🔧 트러블 슈팅

**1. WebView와 react native간 데이터 교환 불가<br><br>**
> * 원인 : Webview는 React native와 별개의 환경에서 동작하기 때문에 서로 데이터 이동을 위한 전달 매개체가 필요했다.<br><br>
> * 해결 : WebView component의 "onMessage" 와 "injectedJavaScript" property를 통해 데이터 교환
> 1) onMessage property 사용법
> ```reactnative
>  // onMessage property 설정
> <WebView
>          ref={webviewRef}
>          style={styles.webview}
>          originWhitelist={["*"]}
>          source={{ html: mapHtml }}
>          onMessage={handleMessage}
>          injectedJavaScript={changeLocation}
>          onLoadEnd={() => setLoading(false)}
>        />
>
> ...
>
> // event.nativeEvent.data 를 통해 받음 @ React native 
>  const handleMessage = (event) => {
>    console.log(event);
>    Alert.alert(
>      JSON.parse(event.nativeEvent.data).storeName,
>      "\n수락 후에는 취소할 수 없습니다.\n배달 수락하시겠습니까?",
>      [
>        {
>          text: "취소",
>          onPress: () => console.log("배달 수락이 취소되었습니다"),
>        },
>        { text: "수락", onPress: () => assignRider(event) },
>      ]
>    );
>  };
>
> ...
> 
> // window.ReactNativeWebView.postMessage 를 통해 보냄 @ WebView
> function onClick(requestIndex) {
>   window.ReactNativeWebView.postMessage(JSON.stringify(${JSON.stringify(deliveryRequests)}[requestIndex]));
> }
>
> ```
>
> 2) injectedJavaScript property 사용법
> ```reactnative
> // ref 및 injectedJavaScript property 설정 @ React native
> <WebView
>        ref={webviewRef}
>        style={styles.webview}
>        originWhitelist={["*"]}
>        source={{ html: mapHtml }}
>        injectedJavaScript={setMarkerPosition}
>        onLoadEnd={() => setLoading(false)}
>      />
> }
>
> ...
>
> // WebView instance 만들기 @ React native 
> const webviewRef = useRef(null);
>
> ...
> 
> // WebView에 넣을 javascript code를 만들어줌 @ React native 
>  const setMarkerPosition = `
>      (function() {
>        riderMarker.setPosition(new kakao.maps.LatLng(${riderLocation.latitude}, ${riderLocation.longitude}));
>        customOverlayForRider.setPosition(new kakao.maps.LatLng(${riderLocation.latitude}, ${riderLocation.longitude}));
>      })();
>    `;
> 
> ...
>
> // WebView instance를 사용하여 javascript code 주입 @ React native 
>  useEffect(() => {
>    if (webviewRef.current)
>      webviewRef.current.injectJavaScript(setMarkerPosition);
>  }, [riderLocation]);
> ```

**<br>2. useState값을 변경할 때마다 지도 re-rendering 발생 (미해결) <br><br>**
> * 추정 원인 : WebView에서 사용하고 있는 react native의 useState값은 한 번 값이 설정되면, 그 값이 고정되는 것으로 추정<br><br>
> * 취한 Action : injectedJavaScript를 통해 변경 값을 주입하였으나 변경되지 않음<br><br>
> * 추후 Action : 지도 위에 마커를 표시해주는 코드를 전부 injectedJavascript를 통해 주입 (기존에는 특정 변수 값만 변경 시도)
