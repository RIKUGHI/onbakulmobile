import { faBars, faBell } from '@fortawesome/free-solid-svg-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useRef, useState, useEffect} from 'react';
import { DrawerLayoutAndroid, StatusBar, Text } from 'react-native';
import {
  AccountScreen, CashierScreen, CategoryScreen,
  CustomerScreen, OutletScreen, ProductScreen, 
  SupplierScreen, TransactionScreen, TutorialScreen, 
  UnitScreen, NotifScreen
} from '..';
import { HeaderButton, NavigationView } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';
import ContentScreen from '.';

const Stack = createNativeStackNavigator()

const DasboardScreen =  (props) => {
  const ref = useRef(null)
  const [activatScreen, setActiveScreen] = useState('Dashboard')

  useEffect(() => {
    axios.get(util.ServerUrl+`notifications?id_owner=${props.state.id_owner}`)
    .then(res => {
      console.log(res.data);
      // this.setState({
      //   Data: res.data.result
      // })
    }).catch(err => console.log('Request Error',err))
  })

  const openDrawer = () => {
    ref.current.openDrawer()
  }

  const onNavigate = (name) => {
    ref.current.closeDrawer()
    props.navigation.navigate(name)
  }

  const onScreenListener = e => setActiveScreen(e.route.name)
  

  return(
    <DrawerLayoutAndroid
      ref={ref}
      drawerWidth={300}
      drawerPosition='left'
      renderNavigationView={() => <NavigationView 
                                    activatedScreen={activatScreen} 
                                    navigate={onNavigate} 
                                  />}
      drawerBackgroundColor={util.Colors.MainColor}
      keyboardDismissMode='on-drag'
    >
      <StatusBar
        animated={true}
        backgroundColor={util.Colors.MainColor}
      />
      <Stack.Navigator initialRouteName='Dashboard' screenListeners={onScreenListener} screenOptions={({ navigation, route }) => ({
        headerTintColor: util.Colors.MainColor,
        headerLeft: () => <HeaderButton icon={faBars} onPress={openDrawer} marginRight />,
        headerRight: () => <HeaderButton icon={faBell} warning={true} onPress={() => navigation.navigate('Notif')} />
      })}>
        <Stack.Screen name='Dashboard' component={ContentScreen} />
        <Stack.Screen name='Kasir' component={CashierScreen} />
        <Stack.Screen name='Produk' component={ProductScreen} />
        <Stack.Screen name='Satuan' component={UnitScreen} />
        <Stack.Screen name='Kategori' component={CategoryScreen} />
        <Stack.Screen name='Pelanggan' component={CustomerScreen} />
        <Stack.Screen name='Supplier' component={SupplierScreen} />
        <Stack.Screen name='Outlet' component={OutletScreen} />
        <Stack.Screen name='Transaksi' component={TransactionScreen} />
        <Stack.Screen name='Akun' component={AccountScreen} />
        <Stack.Screen name='Tutorial' component={TutorialScreen} />
        <Stack.Screen name='Notif' component={NotifScreen} />
      </Stack.Navigator>
    </DrawerLayoutAndroid>
  )
}

export default GlobalConsumer(DasboardScreen)