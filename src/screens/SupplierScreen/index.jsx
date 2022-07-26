import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, View, Modal, ToastAndroid } from 'react-native';
import { ActionButton, AddButton, Card, CommonTextInput, HeaderModal, LoadingLoadMore, ManagementLayout, MyOwnModal, NoData, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';

const defaultForm = {
  supplier_name: '',
  telp: '',
  city: '',
  address: ''
}

class SupplierScreen extends Component {
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
            id_supplier: 0,
            supplier_name: 'Loading Supplier Name',
            city: 'Loading City',
            address: 'Loading Address',
            telp: 'Loading Telp'
          }
        ]
      },
      DataAccount: {
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
        currentDateTime: '0000-00-00 00:00:00'
      },
      inputSearch: '',
      form: defaultForm,
      isReadOnly: false,
      isLoading: false,
      indexSelected: 0,
      idSupplierSelected: 0,
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
    this.props.navigation.addListener('focus', () => {
      this._firstLoad()
    })
  }

  async _firstLoad(query){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')
      const suppliers_ro = await AsyncStorage.getItem('suppliers_ro')
      let url = query ? query : `?id_owner=${id_owner}`

      axios.get(util.ServerUrl+'suppliers'+url)
      .then(res => {
        this.setState({
          Data: res.data.result,
          isReadOnly: parseInt(suppliers_ro) ? true : false 
        })
      }).catch(err => console.log('Request Error',err))

      // account
      axios.get(util.ServerUrl+'accounts/'+id_owner)
      .then(res => {
        this.setState({
          DataAccount: {
            data: res.data.result,
            currentDateTime: this._getCurrentDateTime(res.data.result.today , new Date()) < res.data.result.end ? this._getCurrentDateTime(res.data.result.today , new Date()) : res.data.result.end
          }
        })
      })
      .catch(err => console.log(err))
    } catch (e) {
      console.log(e)
    }
  }

  _getCurrentDateTime(today, now){
    return `${today} ${this._fixingTime(now.getHours())}:${this._fixingTime(now.getMinutes())}:${this._fixingTime(now.getSeconds())}`
  }

  _fixingTime(t){
    return t.toString().length === 1 ? '0'+t.toString() : t 
  }

  async _handleLoadMore(){
    if (this.state.Data.active_page === this.state.Data.total_pages) {
      console.log('No more product data');
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const query = this.state.Data.key_search === 'Semua' ? `&page=${this.state.Data.active_page + 1}` : `&page=${this.state.Data.active_page + 1}&q=${this.state.Data.key_search}`
        
        axios.get(util.ServerUrl+`suppliers?id_owner=${id_owner}${query}`)
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
        
        axios.get(util.ServerUrl+`suppliers?${query}`)
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
    if (this.state.form.supplier_name === '') {
      ToastAndroid.show('Nama tidak boleh kosong', ToastAndroid.SHORT)
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_outlet = await AsyncStorage.getItem('id_outlet')
        const data = new FormData()
        
        data.append('id_owner', id_owner)
        data.append('id_outlet', id_outlet)
        data.append('supplier_name', this.state.form.supplier_name.toString().trim())
        data.append('city', this.state.form.city.toString().trim())
        data.append('address', this.state.form.address.toString().trim())
        data.append('telp', this.state.form.telp.toString().trim())
    
        this.setState({isLoading: true})
        await util.CallAPIPost('suppliers/'+(this.state.isEdit ? 'edit/'+this.state.idSupplierSelected : 'create'), data, (success, message) => {
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
      util.CallAPIDelete(`suppliers/delete/${this.state.idSupplierSelected}?id_owner=${id_owner}`, (success, message) => {
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
      <ManagementLayout 
        locked={this.state.DataAccount.data.is_pro && this.state.DataAccount.currentDateTime < this.state.DataAccount.data.end ? false : true}
        goToUpgrade={() => this.props.navigation.navigate('Upgrade')}
      >
        <ManagementLayout.Header title={this.state.Data.key_search === 'Semua' ? undefined : `Daftar Pencarian Untuk '${this.state.Data.key_search}'`}>
          <TextInputSearch 
            placeholder='Cari supplier' 
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
                                              idSupplierSelected: item.id_supplier,
                                              form: item,
                                              showMainModal: true
                                            })} 
                                            onLongPress={() => {
                                              if (!this.state.isReadOnly) {
                                                this.setState({
                                                  indexSelected: index,
                                                  idSupplierSelected: item.id_supplier,
                                                  showDeleteModal: true
                                                })
                                              }
                                            }}
                                          >
                                            <Card.SimpleData 
                                              name={item.supplier_name}
                                              telp={item.telp == '' ? 'Tidak ada telp' : item.telp}
                                              city={item.city == '' ? '-' : item.city}
                                              address={item.address == '' ? 'Tidak ada alamat' : item.address}
                                            />
                                          </Card>}
          keyExtractor={item => item.id_supplier}
          ListEmptyComponent={() => <NoData title='Supplier' />}
          ListFooterComponent={() => <LoadingLoadMore show={(!(this.state.Data.results === null) && this.state.Data.total_pages === 0) || (this.state.Data.results !== null && !(this.state.Data.active_page === this.state.Data.total_pages))} />}
          onEndReached={this._handleLoadMore}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 15
          }}
        />
        
        {/* ============================================= Modal Add/Edit Supplier ============================================= */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showMainModal}
        >
          <HeaderModal
            title={`${this.state.isEdit ? 'Edit' : 'Tambah'} Supplier`}
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
              value={this.state.isEdit ? this.state.form.supplier_name : undefined}
              onChangeText={v => this.setState({form: {...this.state.form, supplier_name: v}})} 
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

        {/* ============================================= Modal Delete Supplier ============================================= */}
        <MyOwnModal
          visible={this.state.showDeleteModal}
        >
          <MyOwnModal.Delete
            label={this.state.Data.results !== null && this.state.Data.results[this.state.indexSelected]?.supplier_name}
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

export default GlobalConsumer(SupplierScreen)