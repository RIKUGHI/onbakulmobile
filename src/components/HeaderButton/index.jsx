import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import util from '../../util';

export default ({ icon, onPress = undefined, warning = false, marginRight }) => {
  const marginR = marginRight ? 15 : 0
  return(
    <TouchableWithoutFeedback style={styles.button} onPress={onPress}>
      <View style={{position: 'relative'}}>
        <FontAwesomeIcon icon={icon} color={util.Colors.MainColor} size={25} style={{marginRight: marginR}} />
        {warning && (
          <View style={styles.warning}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 13, textAlign: 'center'}}>!</Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'grey',
    width: 35,
    height: 35
  },
  warning: {
    backgroundColor: 'red', 
    width: 18, 
    height: 18, 
    borderRadius: 18 / 2, 
    position: 'absolute', 
    top: -5, 
    left: 15
  }
})