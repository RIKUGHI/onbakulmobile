import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default ({ title, value }) => {
  return(
    <View style={{marginBottom: 10}}>
      <Text style={{color: 'black', fontWeight: 'bold', fontSize: 16}}>{title}</Text>
      <Text style={{color: 'black'}}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})