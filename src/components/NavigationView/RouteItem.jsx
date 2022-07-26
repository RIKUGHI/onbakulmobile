import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import util from '../../util';

export default ({ name, icon, activatedScreen, navigate }) => {
  const styling = name === activatedScreen ? [styles.itemMenu, styles.activated] : styles.itemMenu
  const onPress = () => {
    navigate(name)
  }

  return(
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styling}>
        {icon ? (
          <View style={styles.iconContainer}>
            <FontAwesomeIcon icon={icon} color='white' size={27} />
          </View>
        ) : <View style={styles.iconContainerWithoutIcon} />}
        <Text style={styles.title}>{name}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  itemMenu: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  activated: {
    backgroundColor: util.Colors.SecondaryColor
  },
  iconContainer: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconContainerWithoutIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 18,
    color: util.Colors.White
  }
})