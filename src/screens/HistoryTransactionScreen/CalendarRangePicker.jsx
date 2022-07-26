import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import util from '../../util';

export default ({ startDate, endDate, onOpenCalendar, onShowData }) => {
  const start = startDate ? startDate.split('-') : ['00','00','0000']
  const end = endDate ? endDate.split('-') : ['00','00','0000']

  return(
<View style={styles.root}>
    <Pressable
      style={styles.containerText}
      onPress={onOpenCalendar}
    >
      <Text style={{fontSize: 16, color: 'black'}}>{start[2]+'-'+start[1]+'-'+start[0]} s/d {end[2]+'-'+end[1]+'-'+end[0]}</Text>
    </Pressable>
    <Pressable style={styles.containerButton}
      onPress={onShowData}
    >
      <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Tampilkan</Text>
    </Pressable>
</View>
  )
}

const styles = StyleSheet.create({
  root: {
    height: 42,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  containerText: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 20,  
    elevation: 5,
    shadowColor: 'black',
  },
  containerButton: {
    marginLeft: 10,
    height: 42,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: util.Colors.MainColor
  }
})