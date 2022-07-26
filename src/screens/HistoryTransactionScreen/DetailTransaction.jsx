import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import util from '../../util';

const DetailTransaction = ({ children, disableMarginBottom }) => {
  return(
    <View style={disableMarginBottom ? styles.root : [styles.root, {marginBottom: 5}]}>
      {children}
    </View>
  )
}

DetailTransaction.Common = ({ label, value, disableMarginBottom }) => {
  return(
    <View style={disableMarginBottom ? styles.containerCommonText : [styles.containerCommonText, {marginBottom: 5}]}>
      <Text style={label.bold ? [styles.commonText, {fontWeight: 'bold'}] : styles.commonText}>{label.text}</Text>
      <Text style={value.bold ? [styles.commonText, {fontWeight: 'bold'}] : styles.commonText}>{value.text}</Text>
    </View>
  )
}

DetailTransaction.Product = ({ name, price, quantity, disableMarginBottom }) => {
  return(
    <View style={disableMarginBottom ? {flexDirection: 'row'} : {flexDirection: 'row', marginBottom: 5}}>
      <View style={{flex: 1}}>
        <Text style={[styles.commonText, {fontWeight: 'bold'}]}>{name}</Text>
        <Text style={styles.commonText}>{util.formatRupiah(price)} x {quantity}</Text>
      </View>
      <Text style={[styles.commonText, {alignSelf: 'center'}]}>{util.formatRupiah(price * quantity)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    borderBottomWidth: 1, 
    borderColor: util.Colors.ModalBackground,
    paddingBottom: 5
  },
  containerCommonText: {
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },  
  commonText: {
    color: 'black', 
    fontSize: 16
  }
})

export default DetailTransaction