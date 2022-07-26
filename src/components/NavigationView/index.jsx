import { faBox, faCaretDown, faCashRegister, faDesktop, faFileInvoiceDollar, faFileUpload, faPowerOff, faQuestionCircle, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Pressable, Alert } from 'react-native';
import util from '../../util';
import RouteItem from './RouteItem';
import RouteItemWithSub from './RouteItemWithSub';

export default ({ activatedScreen, navigation, navigate, globalContext }) => {
  const [level, setLevel] = useState(0)
  const [ownerCode, setOwnerCode] = useState('OBXX-00000')
  const [displayName, setDisplayName] = useState('Loading Display Name')

  useEffect(() => {
    setProfile()
  }, [])

  const setProfile = async () => {
    try {
      const level = await AsyncStorage.getItem('level')
      const owner_code = await AsyncStorage.getItem('owner_code')
      const display_name = parseInt(level) === 0 ? await AsyncStorage.getItem('owner_name') : await AsyncStorage.getItem('outlet_name')
      
      setLevel(parseInt(level))
      setOwnerCode(owner_code)
      setDisplayName(display_name)
    } catch (e) {
      console.log(e);
    }
  }

  const onLogout = () => {
    Alert.alert("Perhatian",
      "Apakah ingin keluar?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => globalContext.logout(() => navigation.dispatch(StackActions.replace('Auth')))
        }
      ],
      {
        cancelable: true
      })
  }

  return(
    <ScrollView>
      <View style={styles.headerNavigation}>
        <View style={styles.imageContainer}>
          <Image source={{uri: util.FakeImageUrl}} style={styles.image} />
        </View>
        <View>
          <Text style={styles.username}>{displayName}</Text>
          <Text style={styles.role}>{parseInt(level) === 0 ? 'Pemilik' : 'Toko'} - {ownerCode}</Text>
        </View>
      </View>
      <RouteItem icon={faDesktop} name="Dashboard" activatedScreen={activatedScreen} navigate={navigate} />
      <RouteItem icon={faCashRegister} name="Kasir" activatedScreen={activatedScreen} navigate={navigate} />
      <RouteItemWithSub icon={faBox} secondIcon={faCaretDown} name="Kelola" activatedScreen={activatedScreen} navigate={navigate} routeList={['Produk', 'Satuan', 'Kategori', 'Pelanggan', 'Supplier', 'Outlet']} />
      <RouteItem icon={faFileInvoiceDollar} name="Transaksi" activatedScreen={activatedScreen} navigate={navigate} />
      <RouteItem icon={faUser} name="Akun" activatedScreen={activatedScreen} navigate={navigate} />
      <RouteItem icon={faQuestionCircle} name="Tutorial" activatedScreen={activatedScreen} navigate={navigate} />
      {level === 0 && <RouteItem icon={faFileUpload} name="Upgrade" activatedScreen={activatedScreen} navigate={navigate} />}
      <Pressable style={styles.containerBtn} onPress={onLogout}>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon icon={faPowerOff} color='white' size={27} />
        </View>
        <Text style={{ fontSize: 18, color: util.Colors.White }}>Logout</Text>
      </Pressable>
      {/* <RouteItem icon="x" name="Logout" activatedScreen={activatedScreen} /> */}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerNavigation: {
    width: '100%',
    height: 85,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5
  },  
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    marginRight: 5,
    backgroundColor: util.Colors.White,
    overflow: 'hidden'
  },
  image: {  
    width: 60,
    height: 60
  },
  username: {
    color: util.Colors.White,
    fontSize: 14,
    fontWeight: '700'
  },
  role: {
    color: util.Colors.White,
    fontSize: 12,
  },
  containerBtn: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center'
  },
  iconContainer: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  }
})