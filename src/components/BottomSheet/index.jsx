import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View, ScrollView, Modal } from 'react-native';
import { Portal } from 'react-native-paper';
import util from '../../util';
import HeaderModal from '../HeaderModal';

export default ({children, title, show, enableFullScreen, onDismiss}) => {
  const bottomSheetHeight = Dimensions.get('window').height - 24
  const bottom = useRef(new Animated.Value(-bottomSheetHeight)).current
  const isFullScreenStyle = enableFullScreen ? [styles.root, {height: bottomSheetHeight, bottom: bottom}] : [styles.root, {maxHeight: bottomSheetHeight, bottom: bottom}]

  const _onDismiss = () => {
    Animated.timing(bottom, {
      toValue: -bottomSheetHeight,
      duration: 300,
      useNativeDriver: false
    }).start(() => {
      onDismiss()
    })
  }

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        Animated.timing(bottom, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false
        }).start()
      }, 300);
    }
  }, [show])

  if (!show) {
    return null  
  }

  return(
    // <Portal>
    //   <Animated.View style={[styles.backDrop, {opacity: opacity}]}>
    //     <Pressable onPress={_onDismiss} style={{flex: 1}} />
    //   </Animated.View>
    //   <Animated.View style={[styles.root, {maxHeight: bottomSheetHeight, bottom: bottom, shadowOffset: {height: -3}}, styles.common]}>
    //       <View style={[styles.header, styles.common, {shadowOffset: {height: 3}, paddingHorizontal: 10}]}>
    //         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    //           <Text style={{color: util.Colors.MainColor, fontSize: 18, fontWeight: 'bold'}}>Test</Text>
    //         </View>
    //         <TouchableWithoutFeedback onPress={_onDismiss}>
    //           <View style={styles.closeIcon}>
    //             <FontAwesomeIcon icon={faTimes} color={util.Colors.MainColor} size={25} />
    //           </View>
    //         </TouchableWithoutFeedback>
    //       </View>
    //       <ScrollView style={{padding: 10}}>
    //         <View style={{backgroundColor: 'black', width: 100, height: 80, borderColor: 'yellow', borderWidth: 1}} />
    //         <View style={{backgroundColor: 'black', width: 100, height: 80, borderColor: 'yellow', borderWidth: 1}} />
    //         <View style={{backgroundColor: 'black', width: 100, height: 80, borderColor: 'yellow', borderWidth: 1}} />
    //         <View style={{backgroundColor: 'black', width: 100, height: 80, borderColor: 'yellow', borderWidth: 1}} />
    //         <View style={{backgroundColor: 'black', width: 100, height: 80, borderColor: 'yellow', borderWidth: 1}} />
    //         <View style={{backgroundColor: 'black', width: 100, height: 80, borderColor: 'yellow', borderWidth: 1}} />
    //         <View style={{backgroundColor: 'black', width: 100, height: 80, borderColor: 'yellow', borderWidth: 1}} />
    //         <View style={{backgroundColor: 'black', width: 100, height: 80, borderColor: 'yellow', borderWidth: 1}} />
    //         <View style={{backgroundColor: 'black', width: 100, height: 80, borderColor: 'yellow', borderWidth: 1}} />
    //       </ScrollView>
    //     {/* {children} */}
    //   </Animated.View>
    // </Portal>
    <Modal
      animationType='fade'
      transparent={true}
      visible={true}
      onRequestClose={() => {
        console.log('modal has been close');
      }}
    >
      <View style={styles.rroot}>
        <Animated.View style={styles.backDrop}>
          <Pressable onPress={_onDismiss} style={{flex: 1}} />
        </Animated.View>
        <Animated.View style={isFullScreenStyle}>
          <HeaderModal title={title} onDismiss={_onDismiss} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  rroot: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      height: -3,
      width: 0
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden'
  },
  common: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0
    },
    shadowOpacity: 0.24,
    shadowRadius: 4,
    elevation: 3
  },
  closeIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red'
  },
  backDrop: {
    ...StyleSheet.absoluteFillObject,
  }
})