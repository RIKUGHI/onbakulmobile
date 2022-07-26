import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import NoData from '../../assets/img/no-data.svg'

export default ({ title }) => {
  return(
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <NoData width={300} height={300} style={{marginTop: 60}} />
      <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>{title} Tidak Tersedia</Text>
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