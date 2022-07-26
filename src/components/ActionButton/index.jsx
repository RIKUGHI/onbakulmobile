import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import util from '../../util';

export default ({ label, enableMarginRight, backgroundColor = util.Colors.MainColor, loading = false, onPress = undefined }) => {
  const trueStyle = loading ? (
    enableMarginRight ? [styles.container, {marginRight: 5, backgroundColor, opacity: .8}] : [styles.container, {backgroundColor, opacity: .8}]
  ) : (
    enableMarginRight ? [styles.container, {marginRight: 5, backgroundColor}] : [styles.container, {backgroundColor}]
  )
  return(
    <Pressable 
      style={trueStyle}
      onPress={loading ? undefined : onPress}
    >
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>{loading ? 'Proses...' : label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flex: 1,
  }
})