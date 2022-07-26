import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Pressable, StyleSheet, Text, Modal, ScrollView, View, ToastAndroid, Image } from 'react-native';
import { CommonTextInput, HeaderModal, ManagementLayout, ActionButton } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';
import InfoItem from './InfoItem';

const defaultForm = {
  owner_name: '',
  business_name: '',
  telp: '',
  email: '',
  password: ''
}

class AccountScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      Data: {
        id_owner: 0,
        created_at: '0000-00-00',
        business_name: 'Loading Business Name',
        owner_name: '',
        owner_code: '',
        telp: '',
        email: '',
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
      DataOutlet : {
        id_owner: 0,
        id_outlet: 0,
        owner_code: '',
        outlet_name: 'Loading Outlet Namee',
        city: '',
        address: '',
        telp: "0"
      },
      level: 0,
      readOnly: false,
      form : defaultForm,
      showMainModal: false,
    }
    this._onSubmit = this._onSubmit.bind(this)
  }

  componentDidMount(){
    this._firstLoad()
  }

  async _firstLoad(){
    try {
      const level = await AsyncStorage.getItem('level')
      const id_owner = await AsyncStorage.getItem('id_owner')
      const id_outlet = await AsyncStorage.getItem('id_outlet')
      const purchases_ro = await AsyncStorage.getItem('purchases_ro')

      axios.get(util.ServerUrl+'accounts/'+id_owner)
      .then(res => {
        this.setState({
          level: parseInt(level),
          readOnly: parseInt(purchases_ro) ? true : false,
          Data: res.data.result,
          DataOutlet: res.data.result.outlets.filter(d => d.id_outlet === parseInt(id_outlet))[0]
        })
      }).catch(err => console.log('Request Error',err))
    } catch (e) {
      console.log(e)
    }
  }

  async _onSubmit(){
    if (this.state.form.owner_name === '') {
      ToastAndroid.show('Nama tidak boleh kosong', ToastAndroid.SHORT)
    } else if (this.state.form.business_name === '') {
      ToastAndroid.show('Nama usaha tidak boleh kosong', ToastAndroid.SHORT)
    } else if (this.state.form.email === '') {
      ToastAndroid.show('Email tidak boleh kosong', ToastAndroid.SHORT)
    } else if (this.state.form.password !== '' && this.state.form.password.length < 4) {
      ToastAndroid.show('Password minimal lebih dari 3 karakter', ToastAndroid.SHORT)
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const data = new FormData()
        
        data.append('owner_name', this.state.form.owner_name.toString().trim())
        data.append('business_name', this.state.form.business_name.toString().trim())
        data.append('telp', this.state.form.telp.toString().trim())
        data.append('email', this.state.form.email.toString().trim())
        data.append('password', this.state.form.password.toString().trim())
    
        this.setState({isLoading: true})
        await util.CallAPIPost('accounts/edit/'+id_owner, data, (success, message) => {
          this.setState({isLoading: false})
          if (success) this.setState({showMainModal: false})
          ToastAndroid.show(message, ToastAndroid.SHORT)
          this._firstLoad()
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  render(){
    return(
      <ManagementLayout>
        {
          this.state.level === 0 ? (
            <View>
              <View style={{alignItems: 'center', marginBottom: 20}}>
                <Image source={{uri: util.FakeImageUrl}} style={{width: 120, height: 120, borderRadius: 15}} />
              </View>
              <InfoItem title='Nama Pemilik' value={this.state.Data.owner_name} />
              <InfoItem title='Nama Usaha' value={this.state.Data.business_name} />
              <InfoItem title='Total Cabang' value={this.state.Data.outlets.length} />
              <InfoItem title='Telp' value={this.state.Data.telp} />
              <InfoItem title='Email' value={this.state.Data.email} />
            </View>
          ) : (
            <View>
              <InfoItem title='Nama Pemilik' value={this.state.Data.owner_name} />
              <InfoItem title='Nama Cabang' value={this.state.DataOutlet.outlet_name} />
              <InfoItem title='Telp' value={this.state.DataOutlet.telp} />
            </View>
          )
        }
        {!this.state.readOnly && (
          <Pressable style={{
              backgroundColor: util.Colors.MainColor,
              height: 42,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
              marginTop: 30
            }}
            onPress={() => this.setState({
              form : {
                owner_name: this.state.Data.owner_name,
                business_name: this.state.Data.business_name,
                telp: this.state.Data.telp,
                email: this.state.Data.email,
                password: ''
              },
              showMainModal: true
            })}
          >
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>Ubah</Text>
          </Pressable>
        )}

        {/* ============================================= Modal Edit Account ============================================= */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showMainModal}
        >
          <HeaderModal
            title='Edit Akun'
            onDismiss={() => this.setState({
              showMainModal: false
            })}
          />
          <ScrollView  
            style={{
              flex: 1,
              backgroundColor: 'white'
            }}
            contentContainerStyle={{
              padding: 15
            }}
            showsVerticalScrollIndicator={false}
          >
            <CommonTextInput 
              label='Nama' 
              value={this.state.form.owner_name}
              onChangeText={v => this.setState({form: {...this.state.form, owner_name: v}})} 
            />
            <CommonTextInput 
              label='Nama Usaha'
              value={this.state.form.business_name} 
              onChangeText={v => this.setState({form: {...this.state.form, business_name: v}})} 
            />
            <CommonTextInput 
              label='Telp' 
              value={this.state.form.telp}
              onChangeText={v => this.setState({form: {...this.state.form, telp: v}})} 
            />
            <CommonTextInput 
              label='Email' 
              value={this.state.form.email}
              onChangeText={v => this.setState({form: {...this.state.form, email: v}})} 
            />
            <CommonTextInput 
              label='Password (Optional)' 
              secureTextEntry
              onChangeText={v => this.setState({form: {...this.state.form, password: v}})} 
            />
            <View style={{
              flexDirection: 'row',
              marginTop: 8
            }}>
              <ActionButton 
                label='Batal' 
                enableMarginRight 
                onPress={() => this.setState({
                  showMainModal: false
                })}
              />
              <ActionButton 
                label='Simpan' 
                loading={this.state.isLoading}
                onPress={this._onSubmit}
              />
            </View>
          </ScrollView>
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

export default GlobalConsumer(AccountScreen)