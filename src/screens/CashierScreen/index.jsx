import { faBell, faCamera, faCaretDown, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, ToastAndroid, View } from 'react-native';
import EmptyCart from '../../assets/img/empty_cart.svg';
import SuccessTransaction from '../../assets/img/success.svg';
import { ActionButton, BottomSheet, Card, HeaderButton, LoadingLoadMore, ManagementLayout, MyOwnModal, NoData, SimpleData, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';
import CartItem from './CartItem';
import SimpleGroup from './SimpleGroup';

const defaultDataCustomer = [
  {
    id_owner: 0,
    id_outlet: 0,
    id_customer: 0,
    customer_name: 'Umum',
    city: '',
    address: '',
    telp: ''
  }
]

class CashierScreen extends Component {
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
        ]
      },
      DataCart: [
        {
          id_owner: 0,
          id_outlet: 0,
          is_variant: false,
          id_product: 0,
          product_name: 'Loading Product Name',
          quantity: 1,
          selling_price: 0,
          capital_price: 0,
          detail: {
            id_owner: 0,
            id_product: 0,
            product_img: null,
            product_name: 'Loading Product Name',
            barcode: '',
            id_category: 0,
            capital_price: 0,
            selling_price: 0,
            available_stock: false,
            id_unit: 0,
            stock_quantity: 1,
            stock_min: 0
          }
        }
      ],
      DataCustomer: defaultDataCustomer,
      DataSuccess: {
        date: '0000-00-00',
        discount: 0,
        grand_total: 0,
        id_transaction: 0,
        invoice: 'Loading Invoice',
        paid_off: 0,
        payment: 0,
        time: '00:00:00'
      },
      DataNotif: null,
      inputSearch: '',
      customerNameSelected: 'Umum',
      discount: 0,
      paid_off: 0,
      isLoading: false,
      isAddMode: false,
      indexSelected: 0,
      showCart: false,
      showModalDetail: false,
      showCustomerModal: false,
      showSuccessTransactionModal: false
    }
    this._handleLoadMore = this._handleLoadMore.bind(this)
    this._onSubmitSearch = this._onSubmitSearch.bind(this)
    this._addToCart = this._addToCart.bind(this)
    this._addVariantToCart = this._addVariantToCart.bind(this)
    this._onSubmitNewData = this._onSubmitNewData.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._notifLoad = this._notifLoad.bind(this)
  }

  componentDidMount(){
    this.props.navigation.setOptions({
      headerRight: () => <>
        <HeaderButton 
          icon={faBell} 
          warning={this.state.DataNotif !== null}
          marginRight 
          onPress={() => this.props.navigation.navigate('Notif')}
        />
        <HeaderButton 
          icon={faShoppingCart}
          warning={this.state.DataCart !== null}
          onPress={() => this.setState({
            showCart: true,
            customerNameSelected: 'Umum',
            paid_off: 0
          })} 
        />
      </>
    })

    this._firstLoad()
    this._cartLoad()
    this._customerLoad()
    this._notifLoad()
  }

  componentDidUpdate(){
    this.props.navigation.setOptions({
      headerRight: () => <>
        <HeaderButton 
          icon={faBell} 
          warning={this.state.DataNotif !== null} 
          marginRight 
          onPress={() => this.props.navigation.navigate('Notif')}
        />
        <HeaderButton 
          icon={faShoppingCart}
          warning={this.state.DataCart !== null}
          onPress={() => this.setState({
            showCart: true,
            customerNameSelected: 'Umum',
            discount: 0,
            paid_off: 0
          })} 
        />
      </>
    })
  }

  async _firstLoad(){
    try {
      const level = await AsyncStorage.getItem('level')
      const id_owner = await AsyncStorage.getItem('id_owner')
      const id_category = await AsyncStorage.getItem('id_category')
      let url = ''

      if (parseInt(level) === 0) {
        url = util.ServerUrl+`products?id_owner=${id_owner}`
      } else {
        url = util.ServerUrl+`products?id_owner=${id_owner}&id_category=${id_category}`
      }

      axios.get(url)
      .then(res => {
        this.setState({
          Data: res.data.result
        })
      }).catch(err => console.log('Request Error',err))
    } catch (e) {
      console.log(e)
    }
  }

  async _customerLoad(){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')

      axios.get(util.ServerUrl+`customers?id_owner=${id_owner}`)
      .then(res => {
        this.setState({
          DataCustomer: defaultDataCustomer.concat(res.data.result.results)
        })
      }).catch(err => console.log('Request Error',err))
    } catch (e) {
      console.log(e)
    }
  }

  async _cartLoad(){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')
      const id_outlet = await AsyncStorage.getItem('id_outlet')

      axios.get(util.ServerUrl+`cashier?id_owner=${id_owner}&id_outlet=${id_outlet}`)
      .then(res => {
        this.setState({
          DataCart: res.data.result
        })
      }).catch(err => console.log('Request Error',err))
    } catch (e) {
      console.log(e)
    }
  }

  async _notifLoad(){
    const id_owner = await AsyncStorage.getItem('id_owner')

    axios.get(util.ServerUrl+`notifications?id_owner=${id_owner}`)
    .then(res => {
      this.setState({
        DataNotif: res.data.result.results
      })
    }).catch(err => console.log('Request Error',err))
  }

  async _handleLoadMore(){
    if (this.state.Data.active_page === this.state.Data.total_pages) {
      console.log('No more product data');
    } else {
      try {
        const level = await AsyncStorage.getItem('level')
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_category = await AsyncStorage.getItem('id_category')
        const query = this.state.Data.key_search === 'Semua' ? `&page=${this.state.Data.active_page + 1}` : `&page=${this.state.Data.active_page + 1}&q=${this.state.Data.key_search}`
        let url = ''

        if (parseInt(level) === 0) {
          url = util.ServerUrl+`products?id_owner=${id_owner}${query}`
        } else {
          url = util.ServerUrl+`products?id_owner=${id_owner}&id_category=${id_category}${query}`
        }
        
        
        axios.get(url)
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
        const level = await AsyncStorage.getItem('level')
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_category = await AsyncStorage.getItem('id_category')
        let query = ''

        if (parseInt(level) === 0) {
          query = this.state.inputSearch === '' ? `id_owner=${id_owner}` : `id_owner=${id_owner}&q=${this.state.inputSearch}`
        } else {
          query = this.state.inputSearch === '' ? `id_owner=${id_owner}&id_category=${id_category}` : `id_owner=${id_owner}&id_category=${id_category}&q=${this.state.inputSearch}`
        }
        
        axios.get(util.ServerUrl+`products?${query}`)
        .then(res => {
          this.setState({
            Data: res.data.result
          })
        }).catch(err => console.log('Request Error',err))
      } catch (e) {
        
      }
    }
  }

  async _addToCart(indexProductSelected){
    const productSelected = this.state.Data.results[indexProductSelected]
    if (productSelected.variants) {
      this.setState({
        indexSelected: indexProductSelected,
        showModalDetail: true
      })
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_outlet = await AsyncStorage.getItem('id_outlet')

        const data = new FormData()
        
        data.append('id_owner', id_owner)
        data.append('id_outlet', id_outlet)
        data.append('id_product', productSelected.id_product)
        data.append('product_name', productSelected.product_name)
        data.append('quantity', '1')
        data.append('selling_price', productSelected.selling_price)
        data.append('capital_price', productSelected.capital_price)
    
        await util.CallAPIPost('cashier/add', data, (success, message) => {
          if (success) this._cartLoad()
          ToastAndroid.show(message, ToastAndroid.SHORT)
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  async _addVariantToCart(indexVariantSelected){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')
      const id_outlet = await AsyncStorage.getItem('id_outlet')
      const productSelected = this.state.Data.results[this.state.indexSelected]
      const data = new FormData()
    
      data.append('id_owner', id_owner)
      data.append('id_outlet', id_outlet)
      data.append('id_product', productSelected.variants[indexVariantSelected].id_variant)
      data.append('product_name', productSelected.product_name.toString()+', '+productSelected.variants[indexVariantSelected].variant_name.toString())
      data.append('quantity', '1')
      data.append('selling_price', productSelected.variants[indexVariantSelected].selling_price.toString())
      data.append('capital_price', productSelected.variants[indexVariantSelected].capital_price.toString())
    
      await util.CallAPIPost('cashier/addvariant', data, (success, message) => {
        if (success) {
          this.setState({showModalDetail: false})
          this._cartLoad()
        }
        ToastAndroid.show(message, ToastAndroid.SHORT)
      })
    } catch (e) {
      console.log(e)
    }
  }

  _onItemCartDelete(idOwner, idOutlet, idProduct, isVariant){
    axios.delete(util.ServerUrl+`cashier/delete`, {
      params: {
        id_owner: idOwner,
        id_outlet: idOutlet,
        id_product: idProduct,
        is_variant: isVariant ? 1 : 0
      }
    })
    .then(res => {
      if (res.data.response_code === 200) this._cartLoad()
      ToastAndroid.show(res.data.result.message, ToastAndroid.SHORT)
    })
    .catch(err => console.log(err))
  }

  async _onSubmitNewData(v){
    if (v.toLowerCase() === '') {
      ToastAndroid.show('Inputan tidak boleh kosong', ToastAndroid.SHORT)
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_outlet = await AsyncStorage.getItem('id_outlet')
        const data = new FormData()
        data.append('id_owner', id_owner)
        data.append('id_outlet', id_outlet)
        data.append('customer_name', v.toString().trim())
        data.append('city', '')
        data.append('address', '')
        data.append('telp', '')
  
        this.setState({isLoading: true})
        await util.CallAPIPost('customers/create', data, (success, message) => {
          this.setState({isLoading: false})
          if (success) this.setState({isAddMode: false})
          ToastAndroid.show(message, ToastAndroid.SHORT)
          this._customerLoad()
        })
      } catch (e) {
        console.log(e)
      }
    }
  }

  async _onSubmit(total){
    if (this.state.paid_off === 0) {
      ToastAndroid.show('Masukan uang bayar terlebih dahulu', ToastAndroid.SHORT)
    } else if (isNaN(this.state.paid_off)) {
      ToastAndroid.show('Data tidak valid', ToastAndroid.SHORT)
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_outlet = await AsyncStorage.getItem('id_outlet')
        const owner_code = await AsyncStorage.getItem('owner_code')
        const data = new FormData()
        data.append('id_owner', id_owner)
        data.append('id_outlet', id_outlet)
        data.append('owner_code', owner_code)
        data.append('method', '0')
        data.append('discount', this.state.discount)
        data.append('grand_total', total)
        data.append('paid_off', this.state.paid_off)
        data.append('customer_name', this.state.customerNameSelected)
  
        for (const i of this.state.DataCart) {
          data.append('is_variant[]', i.is_variant ? 1 : 0)
          data.append('id_product[]', i.id_product)
          data.append('product_name[]', i.product_name)
          data.append('selling_price[]', i.selling_price)
          data.append('capital_price[]', i.capital_price)
          data.append('quantity[]', i.quantity)
        }
        
        this.setState({isLoading: true})
        const res =  await util.CallAPIPost('transactions/create', data, (success, message) => {})
  
        if (res.response_code === 200) {
          this.setState({
            showCart: false,
            isLoading: false,
            showSuccessTransactionModal: true,
            DataSuccess: res.result.details
          })
  
          this._firstLoad()
          this._cartLoad()
        }
  
        ToastAndroid.show(res.result.message, ToastAndroid.SHORT)
      } catch (e) {
        console.log(e)
      }
    }
  }

  render(){
    const dataDetail = this.state.Data.results !== null ? this.state.Data.results[this.state.indexSelected] : null

    let total = 0
    if (this.state.DataCart !== null){
      this.state.DataCart.forEach(d => {
        total += d.quantity * d.selling_price
      })
    }

    return(
      <ManagementLayout>
        <ManagementLayout.Header title={this.state.Data.key_search === 'Semua' ? 'Daftar Produk' : `Daftar Pencarian Untuk '${this.state.Data.key_search}'`}>
          {/* <View style={{
            backgroundColor: util.Colors.White, 
            width: 42, 
            height: 42, 
            marginRight: 10,
            alignItems: 'center', 
            justifyContent: 'center',
            borderRadius: 10,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8, 
            shadowRadius: 20,  
            elevation: 5,
            shadowColor: 'black'
          }}>
            <FontAwesomeIcon icon={faCamera} color={util.Colors.MainColor} size={27} />
          </View> */}
          <TextInputSearch 
            placeholder='Cari Produk/barcode'
            onChangeText={v => this.setState({
              inputSearch: v
            })}
            onSubmitSearch={this._onSubmitSearch}
          />
        </ManagementLayout.Header>
        <FlatList 
          data={this.state.Data.results}
          renderItem={({ item, index }) => <Card 
                                            index={index}
                                            totalData={this.state.Data.results.length - 1} 
                                            onPress={() => this._addToCart(index)} 
                                          >
                                            <Card.Product data={item}/>
                                          </Card>}
          keyExtractor={item => item.id_product}
          ListEmptyComponent={() => <NoData title='Produk' />}
          
          ListFooterComponent={() => <LoadingLoadMore show={(!(this.state.Data.results === null) && this.state.Data.total_pages === 0) || (this.state.Data.results !== null && !(this.state.Data.active_page === this.state.Data.total_pages))} />}
          onEndReached={this._handleLoadMore}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 15,
          }}
        />

        {/* ============================================= Cart ============================================= */}
        <BottomSheet
          title='Tagihan'
          show={this.state.showCart}
          onDismiss={() => this.setState({
            showCart: false
          })}
        >
          <FlatList
            data={this.state.DataCart}
            renderItem={({ item, index }) => <CartItem 
                                                data={item}
                                                index={index}
                                                totalData={this.state.DataCart.length - 1} 
                                                onUpdateCart={v => {
                                                  this.state.DataCart[index] = {
                                                    ...this.state.DataCart[index],
                                                    quantity: v
                                                  }
                                                  this.setState({
                                                    DataCart: this.state.DataCart
                                                  })
                                                }}
                                                onItemCartDelete={() => this._onItemCartDelete(item.id_owner, item.id_outlet, item.id_product, item.is_variant)}
                                              />}
            ListEmptyComponent={() => <EmptyCart width={300} height={300} style={{alignSelf: 'center'}} />}
            showsVerticalScrollIndicator={false}
            style={{
              // padding: 15
              marginHorizontal: 15,
              marginTop: 15,
              marginBottom: 5
            }}
          />
          {this.state.DataCart !== null && (
            <View 
              style={{
                backgroundColor: util.Colors.SecondaryWhite,
                marginHorizontal: 15,
                marginBottom: 15,
                borderRadius: 10
              }}
            >
              <SimpleGroup label='Total'>
                <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{util.formatRupiah(total)}</Text>
              </SimpleGroup>
              {this.state.customerNameSelected.toLowerCase() !== 'umum' && (
                <SimpleGroup label='Diskon'>
                  <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{'-'+util.formatRupiah(this.state.discount)}</Text>
                </SimpleGroup>
              )}
              <SimpleGroup label='Pembeli'>
                <Pressable 
                  style={{
                    backgroundColor: 'white',
                    padding: 5,
                    borderRadius: 10,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                  onPress={() => this.setState({
                    showCustomerModal: true
                  })}
                >
                  <Text 
                    style={{
                      color: 'black', 
                      fontSize: 16, 
                      fontWeight: 'bold', 
                      maxWidth: 150
                  }}>{this.state.customerNameSelected}</Text>
                  <FontAwesomeIcon icon={faCaretDown} color='black' size={20} />
                </Pressable>
              </SimpleGroup>
              {this.state.customerNameSelected.toLowerCase() !== 'umum' && (
                <SimpleGroup label='Diskon'>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput 
                      style={{
                        backgroundColor: 'white',
                        width: 50,
                        height: 40,
                        borderRadius: 10,
                        fontSize: 16,
                        color: 'black'
                      }}
                      placeholder='100' 
                      maxLength={3}
                      keyboardType='number-pad'
                      onChangeText={v => {
                        this.setState({
                          discount: isNaN(total * (parseInt(v)/100)) ? 0 : total * (parseInt(v)/100)
                        })
                      }}
                    />
                    <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold', marginLeft: 5 }}>%</Text>
                  </View>
                </SimpleGroup>
              )}
              <SimpleGroup label='Bayar'>
                <TextInput 
                  style={{
                    backgroundColor: 'white',
                    width: 200,
                    height: 40,
                    borderRadius: 10,
                    fontSize: 16,
                    color: 'black'
                  }}
                  placeholder='Masukan Uang Bayar' 
                  value={this.state.paid_off.toString() === '0' ? undefined : this.state.paid_off.toString()}
                  keyboardType='number-pad'
                  onChangeText={v => this.setState({
                    paid_off: parseInt(v === '' ? 0 : v.replace(/[^0-9]/g, ''))
                  })}
                />
              </SimpleGroup>
              <SimpleGroup label='Kembali'>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: this.state.DataCart === null ? 'transparent' : (this.state.paid_off < (this.state.customerNameSelected.toLowerCase() === 'umum' ? total : total - this.state.discount) ? util.Colors.Warning : util.Colors.Success),
                    backgroundColor: this.state.DataCart === null ? 'transparent' : (this.state.paid_off < (this.state.customerNameSelected.toLowerCase() === 'umum' ? total : total - this.state.discount) ? util.Colors.WarningBg : util.Colors.SuccessBg),
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 5,
                    borderRadius: 10
                  }}
                >
                  <Text style={{
                    color: this.state.DataCart === null ? 'black' : (this.state.paid_off < (this.state.customerNameSelected.toLowerCase() === 'umum' ? total : total - this.state.discount) ? util.Colors.Warning : util.Colors.Success), 
                    fontSize: 16, 
                    fontWeight: 'bold',
                  }}>{util.formatRupiah(this.state.paid_off - (this.state.customerNameSelected.toLowerCase() === 'umum' ? total : total - this.state.discount))}</Text>
                </View>
              </SimpleGroup>
              <ActionButton 
                label='Bayar' 
                loading={this.state.isLoading}
                onPress={() => this._onSubmit(total)} 
              />
            </View>
          )}
        </BottomSheet>

        {/* ============================================= Modal Detail Product ============================================= */}
        <BottomSheet 
          title='Detail Produk'
          show={this.state.showModalDetail}
          onDismiss={() => this.setState({
            showModalDetail: false
          })}
        >
          <ScrollView 
            style={{
              padding: 15
            }}
            showsVerticalScrollIndicator={false}
          >
            <SimpleData>
              <SimpleData.Image uri={dataDetail && dataDetail.product_img} />
            </SimpleData>
            <SimpleData>
                <SimpleData.Item label='Nama' value={dataDetail && dataDetail.product_name} />
                <SimpleData.Item label='Barcode' value={dataDetail && (dataDetail.barcode === '' ? '-' : dataDetail.barcode)} />
                <SimpleData.Item label='Kategori' value={dataDetail && dataDetail.id_category.category_name} />
                {dataDetail && dataDetail.variants ? (
                  <SimpleData.Item label='Harga' value={dataDetail && dataDetail.variants.length+' Harga'} />
                ) : (
                  <View>
                    <SimpleData.Item label='Harga Jual' value={dataDetail && util.formatRupiah(dataDetail.selling_price)} />
                    <SimpleData.Item label='Harga Modal' value={dataDetail && util.formatRupiah(dataDetail.capital_price)} />
                  </View>
                )}
            </SimpleData>
            {dataDetail && (dataDetail.available_stock && !dataDetail.variants) && <SimpleData.Unit 
                                                                                      unitName={dataDetail.id_unit === null ? '-' : dataDetail.id_unit.unit_name} 
                                                                                      stock={dataDetail.stock_quantity} 
                                                                                      stockMin={dataDetail.stock_min} 
                                                                                    />}
            {dataDetail && dataDetail.variants && (
              <SimpleData>
                <SimpleData.HasVariants>
                  {dataDetail && dataDetail.variants.map((d, i) => (
                    <SimpleData.HasVariants.Item 
                      key={i}
                      name={d.variant_name}
                      sellingPrice={util.formatRupiah(d.selling_price)}
                      capitalPrice={util.formatRupiah(d.capital_price)}
                      availableStock={d.available_stock ? 1 : 0}
                      stockQuantity={d.stock_quantity}
                      unit={d.available_stock ? d.id_unit.unit_name : undefined}
                      onItemPress={() => this._addVariantToCart(i)}
                    />
                  ))}
                </SimpleData.HasVariants>
              </SimpleData>
            )}
          </ScrollView>
        </BottomSheet>

        {/* ============================================= Modal Customer ============================================= */}
        <MyOwnModal visible={this.state.showCustomerModal}>
          <MyOwnModal.Customer
            title='Pelanggan'
            isLoading={this.state.isLoading}
            list={this.state.DataCustomer}
            isAddMode={this.state.isAddMode}
            setIsAddMode={s => this.setState({
              isAddMode: s
            })}
            onPress={(item) => this.setState({
              customerNameSelected: item.customer_name,
              discount: item.customer_name.toLowerCase() === 'umum' ? 0 : this.state.discount,
              showCustomerModal: false
            })}
            onDismiss={() => this.setState({
              showCustomerModal: false
            })}
            onSubmitNewData={this._onSubmitNewData}
          />
        </MyOwnModal>

        {/* ============================================= Modal Success Transcation ============================================= */}
        <MyOwnModal visible={this.state.showSuccessTransactionModal}>
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
              <View style={{
                alignItems: 'center'
              }}>
                <SuccessTransaction width={300} height={300} />
                <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>Transaksi berhasil</Text>
                <Text style={{color: 'black', fontSize: 16}}>{util.dateToInaFormat(this.state.DataSuccess.date)}, {this.state.DataSuccess.time}</Text>
              </View>

              <SimpleGroup label='Pembayaran'>
                <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>'Tunai</Text>
              </SimpleGroup>
              <SimpleGroup label='Total Harga'>
                <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{util.formatRupiah(this.state.DataSuccess.discount === 0 ? this.state.DataSuccess.grand_total : this.state.DataSuccess.grand_total + this.state.DataSuccess.discount)}</Text>
              </SimpleGroup>
              {this.state.DataSuccess.discount !== 0 && (
                <View>
                  <SimpleGroup label='Diskon'>
                    <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{'-'+util.formatRupiah(this.state.DataSuccess.discount)}</Text>
                  </SimpleGroup>
                  <SimpleGroup label='Total Belanja'>
                    <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{util.formatRupiah(this.state.DataSuccess.grand_total)}</Text>
                  </SimpleGroup>
                </View>
              )}
              <SimpleGroup label='Diterima'>
                <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{util.formatRupiah(this.state.DataSuccess.paid_off)}</Text>
              </SimpleGroup>
              <SimpleGroup label='Kembalian'>
                <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{util.formatRupiah(parseInt(this.state.DataSuccess.paid_off) - parseInt(this.state.DataSuccess.grand_total))}</Text>
              </SimpleGroup>
              <View
                style={{
                  flexDirection: 'row'
                }}
              >
                <ActionButton 
                  label='Tutup' 
                  backgroundColor='red' 
                  onPress={() => this.setState({
                    showSuccessTransactionModal: false
                  })}  
                />
              </View>
            </View>
          </View>
        </MyOwnModal>
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

export default GlobalConsumer(CashierScreen)