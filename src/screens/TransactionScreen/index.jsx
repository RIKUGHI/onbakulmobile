import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, FlatList, useWindowDimensions, Animated} from 'react-native';
import util from '../../util';
import { HistoryTransactionScreen, PurchaseScreen } from '../index'
import MenuItem from './MenuItem';

export default (props) => {
  const Data = [
    {
      id: 1,
      name: 'Riwayat Transaksi',
      screen: HistoryTransactionScreen
    },
    {
      id: 2,
      name: 'Pembelian',
      screen: PurchaseScreen
    }
  ]
  const ref = useRef(null)
  const left = useRef(new Animated.Value(0)).current
  const { width } = useWindowDimensions()
  const [isHistoryTransactionsScreen, setIsHistoryTransactionScreen] = useState(true)
  const [isPurchaseScreen, setIsPurchaseScreen] = useState(false)

  const viewAbleItemsChanged = useRef((x) => {
    if (x.viewableItems.length === 1 && x.viewableItems[0].index === 0) {
      setIsHistoryTransactionScreen(true)
      setIsPurchaseScreen(false)
      doScrollAnimate(0)
    } else if (x.viewableItems.length === 1 && x.viewableItems[0].index === 1){
      setIsPurchaseScreen(true)
      setIsHistoryTransactionScreen(false)
      doScrollAnimate(width / 2)
    }
  }).current

  const onMenuPressed = index => {
    ref.current.scrollToIndex({
      index: index
    })

    index === 0 ? doScrollAnimate(0) : doScrollAnimate(width / 2)
  }

  const doScrollAnimate = value => {
    Animated.timing(left, {
      toValue: value,
      duration: 300,
      useNativeDriver: false
    }).start()
  }

  return(
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{
        flexDirection: 'row', 
        backgroundColor: 'white', 
        borderBottomWidth: 2, 
        borderBottomColor: util.Colors.SecondaryWhite, 
        position: 'relative'
      }}>
        <MenuItem title='Riwayat Transaksi' active={isHistoryTransactionsScreen} onPress={() => onMenuPressed(0)} />
        <MenuItem title='Pembelian' active={isPurchaseScreen} onPress={() => onMenuPressed(1)} />
        <Animated.View style={{backgroundColor: util.Colors.MainColor, width: width / 2, height: 2, position: 'absolute', bottom: -2, left: left}} />
      </View>
      <FlatList 
        ref={ref}
        data={Data}
        renderItem={({item}) => <OnBoardingItem>
                                  <item.screen navigation={props.navigation} />
                                </OnBoardingItem>
                              }
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewAbleItemsChanged}
      />
    </View>
  )
}

const OnBoardingItem = ({ children }) => {
  const { width, height } = useWindowDimensions()

  return(
    <View style={[{width}]}>
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