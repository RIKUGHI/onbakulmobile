import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Text, Modal, ScrollView, ToastAndroid } from 'react-native';
import { ActionButton, AddButton, BottomSheet, Card, CommonTextInput, HeaderModal, LoadingLoadMore, ManagementLayout, MyOwnModal, NoData, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';
import DetailTransaction from '../HistoryTransactionScreen/DetailTransaction';

const defaultForm = {
  supplier: {},
  product: {},
  quantity: 0,
  price: 0,
  note: ''
}

class PurchaseScreen extends Component {
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
            id_purchase: 0,
            status: false,
            id_product: {
              id_owner: 0,
              id_product: 0,
              product_img: null,
              product_name: 'Loading Product Name',
              barcode: '',
              id_category: 0,
              capital_price: 0,
              selling_price: 0,
              available_stock: false,
              id_unit: {
                id_owner: 0,
                id_unit: 0,
                unit_name: 'Loading Unit Name'
              },
              stock_quantity: 1,
              stock_min: 0
            },
            product_name: 'Loading Product name',
            quantity: 1,
            price: 0,
            id_supplier: {
              id_owner: 0,
              id_outlet: 0,
              id_supplier: 0,
              supplier_name: 'Loading Supplier Name',
              city: 'Loading City',
              address: '',
              telp: 'Loading Telp'
            },
            date: '0000-00-00',
            time: '00:00:00',
            note: ''
          }
        ]
      },
      DataProduct: [
        {
          id_owner: 0,
          id_product: 0,
          product_img: null,
          product_name: 'Loading Product Name',
          barcode: '',
          id_category: {
            id_owner: 0,
            id_category: 0,
            category_name: 'Loading Category Name'
          },
          capital_price: 0,
          selling_price: 0,
          available_stock: false,
          id_unit: {
            id_owner: 0,
            id_unit: 0,
            unit_name: 'Loading Unit Nmae'
            },
          stock_quantity: 0,
          stock_min: 0,
          variants: [
            {
              id_product: 0,
              id_variant: 0,
              variant_name: 'Loading Variant Name',
              capital_price: 0,
              selling_price: 0,
              available_stock: false,
              id_unit: {
                id_owner: 0,
                id_unit: 0,
                unit_name: 'Loading Unit Name 2'
              },
              stock_quantity: 0,
              stock_min: 0
            }
          ]
        }
      ],
      DataSupplier: [
        {
          id_owner: 0,
          id_outlet: 0,
          id_supplier: 0,
          supplier_name: 'Loading Supplier Name',
          city: 'Loading City',
          address: 'Loading Address',
          telp: 'Loading Telp'
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
      isLoading: false,
      isProduct: false,
      indexSelected: 0,
      idPurchaseSelected: 0,
      showMainModal: false,
      showSecondaryModal: false,
      showDeleteModal: false,
      showModalPurchaseDetail: false
    }
    this._handleLoadMore = this._handleLoadMore.bind(this)
    this._onSubmitSearch = this._onSubmitSearch.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onSubmitConfirm = this._onSubmitConfirm.bind(this)
    this._onSubmitDelete = this._onSubmitDelete.bind(this)
  }

  componentDidMount(){
    this.props.navigation.addListener('focus', () => {
      this._firstLoad()
    })
  }

  async _firstLoad(query){
    try {
      const level = await AsyncStorage.getItem('level') 
      const id_owner = await AsyncStorage.getItem('id_owner') 
      const id_outlet = await AsyncStorage.getItem('id_outlet') 
      const id_category = await AsyncStorage.getItem('id_category') 
      let purchaseUrl = ''
      let productUrl = ''

      // purchases
      if (parseInt(level) === 0) {
        purchaseUrl = query ? query : `?id_owner=${id_owner}`
        productUrl = `?id_owner=${id_owner}`
      } else {
        purchaseUrl = query ? query : `?id_owner=${id_owner}&id_outlet=${id_outlet}`
        productUrl = `?id_owner=${id_owner}&id_category=${id_category}`
      }

      axios.get(util.ServerUrl+'purchases'+purchaseUrl)
      .then(res => {
        this.setState({
          Data: res.data.result
        })
      }).catch(err => console.log('Request Error',err))
  
      // products
      axios.get(util.ServerUrl+'products'+productUrl)
      .then(res => {
        this.setState({
          DataProduct: res.data.result.results
        })
      }).catch(err => console.log('Request Error',err))
  
      // suppliers
      axios.get(util.ServerUrl+`suppliers?id_owner=${id_owner}`)
      .then(res => {
        this.setState({
          DataSupplier: res.data.result.results
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
        const level = await AsyncStorage.getItem('level') 
        const id_owner = await AsyncStorage.getItem('id_owner') 
        const id_outlet = await AsyncStorage.getItem('id_outlet') 
        const query = this.state.Data.key_search === 'Semua' ? `&page=${this.state.Data.active_page + 1}` : `&page=${this.state.Data.active_page + 1}&q=${this.state.Data.key_search}`
        let purchaseUrl = ''

        if (parseInt(level) === 0) {
          purchaseUrl = `?id_owner=${id_owner}`
        } else {
          purchaseUrl = `?id_owner=${id_owner}&id_outlet=${id_outlet}`
        }

        axios.get(util.ServerUrl+`purchases${purchaseUrl}${query}`)
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
    try {
      const level = await AsyncStorage.getItem('level') 
      const id_owner = await AsyncStorage.getItem('id_owner') 
      const id_outlet = await AsyncStorage.getItem('id_outlet') 
      let query = ''

      if (parseInt(level) === 0) {
        query = this.state.inputSearch === '' ? `id_owner=${id_owner}` : `id_owner=${id_owner}&q=${this.state.inputSearch}`
      } else {
        query = this.state.inputSearch === '' ? `id_owner=${id_owner}&id_outlet=${id_outlet}` : `id_owner=${id_owner}&id_outlet=${id_outlet}&q=${this.state.inputSearch}`
      }

      axios.get(util.ServerUrl+`purchases?${query}`)
      .then(res => {
        this.setState({
          Data: res.data.result
        })
      }).catch(err => console.log('Request Error',err))
    } catch (e) {
      console.log(e)
    }
  }

  async _onSubmit(){
    if (Object.keys(this.state.form.supplier).length === 0) {
      ToastAndroid.show('Supplier wajib diisi', ToastAndroid.SHORT)
    } else if (Object.keys(this.state.form.product).length === 0) {
      ToastAndroid.show('Produk wajib diisi', ToastAndroid.SHORT)
    } else if (parseInt(this.state.form.price) === 0 || this.state.form.price === '') {
      ToastAndroid.show('Harga wajib diisi', ToastAndroid.SHORT)
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_outlet = await AsyncStorage.getItem('id_outlet')

        const data = new FormData()
  
        data.append('id_owner', id_owner)
        data.append('id_outlet', id_outlet)
        data.append('id_product', this.state.form.product.id_product.toString())
        data.append('product_name', this.state.form.product.product_name.toString())
        data.append('quantity', this.state.form.quantity.toString().trim())
        data.append('price', this.state.form.price.toString().trim())
        data.append('id_supplier', this.state.form.supplier.id_supplier)
        data.append('note', this.state.form.note)
  
    
        this.setState({isLoading: true})
        await util.CallAPIPost('purchases/create', data, (success, message) => {
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

  async _onSubmitConfirm() {
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')      
      const id_outlet = await AsyncStorage.getItem('id_outlet')      
      const data = new FormData()
  
      data.append('id_owner', id_owner)
      data.append('id_outlet', id_outlet)
      data.append('status', '1')
  
  
      this.setState({isLoading: true})
      await util.CallAPIPost('purchases/edit/'+this.state.idPurchaseSelected, data, (success, message) => {
        this.setState({isLoading: false})
        if (success) this.setState({showModalPurchaseDetail: false})
        ToastAndroid.show(message, ToastAndroid.SHORT)
        // this._firstLoad()
        this._onSubmitSearch()
      })
    } catch (e) {
      console.log(e)
    }
  }

  async _onSubmitDelete(){
    try {
      const level = await AsyncStorage.getItem('level')
      const id_owner = await AsyncStorage.getItem('id_owner')
      const id_outlet = await AsyncStorage.getItem('id_outlet')
      let url = ''

      if (parseInt(level) === 0) {
        url = this.state.inputSearch === '' ? `?id_owner=${id_owner}` : `?id_owner=${id_owner}&q=${this.state.inputSearch}`
      } else {
        url = this.state.inputSearch === '' ? `?id_owner=${id_owner}&id_outlet=${id_outlet}` : `?id_owner=${id_owner}&id_outlet=${id_outlet}&q=${this.state.inputSearch}`
      }

      this.setState({isLoading: true})
      util.CallAPIDelete(`purchases/delete/${this.state.idPurchaseSelected}?id_owner=${id_owner}&id_outlet=${id_outlet}`, (success, message) => {
        this.setState({isLoading: false})
        if (success) this.setState({showDeleteModal: false})
        ToastAndroid.show(message, ToastAndroid.SHORT)
        this._firstLoad(url)
      })
    } catch (e) {
      console.log(e)
    }
  }

  render(){
    const dataDetail = this.state.Data.results !== null ? this.state.Data.results[this.state.indexSelected] : null
    
    return(
      <ManagementLayout
        locked={this.state.DataAccount.data.is_pro && this.state.DataAccount.currentDateTime < this.state.DataAccount.data.end ? false : true}
        goToUpgrade={() => this.props.navigation.navigate('Upgrade')}
      >
        <ManagementLayout.Header title={this.state.Data.key_search === 'Semua' ? undefined : `Daftar Pencarian Untuk '${this.state.Data.key_search}'`}>
          <TextInputSearch 
            placeholder='Cari pembelian' 
            onChangeText={v => this.setState({
              inputSearch: v
            })}
            onSubmitSearch={this._onSubmitSearch}
          />
          <AddButton onPress={() => this.setState({
            form: defaultForm,
            showMainModal: true
          })} />
        </ManagementLayout.Header>
        <FlatList
          data={this.state.Data.results} 
          renderItem={({ item, index }) => <Card
                                            index={index}
                                            totalData={this.state.Data.results.length - 1}
                                            onPress={() => this.setState({
                                              indexSelected: index,
                                              idPurchaseSelected: item.id_purchase,
                                              showModalPurchaseDetail: true
                                            })} 
                                          >
                                            <Card.Purchase 
                                              status={item.status}
                                              name={item.product_name}
                                              supplier={item.id_supplier.supplier_name}
                                              quantity={item.quantity}
                                              unit={item.id_product.id_unit.unit_name}
                                              price={item.price}
                                            />
                                          </Card>}
          keyExtractor={item => item.id_purchase}
          ListEmptyComponent={() => <NoData title='Pembelian' />}
          ListFooterComponent={() => <LoadingLoadMore show={(!(this.state.Data.results === null) && this.state.Data.total_pages === 0) || (this.state.Data.results !== null && !(this.state.Data.active_page === this.state.Data.total_pages))} />}
          onEndReached={this._handleLoadMore}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 15
          }}
        />

        {/* ============================================= Modal Add Purchase ============================================= */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showMainModal}
        >
          <HeaderModal
            title='Tambah Pembelian'
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
              label='Supplier' 
              disable 
              defaultValue='Pilih Supplier' 
              value={Object.keys(this.state.form.supplier).length === 0 ? undefined : this.state.form.supplier.supplier_name}
              onPress={() => this.setState({
                isProduct: false,
                showSecondaryModal: true
              })} />
            <CommonTextInput 
              label='Nama' 
              disable 
              defaultValue='Pilih Produk' 
              value={Object.keys(this.state.form.product).length === 0 ? undefined : this.state.form.product.product_name}
              onPress={() => this.setState({
                isProduct: true,
                showSecondaryModal: true
              })} />
            <CommonTextInput 
              label='Harga' 
              number
              onChangeText={v => this.setState({form :{...this.state.form, price: v}})}
            />
            <CommonTextInput 
              label='Jumlah' 
              number
              onChangeText={v => this.setState({form :{...this.state.form, quantity: v}})}
            />
            <CommonTextInput 
              label='Satuan' 
              disable
              value={Object.keys(this.state.form.product).length === 0 ? undefined : this.state.form.product.id_unit.unit_name}
            />
            <CommonTextInput 
              label='Catatan' 
              onChangeText={v => this.setState({form :{...this.state.form, note: v}})}
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

        {/* ============================================= Modal Supplier And Products ============================================= */}
        <MyOwnModal visible={this.state.showSecondaryModal}>
          <MyOwnModal.Purchase
            title={this.state.isProduct ? 'Produk' : 'Supplier'}
            isLoading={this.state.isLoading}
            list={this.state.isProduct ? this.state.DataProduct : this.state.DataSupplier}
            isProduct={this.state.isProduct}
            onPress={(item) => {
              if (this.state.isProduct) {
                if (item.available_stock) {
                  this.setState({
                    form: {
                      ...this.state.form,
                      product: item
                    },
                    showSecondaryModal: false
                  })
                } else {
                  ToastAndroid.show('Produk ini tidak mempunyai stok', ToastAndroid.SHORT)
                }
              } else {
                this.setState({
                  form: {
                    ...this.state.form,
                    supplier: item
                  },
                  showSecondaryModal: false
                })
              }
            }}
            onDismiss={() => this.setState({
              showSecondaryModal: false
            })}
          />
        </MyOwnModal>

        {/* Modal Purchase Detail */}
        <BottomSheet
          title='Detail Pembelian'
          show={this.state.showModalPurchaseDetail}
          onDismiss={() => this.setState({
            showModalPurchaseDetail: false
          })}
        >
          <View style={{padding: 15}}>
            <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>Toko Sembako</Text>
            <DetailTransaction>
              <DetailTransaction.Common label={{text: 'Supplier', bold: false}} value={{text: dataDetail && dataDetail.id_supplier.supplier_name, bold: false}} />
              <DetailTransaction.Common label={{text: 'Nama Barang', bold: false}} value={{text: dataDetail && dataDetail.product_name, bold: false}} />
              <DetailTransaction.Common label={{text: 'Jumlah', bold: false}} value={{text: dataDetail && dataDetail.quantity, bold: false}} />
              <DetailTransaction.Common label={{text: 'Harga', bold: false}} value={{text: dataDetail && util.formatRupiah(dataDetail.price), bold: false}} disableMarginBottom />
            </DetailTransaction>
            <View style={{flexDirection: 'row'}}>
              <ActionButton 
                label='Hapus' 
                backgroundColor='red' 
                enableMarginRight 
                loading={this.state.isLoading}
                onPress={() => this.setState({
                  showModalPurchaseDetail: false,
                  showDeleteModal: true
                })}
              />
              <ActionButton 
                label='Konfirmasi' 
                loading={this.state.isLoading}
                backgroundColor={util.Colors.MainColor} 
                onPress={this._onSubmitConfirm}
              />
            </View>
          </View>
        </BottomSheet>

        {/* ============================================= Modal Delete Purchase ============================================= */}
        <MyOwnModal
          visible={this.state.showDeleteModal}
        >
          <MyOwnModal.Delete
            label={this.state.Data.results !== null && this.state.Data.results[this.state.indexSelected]?.product_name}
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

export default GlobalConsumer(PurchaseScreen)