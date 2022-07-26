import React, { Component } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View, Dimensions, Image, ToastAndroid, Modal } from 'react-native';
import { ManagementLayout, MyOwnModal, ActionButton } from '../../components';
import util from '../../util';
import UpgradeCard from './UpgradeCard';
import LogoGoPayText from '../../assets/img/gopay.png'
import Qrcode from '../../assets/img/qrcode.png'
import LogoGopay from '../../assets/img/gopay.svg'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import GoPayProcess from '../../assets/img/menunggu.jpeg'
import LogoGoJek from '../../assets/img/LogoGojek.png'

export default class UpgradeScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      DataPackage: [
        {
          id: 1,
          label: 'Premium',
          shortDesc: 'Rp30.000 / bulan',
          longDesc: 'Untuk usaha rintisan dengan fitur standar',
          features: [
            'POST di Android', 'Fitur Dasar', 'Fitur Menengah', 'Laporan Sederhana',
            'Manajemen Produk', 'Jumlah Produk (Tidak Terbatas)', 'Manajemen Harga Modal dan Jual',
            'Manajemen Stok Produk', 'Peringatan Sisa Stok', 'Produk dengan Varian', 'Jumlah Transaksi (Tidak Terbatas)',
            'Catat Transaksi Tunai dan Non Tunai', 'Jumlah Outlet (Pemilik + Outlet Tidak Terbatas)',
            'Pembelian dan Supplier', 'Catat Pendapatan dan Pengeluaran'
          ]
        },
        {
          id: 2,
          label: 'Basic',
          shortDesc: 'Gratis Selamanya',
          longDesc: 'Untuk usaha rintisan yang dikelola sendiri tanpa staff, dengan laporan penjualan sederhana',
          features: [
            'POST di Android', 'Fitur Dasar', 'Laporan Sederhana',
            'Manajemen Produk', 'Jumlah Produk (Tidak Terbatas)', 'Manajemen Harga Modal dan Jual',
            'Manajemen Stok Produk', 'Peringatan Sisa Stok', 'Produk dengan Varian', 'Jumlah Transaksi (Tidak Terbatas)',
            'Catat Transaksi Tunai dan Non Tunai', 'Jumlah Outlet (Hanya Pemilik)',
          ]
        }
      ],
      data: {
        id_owner: 0,
        created_at: '',
        business_name: '',
        owner_name: '',
        owner_code: '',
        telp: '',
        email: '',
        today: '0000-00-00',
        is_pro: false,
        start: '0000-00-00 00:00:00',
        end: '0000-00-00 00:00:00',
        outlets: [
          {
            id_owner: 0,
            id_outlet: 0,
            owner_code: '',
            outlet_name: '',
            city: '',
            address: '',
            telp: ''
          }
        ]
      },
      isLoading: false,
      isProsessPayment: false,
      business_name: 'Loading Business Name',
      countDownDate: '00:00:00:00',
      currentDateTime: '0000-00-00 00:00:00',
      showPaymentModal: false,
      showGoPayModal: false,
      isGoJekLogo: true
    }
    this._doUpgrade = this._doUpgrade.bind(this)
  }

  componentDidMount(){
    this._getData()
  }

  async _getData(){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')
      const business_name = await AsyncStorage.getItem('business_name')

      axios.get(util.ServerUrl+'accounts/'+id_owner)
      .then(res => {
        if ((res.data.result.start || res.data.result.end) === null) {
          this.setState({
            data: res.data.result,
            business_name: business_name,
          })
        } else {
          this.setState({
            data: res.data.result,
            business_name: business_name,
            currentDateTime: this._getCurrentDateTime(res.data.result.today , new Date()) < res.data.result.end ? this._getCurrentDateTime(res.data.result.today , new Date()) : res.data.result.end,
          }, () => {
            let endDate = new Date(res.data.result.end.split(' ').join('T')).getTime() - 25200000
  
            let countDownDate = setInterval(() => {
              let now = new Date();
              let miliTime = now.getTime()
              let distance = endDate - miliTime;
    
              let days = Math.floor(distance / (1000 * 60 * 60 * 24));
              let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  
              this.setState({
                countDownDate: `${days <= 0 ? '00' : this._fixingTime(days)}:${hours <= 0 ? '00' : this._fixingTime(hours)}:${minutes <= 0 ? '00' : this._fixingTime(minutes)}:${seconds <= 0 ? '00' : this._fixingTime(seconds)}`,
                currentDateTime: this._getCurrentDateTime(this.state.data.today, now)
              })
              if (distance < 0) clearInterval(countDownDate)
            }, 1000);
          })
        }
      })
      .catch(err => console.log(err))
    } catch (e) {
      console.log(e)
    }
  }

  async _doUpgrade(){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')
      const data = new FormData()
      data.append('owner_name', this.state.data.owner_name)
  
      this.setState({isLoading: true})
      axios.put(util.ServerUrl+'payment/edit/'+id_owner, new URLSearchParams(data))
      .then(res => {
        setTimeout(() => {
          this.setState({
            isLoading: false,
            showPaymentModal: res.data.response_code === 200 ? false : true
          })
          ToastAndroid.show(res.data.result.message, ToastAndroid.SHORT)
          if (res.data.response_code === 200) this._getData() 
        }, 2000);
      })
      .catch(err => console.log(err))
    } catch (e) {
      console.log(e)
    }
  }

  _fixingTime(t){
    return t.toString().length === 1 ? '0'+t.toString() : t 
  }

  _getCurrentDateTime(today, now){
    return `${today} ${this._fixingTime(now.getHours())}:${this._fixingTime(now.getMinutes())}:${this._fixingTime(now.getSeconds())}`
  }

  render(){
    return(
      <ManagementLayout>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{color: util.Colors.MainColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15}}>{this.state.data.is_pro && this.state.currentDateTime < this.state.data.end ? `Fitur Premium Tersisa ${this.state.countDownDate}` : `Upgrade Toko - ${this.state.business_name}`}</Text>
          {this.state.data.is_pro && this.state.currentDateTime < this.state.data.end ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesomeIcon icon={faUnlockAlt} color={util.Colors.Success} size={20} style={{marginRight: 10}} />
              <Text style={{color: 'black', fontWeight: 'bold'}}>Fitur Supplier, Outlet dan Pembelian Terbuka</Text>
            </View>
          ) : (
            <FlatList
              data={this.state.DataPackage}
              renderItem={({ item }) => <UpgradeCard 
                                          label={item.label} 
                                          shortDesc={item.shortDesc}
                                          longDesc={item.longDesc}
                                          features={item.features}
                                          isLastItem={item.id === 2}
                                          onShowModal={() => this.setState({showPaymentModal: true, isProsessPayment: false})}
                                        />}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              bounces={false}
              keyExtractor={item => item.id}
            />
          )}
        </ScrollView>

        {/* ============================================= Modal Payment ============================================= */}
        <MyOwnModal
          visible={this.state.showPaymentModal}
        >
          <View
            style={{
              backgroundColor: util.Colors.ModalBackground,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                backgroundColor: 'white',
                width: Dimensions.get('window').width - 30,
                borderRadius: 20,
                padding: 15
              }}
            >
              <Text style={{color: util.Colors.MainColor, fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>{this.state.isProsessPayment ? 'Total Pembayaran' : 'Paket Premium'}</Text>
              {this.state.isProsessPayment && (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                  <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>Gopay</Text>
                  <LogoGopay width={30} height={30} />
                </View>
              )}
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20}}>
                <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>1 Bulan</Text>
                <Text style={{color: 'black', fontSize: 18, fontWeight: 'bold'}}>Rp30.000</Text>
              </View>
              {/* {this.state.isProsessPayment ? (
                <View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
                    <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>Gopay</Text>
                    <LogoGopay width={30} height={30} />
                  </View>
                  <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image source={Qrcode} style={{width: 250, resizeMode: 'contain'}} />
                  </View>
                </View>
              ) : (
              )} */}
              {!this.state.isProsessPayment && (
                <View>
                  <Text style={{color: '#272727', marginBottom: 10}}>Pilih Metode Pembayaran</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 10}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      <Image source={LogoGoPayText} style={{width: 100, resizeMode: 'contain'}} />
                      <View>
                        <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>GoPay</Text>
                        <Text style={{color: 'black', width: 230}}>Siapkan aplikasi GO-JEK</Text>
                      </View>
                    </View>
                    <View style={{backgroundColor: util.Colors.MainColor, width: 15, height: 15, borderRadius: 15 / 2, justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{backgroundColor: 'white', width: 4, height: 4, borderRadius: 4 / 2}} />
                    </View>
                  </View>
                </View>
              )}
              <View style={{flexDirection: 'row'}}>
                <ActionButton label='Batal' backgroundColor={util.Colors.Warning} enableMarginRight onPress={() => this.setState({showPaymentModal: false})} />
                <ActionButton 
                  label={this.state.isProsessPayment ? 'Konfirmasi & Bayar' : 'Bayar Sekarang'} 
                  backgroundColor={util.Colors.MainColor} 
                  loading={this.state.isLoading} 
                  onPress={this.state.isProsessPayment ? this._doUpgrade : () => this.setState({
                    isLoading: true,
                    // showGoPayModal: true
                  }, () => {
                    setTimeout(() => {
                      this.setState({showGoPayModal: true})
                    }, 500);
                    setTimeout(() => {
                      this.setState({isGoJekLogo: false})
                    }, 3000);
                    setTimeout(() => {
                      this.setState({
                        isProsessPayment: true,
                        isLoading: false,
                        showGoPayModal: false,
                        isGoJekLogo: true
                      })
                    }, 6000);
                  })}
                />
              </View>
            </View>
          </View>
        </MyOwnModal>

        {/* ============================================= Modal GoPay ============================================= */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showGoPayModal}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'white'
            }}
          >
            {this.state.isGoJekLogo ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white'
                }}
              >
                <Image source={LogoGoJek} style={{width: 200, height: 200}} />
              </View>
            ) : (
              <Image source={GoPayProcess} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}} />
            )}
          </View>
        </Modal>
      </ManagementLayout>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})