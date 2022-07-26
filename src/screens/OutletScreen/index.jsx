import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, View, Modal, Text, ToastAndroid } from 'react-native';
// import Checkbox from '@react-native-community/checkbox';
import { ActionButton, AddButton, BottomSheet, Card, CommonTextInput, HeaderModal, LoadingLoadMore, ManagementLayout, MyOwnModal, NoData, SimpleData, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';
import Privilege from './Privilege';

const defaultForm = {
  pin: '',
  outlet_name: '',
  id_category: 0,
  city: '',
  address: '',
  telp: '',
  products_ro: 1,
  units_ro: 1,
  categories_ro: 1,
  customers_ro: 1,
  suppliers_ro: 1,
  outlets_ro: 1,
  transactions_ro: 1,
  purchases_ro: 1
}

class OutletScreen extends Component {
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
            id_category: {
              id_owner: 0,
              id_category: 0,
              category_name: 'Loading Category Name'
            },
            loginable: true,
            owner_code: 'Loading Owner Code',
            pin: '',
            outlet_name: 'Loading Outlet Name',
            city: 'Loading City',
            address: '',
            telp: 'Loading Telp',
            products_ro: true,
            units_ro: true,
            categories_ro: true,
            customers_ro: true,
            suppliers_ro: true,
            outlets_ro: true,
            transactions_ro: true,
            purchases_ro: true
          }
        ]
      },
      DataCategory: [
        {
          id_owner: 0,
          id_category: 0,
          category_name: 'Loading Category Name'
        }
      ],
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
      owner_code: 'OB-00000',
      isReadOnly: false,
      isLoading: false,
      indexSelected: 0,
      idOutletSelected: 0,
      isEdit: false,
      showMainModal: false,
      showModalDetail: false,
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
      this._categoryLoad()
    })
  }

  async _firstLoad(query){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')
      const outlets_ro = await AsyncStorage.getItem('outlets_ro')
      const owner_code = await AsyncStorage.getItem('owner_code')
      let url = query ? query : `?id_owner=${id_owner}`

      axios.get(util.ServerUrl+'outlets'+url)
      .then(res => {
        this.setState({
          Data: res.data.result,
          isReadOnly: parseInt(outlets_ro) ? true : false,
          owner_code: owner_code
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

  async _categoryLoad(){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')

      axios.get(util.ServerUrl+`categories?id_owner=${id_owner}`)
      .then(res => {
        this.setState({
          DataCategory: res.data.result.results
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
        
        axios.get(util.ServerUrl+`outlets?id_owner=${id_owner}${query}`)
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
        
        axios.get(util.ServerUrl+`outlets?${query}`)
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
    if (this.state.form.pin === '') {
      ToastAndroid.show('Pin tidak boleh kosong', ToastAndroid.SHORT)
    } else if (this.state.form.pin.length < 4) {
      ToastAndroid.show('Pin minimal 4 digit', ToastAndroid.SHORT)
    } else if (this.state.form.outlet_name === '') {
      ToastAndroid.show('Nama tidak boleh kosong', ToastAndroid.SHORT)
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const data = new FormData()
        
        data.append('id_owner', id_owner)
        data.append('owner_code', this.state.owner_code)
        data.append('pin', this.state.form.pin.toString().trim())
        data.append('outlet_name', this.state.form.outlet_name.toString().trim())
        data.append('id_category', this.state.form.id_category.toString().trim())
        data.append('city', this.state.form.city.toString().trim())
        data.append('address', this.state.form.address.toString().trim())
        data.append('telp', this.state.form.telp.toString().trim())
        data.append('products_ro', this.state.form.products_ro) 
        data.append('units_ro', this.state.form.units_ro) 
        data.append('categories_ro', this.state.form.categories_ro) 
        data.append('customers_ro', this.state.form.customers_ro) 
        data.append('suppliers_ro', this.state.form.suppliers_ro) 
        data.append('outlets_ro', this.state.form.outlets_ro) 
        data.append('transactions_ro', this.state.form.transactions_ro) 
        data.append('purchases_ro', this.state.form.purchases_ro) 
    
        this.setState({isLoading: true})
        await util.CallAPIPost('outlets/'+(this.state.isEdit ? 'edit/'+this.state.idOutletSelected : 'create'), data, (success, message) => {
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
      util.CallAPIDelete(`outlets/delete/${this.state.idOutletSelected}?id_owner=${id_owner}`, (success, message) => {
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
            placeholder='Cari outlet' 
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
                                            onPress={item.loginable ? () => this.setState({
                                              isEdit: true,
                                              indexSelected: index,
                                              idOutletSelected: item.id_outlet,
                                              form: {
                                                pin: item.pin,
                                                outlet_name: item.outlet_name,
                                                id_category: parseInt(item.id_category.id_category),
                                                city: item.city,
                                                address: item.address,
                                                telp: item.telp,
                                                products_ro: item.products_ro ? 1 : 0,
                                                units_ro: item.units_ro ? 1 : 0,
                                                categories_ro: item.categories_ro ? 1 : 0,
                                                customers_ro: item.customers_ro ? 1 : 0,
                                                suppliers_ro: item.suppliers_ro ? 1 : 0,
                                                outlets_ro: item.outlets_ro ? 1 : 0,
                                                transactions_ro: item.transactions_ro ? 1 : 0,
                                                purchases_ro: item.purchases_ro ? 1 : 0
                                              },
                                              showMainModal: true
                                            }) : undefined} 
                                            onLongPress={item.loginable ? () => {
                                              if (!this.state.isReadOnly) {
                                                this.setState({
                                                  indexSelected: index,
                                                  idOutletSelected: item.id_outlet,
                                                  showDeleteModal: true
                                                })
                                              }
                                            } : undefined}
                                          >
                                            <Card.SimpleData 
                                              name={item.outlet_name}
                                              telp={item.telp == '0' ? 'Tidak ada Telp' : item.telp}
                                              city={item.city == '' ? '-' : item.city}
                                              address={item.address == '' ? 'Tidak ada alamat' : item.address} 
                                            />
                                          </Card>}
          keyExtractor={item => item.id_outlet}
          ListEmptyComponent={() => <NoData title='Outlet' />}
          ListFooterComponent={() => <LoadingLoadMore show={(!(this.state.Data.results === null) && this.state.Data.total_pages === 0) || (this.state.Data.results !== null && !(this.state.Data.active_page === this.state.Data.total_pages))} />}
          onEndReached={this._handleLoadMore}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 15
          }}
        />

        {/* ============================================= Modal Add/Edit Outlet ============================================= */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showMainModal}
        >
          <HeaderModal
            title={`${this.state.isEdit ? 'Edit' : 'Tambah'} Outlet`}
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
              label='Kode Pemilik' 
              disable
              defaultValue={this.state.owner_code}
            />
            <CommonTextInput 
              label='Pin' 
              value={this.state.isEdit ? this.state.form.pin : undefined}
              onChangeText={v => this.setState({form :{...this.state.form, pin: v}})} 
            />
            <CommonTextInput 
              label='Nama' 
              value={this.state.isEdit ? this.state.form.outlet_name : undefined}
              onChangeText={v => this.setState({form :{...this.state.form, outlet_name: v}})} 
            />
            <Picker 
              style={{backgroundColor: util.Colors.SecondaryWhite, flex: 1, height: 42, marginTop: 6}}
              selectedValue={this.state.form.id_category}
              mode='dropdown'
              onValueChange={(v, i) => this.setState({
                form: {
                  ...this.state.form,
                  id_category: v
                }
              })}
            >
              {this.state.DataCategory.map((d, i) => <Picker.Item key={i} label={d.category_name} value={d.id_category} />)}
            </Picker>
            <CommonTextInput 
              label='Kota' 
              value={this.state.isEdit ? this.state.form.city : undefined}
              onChangeText={v => this.setState({form :{...this.state.form, city: v}})}
            />
            <CommonTextInput 
              label='Alamat' 
              value={this.state.isEdit ? this.state.form.address : undefined}
              onChangeText={v => this.setState({form :{...this.state.form, address: v}})}
            />
            <CommonTextInput 
              label='Telp' 
              value={this.state.isEdit ? this.state.form.telp : undefined}
              onChangeText={v => this.setState({form :{...this.state.form, telp: v}})}
            />
            <View style={{marginTop: 8}}>
              <Text Text style={{color: util.Colors.MainColor, fontSize: 18, fontWeight: 'bold', marginBottom: 5}}>Hak Akses</Text>
              <Privilege 
                label='Produk'
                value={this.state.form.products_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    products_ro: newValue
                  }
                })}
              />
              <Privilege 
                label='Satuan'
                value={this.state.form.units_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    units_ro: newValue
                  }
                })}
              />
              <Privilege 
                label='Kategori'
                value={this.state.form.categories_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    categories_ro: newValue
                  }
                })}
              />
              <Privilege 
                label='Pelanggan'
                value={this.state.form.customers_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    customers_ro: newValue
                  }
                })}
              />
              <Privilege 
                label='Supplier'
                value={this.state.form.suppliers_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    suppliers_ro: newValue
                  }
                })}
              />
              <Privilege 
                label='Outlet'
                value={this.state.form.outlets_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    outlets_ro: newValue
                  }
                })}
              />
              <Privilege 
                label='Riwayat Transaksi'
                value={this.state.form.transactions_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    transactions_ro: newValue
                  }
                })}
              />
              <Privilege 
                label='Akun'
                value={this.state.form.purchases_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    purchases_ro: newValue
                  }
                })}
              />
            </View>
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

        {/* Modal Detail Outlet */}
        <BottomSheet
          title='Detail Outlet'
          show={this.state.showModalDetail}
          onDismiss={() => this.setState({
            showModalDetail: false
          })}
        >
          <View
            style={{
              padding: 15
            }}
          >
            <SimpleData>
              <SimpleData.Item label='Kode Pemilik' value='OBAA-0012' />
              <SimpleData.Item label='Pin' value='123' />
              <SimpleData.Item label='Nama' value='Cabang 1' />
              <SimpleData.Item label='Kota' value='Jakarta' />
              <SimpleData.Item label='Alamat' value='Jln. Raya no 1' />
              <SimpleData.Item label='Telp' value='0896898771' />
            </SimpleData>
            <Privilege 
                disabled={true}
                label='Produk'
                value={this.state.form.products_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    products_ro: newValue
                  }
                })}
              />
            <Privilege 
                disabled={true}
                label='Satuan'
                value={this.state.form.products_ro ? true : false} 
                onValueChange={newValue => this.setState({
                  form: {
                    ...this.state.form,
                    products_ro: newValue
                  }
                })}
              />
          </View>
        </BottomSheet>

        {/* ============================================= Modal Delete Outlet ============================================= */}
        <MyOwnModal
          visible={this.state.showDeleteModal}
        >
          <MyOwnModal.Delete
            label={this.state.Data.results !== null && this.state.Data.results[this.state.indexSelected]?.outlet_name}
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

export default GlobalConsumer(OutletScreen)