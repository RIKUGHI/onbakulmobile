import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import util from '../../util';
import RouteItem from './RouteItem';

export default ({ name, icon, secondIcon, routeList, activatedScreen, navigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isSubMenu = ['Produk', 'Satuan', 'Kategori', 'Pelanggan', 'Supplier', 'Outlet'].includes(activatedScreen)
  const height = useRef(new Animated.Value(isSubMenu ? 41 * 6 : 0)).current

  useEffect(() => {
    if (isSubMenu) setIsOpen(!isOpen) 
  }, [])

  const toggle = () => {
    Animated.timing(height, {
      toValue: isOpen ? 0 : 41 * 6, 
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false
    }).start()
    setIsOpen(!isOpen)
  }

  return(
    <View>
      <TouchableWithoutFeedback onPress={toggle}>
        <View style={styles.ItemMenuWithSub}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.iconContainer}>
              <FontAwesomeIcon icon={icon} color='white' size={27} />  
            </View>
            <Text style={styles.title}>{name}</Text>
          </View>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon={secondIcon} color='white' size={20} />  
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Animated.View style={{width: '100%', maxHeight: height, overflow: 'hidden'}}>
        {
          routeList.map((d, i) => <RouteItem 
                                    key={i} 
                                    icon={false} 
                                    name={d} 
                                    activatedScreen={activatedScreen}
                                    navigate={navigate}
                                  />)
        }
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  ItemMenuWithSub: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'grey'
  },
  iconContainer: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    color: util.Colors.White
  }
})