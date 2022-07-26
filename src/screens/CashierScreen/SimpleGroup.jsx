import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default ({ children, label }) => {
  return(
    <View style={{
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      padding: 10
    }}>
      <Text style={{color: 'black', fontSize: 16}}>{label}</Text>
      {children}
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