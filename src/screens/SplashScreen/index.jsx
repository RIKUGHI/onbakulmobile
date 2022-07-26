import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';
import { GlobalConsumer } from '../../context';
import util from '../../util';

const SplashScreen = ({ navigation, state }) => {
  useEffect(() => {
    doLogin()
  })

  const doLogin = async () => {
    try {
      const isLogin = await AsyncStorage.getItem('login') === 'true' ? true : false
      setTimeout(() => {
        if (isLogin) {
          navigation.dispatch(StackActions.replace('Main'))
        } else {
          navigation.dispatch(StackActions.replace('Auth'))
        }
      }, 3000);      
    } catch (error) {
      console.log(error)
    }
  }


  return(
    <View style={styles.container}>
      <StatusBar
        animated={true}
        backgroundColor={util.Colors.MainColor}
      />
      <Image 
        source={require('../../assets/img/logo.png')} 
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  }
})

export default GlobalConsumer(SplashScreen)