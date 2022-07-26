import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import util from '../../util';

export default ({ title, onDismiss }) => {
  return(
    <View style={[styles.header, styles.common, {shadowOffset: {height: 3}, paddingHorizontal: 10}]}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: util.Colors.MainColor, fontSize: 20, fontWeight: 'bold'}}>{title}</Text>
      </View>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.closeIcon}>
          <FontAwesomeIcon icon={faTimes} color={util.Colors.MainColor} size={27} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: util.Colors.White,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
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
  }
})