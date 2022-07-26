import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import util from '../../util';

export default ({ title, active, onPress }) => {
  return(
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={active ? [styles.title, {color: util.Colors.MainColor}] : styles.title}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1, 
    borderColor: 'black',
    flex: 1, 
    height: 45, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  title: {
    fontSize: 16, fontWeight: 'bold',
    color: 'black'
  }
})