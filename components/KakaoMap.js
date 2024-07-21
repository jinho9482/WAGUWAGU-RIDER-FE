import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";



const KakaoMap = () => {

    


    return (
      <View style={styles.webviewContainer}>  
        <WebView
          style={styles.webview}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
        />
      </View> 
    )
}

const styles = StyleSheet.create({
  webviewContainer: {
    flex: 1
  },

  webview: {
    flex: 1
  }
})

export default KakaoMap;