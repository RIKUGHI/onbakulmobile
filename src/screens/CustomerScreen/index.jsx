import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, View, Modal, ToastAndroid } from 'react-native';
import { ActionButton, AddButton, Card, CommonTextInput, HeaderModal, LoadingLoadMore, ManagementLayout, MyOwnModal, NoData, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';

const defaultForm = {
  customer_name: '',
  telp: '',
  city: '',
  address: ''
}

class CustomerScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      Data: {
        key_search: '',
        first_data: 0,
        active_page: 0,
        total_pages: 0,
        results: [
          {
            id_owner: 0,
            id_outlet: 0,
            id_customer: 0,
            customer_name: 'Loading Customer Name',
            city: 'Loading City',
            address: 'Loading Address',
            telp: 'Loading Telp'
          }
        ]
      },
      inputSearch: '',
      form: defaultForm,
      isReadOnly: false,
      isLoading: false,
      indexSelected: 0,
      idCustomerSelected: 0,
      isEdit: false,
      showMainModal: false,
      showDeleteModal: false
    }
    this._handleLoadMore = this._handleLoadMore.bind(this)
    this._onSubmitSearch = this._onSubmitSearch.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onSubmitDelete = this._onSubmitDelete.bind(this)
  }
  
  componentDidMount(){
    this._firstLoad()
  }

  async _firstLoad(query){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')
      const customers_ro = await AsyncStorage.getItem('customers_ro')
      let url = query ? query : `?id_owner=${id_owner}` 

      axios.get(util.ServerUrl+'customers'+url)
      .then(res => {
        this.setState({
          Data: res.data.result,
          isReadOnly: parseInt(customers_ro) ? true : false
        })
      }).catch(err => console.log('Request Error',err))
    } catch (e) {
      console.log(e)
    }
  }

  async _handleLoadMore(){
    if (this.state.Data.active_page === this.state.Data.total_pages) {
      console.log('No more product data');
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const query = this.state.Data.key_search === 'Semua' ? `&page=${this.state.Data.active_page + 1}` : `&page=${this.state.Data.active_page + 1}&q=${this.state.Data.key_search}`
        
        axios.get(util.ServerUrl+`customers?id_owner=${id_owner}${query}`)
        .then(res => {
          this.setState({
            Data: {
              key_search: res.data.result.key_search,
              first_data: res.data.result.first_data,
              active_page: res.data.result.active_page,
              total_pages: res.data.result.total_pages,
              results: this.state.Data.results.concat(res.data.result.results)
            }
          })
        }).catch(err => console.log(err))
      } catch (e) {
        console.log(e)
      }
    }
  }

  async _onSubmitSearch(){
    if (this.state.Data.key_search.toLowerCase() === this.state.inputSearch.toLowerCase() || this.state.inputSearch === '' && this.state.Data.key_search === 'Semua') {
      console.log('search kosong karena sama atau input search kosong');
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const query = this.state.inputSearch === '' ? `id_owner=${id_owner}` : `id_owner=${id_owner}&q=${this.state.inputSearch}`
        
        axios.get(util.ServerUrl+`customers?${query}`)
        .then(res => {
          this.setState({
            Data: res.data.result
          })
        }).catch(err => console.log('Request Error',err))
      } catch (e) {
        console.log(e)
      }
    }
  }

  async _onSubmit(){
    if (this.state.form.customer_name === '') {
      ToastAndroid.show('Nama tidak boleh kosong', ToastAndroid.SHORT)
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_outlet = await AsyncStorage.getItem('id_outlet')
        const data = new FormData()
        
        data.append('id_owner', id_owner)
        data.append('id_outlet', id_outlet)
        data.append('customer_name', this.state.form.customer_name.toString().trim())
        data.append('city', this.state.form.city.toString().trim())
        data.append('address', this.state.form.address.toString().trim())
        data.append('telp', this.state.form.telp.toString().trim())
    
        this.setState({isLoading: true})
        await util.CallAPIPost('customers/'+(this.state.isEdit ? 'edit/'+this.state.idCustomerSelected : 'create'), data, (success, message) => {
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

  async _onSubmitDelete(){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')

      this.setState({isLoading: true})
      util.CallAPIDelete(`customers/delete/${this.state.idCustomerSelected}?id_owner=${id_owner}`, (success, message) => {
        this.setState({isLoading: false})
        if (success) this.setState({showDeleteModal: false})
        ToastAndroid.show(message, ToastAndroid.SHORT)
        this._firstLoad(this.state.inputSearch === '' ? `?id_owner=${id_owner}` : `?id_owner=${id_owner}&q=${this.state.inputSearch}`)
      })
    } catch (e) {
      console.log(e)
    }
  }


  render(){
    return(
      <ManagementLayout>
        <ManagementLayout.Header title={this.state.Data.key_search === 'Semua' ? undefined : `Daftar Pencarian Untuk '${this.state.Data.key_search}'`}>
          <TextInputSearch 
            placeholder='Cari pelanggan' 
            onChangeText={v => this.setState({
              inputSearch: v
            })}
            onSubmitSearch={this._onSubmitSearch}
          />
          {!this.state.isReadOnly && (
            <AddButton onPress={() => this.setState({
                isEdit: false,
                form: defaultForm,
                showMainModal: true
            })} />
          )}
        </ManagementLayout.Header>
        <FlatList
          data={this.state.Data.results} 
          renderItem={({ item, index }) => <Card
                                            index={index}
                                            totalData={this.state.Data.results.length - 1}
                                            onPress={() => this.setState({
                                              isEdit: true,
                                              indexSelected: index,
                                              idCustomerSelected: item.id_customer,
                                              form: item,
                                              showMainModal: true
                                            })} 
                                            onLongPress={() => {
                                              if (!this.state.isReadOnly) {
                                                this.setState({
                                                  indexSelected: index,
                                                  idCustomerSelected: item.id_customer,
                                                  showDeleteModal: true
                                                })
                                              }
                                            }}
                                          >
                                            <Card.SimpleData 
                                              name={item.customer_name}
                                              telp={item.telp == '' ? 'Tidak ada telp' : item.telp}
                                              city={item.city == '' ? '-' : item.city}
                                              address={item.address == '' ? 'Tidak ada alamat' : item.address}
                                            />
                                          </Card>}
          keyExtractor={item => item.id_customer}
          ListEmptyComponent={() => <NoData title='Pelanggan' />}
          ListFooterComponent={() => <LoadingLoadMore show={(!(this.state.Data.results === null) && this.state.Data.total_pages === 0) || (this.state.Data.results !== null && !(this.state.Data.active_page === this.state.Data.total_pages))} />}
          onEndReached={this._handleLoadMore}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 15
          }}
        />
        
        {/* ============================================= Modal Add/Edit Customer ============================================= */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showMainModal}
        >
          <HeaderModal
            title={`${this.state.isEdit ? 'Edit' : 'Tambah'} Pelanggan`}
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
              value={this.state.isEdit ? this.state.form.customer_name : undefined}
              onChangeText={v => this.setState({form: {...this.state.form, customer_name: v}})} 
            />
            <CommonTextInput 
              label='Kota' 
              value={this.state.isEdit ? this.state.form.city : undefined}
              onChangeText={v => this.setState({form: {...this.state.form, city: v}})} 
            />
            <CommonTextInput 
              label='Alamat' 
              value={this.state.isEdit ? this.state.form.address : undefined}
              onChangeText={v => this.setState({form: {...this.state.form, address: v}})} 
            />
            <CommonTextInput 
              label='Telp' 
              value={this.state.isEdit ? this.state.form.telp : undefined}
              onChangeText={v => this.setState({form: {...this.state.form, telp: v}})} 
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

        {/* ============================================= Modal Delete Customer ============================================= */}
        <MyOwnModal
          visible={this.state.showDeleteModal}
        >
          <MyOwnModal.Delete
            label={this.state.Data.results !== null && this.state.Data.results[this.state.indexSelected]?.customer_name}
            loading={this.state.isLoading}
            onDismiss={() => this.setState({
              showDeleteModal: false
            })}
            onDelete={this._onSubmitDelete}
          />
        </MyOwnModal>
      </ManagementLayout>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    padding: 15, 
    backgroundColor: 'white'
  },
  iconContainer: {
    backgroundColor: util.Colors.MainColor, 
    width: 30, 
    height: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 10,
    marginLeft: 10
  }
})

export default GlobalConsumer(CustomerScreen)