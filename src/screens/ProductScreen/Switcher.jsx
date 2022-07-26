import React from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
import util from '../../util';

export default ({ value, onValueChange }) => {
  return(
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: util.Colors.SecondaryWhite,
      marginTop: 8,
      padding: 14
    }}>
      <Text style={{fontSize: 16, color: 'black'}}>Produk ini punya stok</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#9b95f2" }}
        thumbColor={value ? util.Colors.MainColor : "#f4f3f4"}
        onValueChange={onValueChange}
        value={value}
      />
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