# 🏍️ WaguWagu Delivery Rider App

### 👤 Manager : Jinho Jo

## <br> 📃 Core Features

### Manage Delivery Rider Accounts / Accept, Start, Complete Deliveries / View Delivery History

- Manage delivery rider accounts
- Map implementation (using Kakao Map API)
- Move to current location
- Account activation button
- Accept deliveries by store and order
- Update delivery status (start, complete) after acceptance
- Check today's delivery earnings
- View delivery summary by date (number of deliveries, total earnings, day of the week)
- Sort delivery history by newest, oldest, and set a custom date range
- View detailed delivery history for a specific date (delivery time, store name, earnings)

## <br> ⚙️ Key skills

#### ✔️ Frontend
![react](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![expo](https://img.shields.io/badge/expo-000020?style=for-the-badge&logo=expo&logoColor=white)  

## <br>🏷️ Project Link
https://github.com/WAGUWAGUUU/WAGUWAGU

## <br>📃 Screens and Features Overview (Video)

https://github.com/user-attachments/assets/28ee3ba9-a452-4219-afd1-1b09f6ba4344

## <br>🧾 Delivery Sequence Diagram
<img width="1057" alt="image" src="https://github.com/user-attachments/assets/12e40015-f39e-41e6-8f31-6e4a4e5eec0b">




## <br>🔧 Troubleshooting

**1. Unable to exchange data between WebView and React Native<br><br>**
> * Cause: WebView operates in a separate environment from React Native, requiring a communication bridge for data exchange.<br><br>
> * Solution: Use the onMessage and injectedJavaScript properties of the WebView component for data exchange:
> 1) Using the onMessage property:
> ```reactnative
>  // Set up onMessage property
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
> // Receive data via event.nativeEvent.data in React Native
>  const handleMessage = (event) => {
>    console.log(event);
>    Alert.alert(
>      JSON.parse(event.nativeEvent.data).storeName,
>      "\nOnce accepted, it cannot be canceled.\nDo you want to accept the delivery?",
>      [
>        {
>          text: "Cancel",
>          onPress: () => console.log("Delivery acceptance canceled"),
>        },
>        { text: "Accept", onPress: () => assignRider(event) },
>      ]
>    );
>  };
>
> ...
> 
> // Send data from WebView using window.ReactNativeWebView.postMessage
> function onClick(requestIndex) {
>   window.ReactNativeWebView.postMessage(JSON.stringify(${JSON.stringify(deliveryRequests)}[requestIndex]));
> }
>
> ```
>
> 2) Using the injectedJavaScript property:
> ```reactnative
> // Set up ref and injectedJavaScript property in React Native
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
> // Create a WebView instance in React Native
> const webviewRef = useRef(null);
>
> ...
> 
> // Create JavaScript code to inject into WebView in React Native
>  const setMarkerPosition = `
>      (function() {
>        riderMarker.setPosition(new kakao.maps.LatLng(${riderLocation.latitude}, ${riderLocation.longitude}));
>        customOverlayForRider.setPosition(new kakao.maps.LatLng(${riderLocation.latitude}, ${riderLocation.longitude}));
>      })();
>    `;
> 
> ...
>
> // Inject the JavaScript code into WebView using the WebView instance in React Native
>  useEffect(() => {
>    if (webviewRef.current)
>      webviewRef.current.injectJavaScript(setMarkerPosition);
>  }, [riderLocation]);
> ```

**<br>2. Map re-renders every time useState value changes (unresolved) <br><br>**
> * Suspected Cause: It is assumed that once the useState value in React Native is set, it becomes fixed in WebView.<br><br>
> * Action Taken: Tried injecting updated values through injectedJavaScript, but the changes did not reflect.<br><br>
> * Next Steps: Plan to inject the entire code for displaying markers on the map through injectedJavaScript (previously, only specific variable values were updated).
