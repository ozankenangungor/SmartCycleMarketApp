import { Button,  Platform, SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Navigator from 'app/navigator';
import FlashMessage from 'react-native-flash-message';
import { Provider } from 'react-redux';
import store from 'app/store';
import { useState } from 'react';
import { View } from 'react-native';


const Stack = createNativeStackNavigator();



export default function App() {
 
  return (
    <Provider store={store}>
    <SafeAreaView style={styles.container}>
     <Navigator/>
     <FlashMessage position="top" />
    </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
},
});
