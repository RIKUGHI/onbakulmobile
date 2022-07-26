import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text, View, StyleSheet, Image, TouchableNativeFeedback, Pressable } from 'react-native';
import util from '../../util';

const Card = ({ children, index, totalData, onPress, onLongPress }) => {
  const isLastItem = index === totalData ? true : false
  return(
    <View style={isLastItem ? styles.container : [styles.container, {marginBottom: 8}]}>
      <TouchableNativeFeedback 
        onPress={onPress}
        onLongPress={onLongPress} 
        background={TouchableNativeFeedback.Ripple(util.Colors.MainColor, false)}
      >
        <View style={styles.wrapper}>
        {children}
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

Card.Product = ({ data }) => {
  return(
    <View style={styles.wrapperProduct}>
      <View style={styles.imageContainer}>
        <Image source={data.product_img ? {uri: util.ServerUrl+`assets/img/${data.product_img.split('/')[6]}`} : require('../../assets/img/no-product-image.jpg')} style={{width: 70, height: 70}} />
      </View>
      <View style={{flex: 1}}>
        <Text style={styles.commonText}>{data.product_name}</Text>
        <Text style={[styles.commonText, {fontWeight: 'bold'}]}>{data.variants === null ? util.formatRupiah(data.selling_price) : data.variants.length+' Harga'}</Text>
      </View>
      {data.available_stock && !data.variants && <Text style={{color: 'black'}}>{data.stock_quantity}/{data.id_unit === null ? '-' : data.id_unit.unit_name}</Text>}
    </View>
  )
}

Card.SingleData = ({ label }) => {
  return(
    <Text style={{color: 'black'}}>{label}</Text>
  )
}

Card.SimpleData = ({ name, telp, city, address }) => {
  return(
    <View>
      <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{name}</Text>
      <Text style={{color: 'black'}}>{telp}</Text>
      <Text style={{color: 'black'}}>{city}, {address}</Text>
    </View>
  )
}

Card.TransactionHistory = ({ invoice, grandTotal, method, isLunas, time }) => {
  const splittedTime = time.split(':')
  const formattedTime =splittedTime[0] +':'+ splittedTime[1]

  return(
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <FontAwesomeIcon icon={faFileInvoiceDollar} color={util.Colors.MainColor} size={30} />
      <View style={{flex: 1, marginLeft: 8}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>{invoice}</Text>
          <Text style={{color: 'black', fontWeight: 'bold'}}>{util.formatRupiah(grandTotal)}</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'black', fontSize: 12}}>{util.methods[method]}</Text>
            <TransactionStatus isTranscationHistory status={isLunas} />
          </View>
          <Text style={{color: 'black', fontSize: 12}}>{formattedTime}</Text>
        </View>
      </View>
    </View>
  )
}

Card.Purchase = ({ status, name, supplier, quantity, unit, price }) => {
  return(
    <View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>{name}</Text>
        <TransactionStatus status={status} />
      </View>
      <Text style={{color: 'black', fontSize: 12}}>{supplier}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{color: 'black', fontSize: 12}}>{quantity} {unit} x {util.formatRupiah(price)}</Text>
        <Text style={{color: 'black', fontSize: 12}}>{util.formatRupiah(parseInt(quantity) * parseInt(price))}</Text>
      </View>
    </View>
  )
}

const TransactionStatus = ({ status, isTranscationHistory = false }) => {
  return(
    <View style={{
      backgroundColor: status ? util.Colors.SuccessBg : util.Colors.WarningBg,
      width: 48,
      borderRadius: 6,
      // paddingHorizontal: 4,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10
    }}>
      <Text style={{
        color: status ? util.Colors.Success : util.Colors.Warning, 
        fontWeight: 'bold', 
        fontSize: 12
      }}>{isTranscationHistory ? (status ? 'Lunas' : 'Hutang') : (status ? 'Selesai' : 'Diproses')}</Text>
    </View>
  )
}

Card.Tutorial = ({ title }) => {
  return(
    <Text>{title}</Text>
  )
}

Card.Notif = ({ data, onItemPress = undefined }) => {
  return(
    <Pressable
      onPress={onItemPress}
    >
      <Text style={{color: 'black'}}>Produk <Text style={{fontWeight: 'bold'}}>{data.product_name}</Text> Tersisa <Text style={{fontFamily: 'bold', color: util.Colors.Warning}}>{data.stock_quantity}</Text> pack</Text>
      <Text style={{color: 'black'}}>Silahkan lakukan restock</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10, 
    overflow: 'hidden'
  },
  wrapper: {
    padding: 8, 
    backgroundColor: util.Colors.SecondaryWhite
  },
  wrapperProduct: {
    // backgroundColor: util.Colors.SecondaryWhite,
    // padding: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageContainer: {
    backgroundColor: util.Colors.ThirtyWhite,
    width: 70,
    height: 70,
    marginRight: 8,
    borderRadius: 10,
    overflow: 'hidden'
  },
  commonText: {
    fontSize: 14, 
    color: util.Colors.Black
  }
})

export default Card