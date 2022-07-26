import { faMinus, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Pressable, TextInput } from 'react-native';
import util from '../../util';

export default ({ data, index, totalData, onUpdateCart, onItemCartDelete }) => {
  const [isMinusDisable, setIsMinusDisable] = useState(true) 
  const [isPlusDisable, setIsPlusDisable] = useState(false) 

  useEffect(() => {
    if (data.detail.available_stock) {
      if (data.detail.stock_quantity === 1) {
        setIsPlusDisable(true)
        setIsMinusDisable(true)
      } else if (data.quantity >= data.detail.stock_quantity) {
        setIsPlusDisable(true)
        setIsMinusDisable(false)
      } else if (data.quantity <= 1) {
        setIsPlusDisable(false)
        setIsMinusDisable(true)
      } else {
        setIsPlusDisable(false)
        setIsMinusDisable(false)
      } 
    } else {
      if (data.quantity === 1) {
        setIsMinusDisable(true)
      }
    }
  })

  const _onPlus = () => {
    const {id_owner, id_outlet, is_variant, id_product} = data
    onUpdateCart(data.quantity + 1)
    setIsMinusDisable(false)
    addQuantity(id_owner, id_outlet, is_variant ? 1 : 0, id_product, data.quantity + 1);
  }

  const _onMinus = () => {
    const {id_owner, id_outlet, is_variant, id_product} = data

    if (data.quantity !== 1) {
      onUpdateCart(data.quantity - 1)
      addQuantity(id_owner, id_outlet, is_variant ? 1 : 0, id_product, data.quantity - 1);
    } 

    if (data.quantity <= 2) {
      onUpdateCart(1)
      setIsMinusDisable(true)
      addQuantity(id_owner, id_outlet, is_variant ? 1 : 0, id_product, 1);
    }
  }

  const addQuantity = async (id_owner, id_outlet, is_variant, id_product, qty) => {
    const form = new FormData()
    form.append('id_owner', id_owner)
    form.append('id_outlet', id_outlet)
    form.append('is_variant', is_variant)
    form.append('id_product', id_product)
    form.append('qty', qty)

    // axios.post(util.ServerUrl+'cashier/addQuantity', form)
    // .then(res => {
    //   console.log(res.data);
    //   if (res.data.response_code === 200) {
    //     console.log('success', res.data.result.message)
    //   } else {
    //     console.log('warning', res.data.result.message)
    //   }
    // })
    // .catch(err => console.log(err))
    await util.CallAPIPost('cashier/addQuantity', form, (success, message) => {
      console.log(message);
    })
  }

  return(
    <View style={index === totalData ? styles.root : [styles.root, {marginBottom: 5}]}>
      <Text style={styles.commonText}>{data.product_name}</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable 
            style={isMinusDisable ? [styles.commonButton, {backgroundColor: '#e8e8e8'}] : [styles.commonButton, {backgroundColor: util.Colors.MainColor}]}
            onPress={isMinusDisable ? undefined : _onMinus}
          >
            <FontAwesomeIcon icon={faMinus} color='white' size={17} />
          </Pressable>
          <TextInput value={data.quantity.toString()} editable={false} style={{borderWidth: 1, borderColor: util.Colors.ModalBackground, borderRadius: 5, width: 50, height: 30, marginHorizontal: 5, color: 'black', textAlign: 'center', fontSize: 16, padding: 0}} />
          <Pressable 
            style={isPlusDisable ? [styles.commonButton, {backgroundColor: '#e8e8e8'}] : [styles.commonButton, {backgroundColor: util.Colors.MainColor}]}
            onPress={isPlusDisable ? undefined : _onPlus}
          >
            <FontAwesomeIcon icon={faPlus} color='white' size={17} />
          </Pressable>
          <Pressable 
            style={[[styles.commonButton, {borderRadius: 10, backgroundColor: util.Colors.Warning, marginLeft: 5}]]}
            onPress={onItemCartDelete}
          >
            <FontAwesomeIcon icon={faTrashAlt} color='white' size={17} />
          </Pressable>
        </View>
        <Text style={styles.commonText}>{util.formatRupiah(data.quantity * data.selling_price)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    padding: 10, 
    backgroundColor: util.Colors.SecondaryWhite, 
    borderRadius: 10
  },
  commonText: {
    color: 'black', 
    fontWeight: 'bold', 
    fontSize: 16
  },
  commonButton: {
    width: 32, 
    height: 32,  
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 32 / 2
  }
})