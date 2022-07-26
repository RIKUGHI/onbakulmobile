import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import util from '../../util';

export default ({children, title, marginBot}) => {
  const trueStyle = marginBot ? [styles.graphCard, { marginBottom: 15 }] : styles.graphCard
  return(
    <View style={trueStyle}>
      <Text style={{fontWeight: 'bold', fontSize: 18, color: util.Colors.MainColor, marginBottom: 10}}>{title}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  graphCard: {
    backgroundColor: util.Colors.White,
    marginHorizontal: 15, 
    padding: 15, 
    marginTop: 15,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 20,  
    elevation: 5,
    shadowColor: 'black'
  }
})