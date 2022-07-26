import { faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import util from '../../util';

const SimpleData = ({ children, label, value, style = {} }) => {
  return(
    <View style={style}>
      {children}
    </View>
  )
}

SimpleData.Item = ({ label, value }) => {
  return(
    <View style={{flexDirection: 'row'}}>
      <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold', width: 110}}>{label}</Text>
      <Text style={{color: 'black', fontSize: 16}}>{value}</Text>
    </View>
  )
}

SimpleData.Image = ({ uri }) => {
  return(
    <Image source={uri ? {uri: util.ServerUrl+`assets/img/${uri.split('/')[6]}`} : require('../../assets/img/no-product-image.jpg')} 
      style={{
        width: 100,
        height: 100,
        backgroundColor: util.Colors.SecondaryWhite,
        borderRadius: 10,
        alignSelf: 'center'
      }} 
    />
  )
}

SimpleData.Unit = ({ unitName, stock, stockMin }) => {
  return(
    <View style={{flexDirection: 'row', padding: 10, backgroundColor: util.Colors.SecondaryWhite, borderRadius: 10, marginBottom: 8}}>
      <View style={{alignItems: 'center', flex: 1}}>
        <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{unitName}</Text>
        <Text style={{color: 'black', fontSize: 16}}>Satuan</Text>
      </View>
      <View style={{alignItems: 'center', flex: 1}}>
        <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{stock}</Text>
        <Text style={{color: 'black', fontSize: 16}}>Stok</Text>
      </View>
      <View style={{alignItems: 'center', flex: 1}}>
        <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{stockMin}</Text>
        <Text style={{color: 'black', fontSize: 16}}>Stok Minimum</Text>
      </View>
    </View>
  )
}

SimpleData.HasVariants = ({ children }) => {
  return(
    <View>
      <Text style={{color: util.Colors.MainColor, fontSize: 18, fontWeight: 'bold', marginBottom: 5}}>Variasi</Text>
      {children}
    </View>
  )
}

SimpleData.HasVariants.Item = ({ name, sellingPrice, capitalPrice, availableStock, stockQuantity, unit, onItemPress = undefined, onPressEdit = undefined, onPressDelete = undefined }) => {
  return(
    <Pressable style={{
      flexDirection: 'row',
      marginBottom: 5
      }}
      onPress={onItemPress}
    >
      <View style={{
        flex: 1,
        flexDirection: 'row', 
        backgroundColor: util.Colors.SecondaryWhite, 
        padding: 10, 
        borderRadius: 10
      }}>
        <View style={{flex: 1}}>
          <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{name}</Text>
          <Text style={{color: 'black'}}>Harga Jual: {util.formatRupiah(sellingPrice)}</Text>
          <Text style={{color: 'black'}}>Harga Modal: {util.formatRupiah(capitalPrice)}</Text>
        </View>
        {availableStock === 1 && (
          <Text style={{color: 'black', alignSelf: 'center'}}>{stockQuantity}/{unit}</Text>
        )}
      </View>
      {(onPressEdit !== undefined || onPressDelete !== undefined) && (
        <View style={{marginLeft: 5}}>
          {onPressEdit && (
            <Pressable style={[styles.actionButton, {marginBottom: 5}]} onPress={onPressEdit}>
              <FontAwesomeIcon icon={faPen} color={util.Colors.MainColor} size={27} />
            </Pressable>
          )}
          {onPressDelete && (
            <Pressable style={styles.actionButton} onPress={onPressDelete}>
              <FontAwesomeIcon icon={faTrashAlt} color={util.Colors.MainColor} size={27} />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButton: {
    backgroundColor: 'white', 
    width: 40, 
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8, 
    shadowRadius: 20,  
    elevation: 2,
    shadowColor: 'black'
  }
})

export default SimpleData