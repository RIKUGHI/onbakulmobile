import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, ToastAndroid, View } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { ActionButton, AddButton, BottomSheet, Card, CommonTextInput, HeaderModal, LoadingLoadMore, ManagementLayout, MyOwnModal, NoData, SimpleData, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';
import ImagePicker from './ImagePicker';
import Switcher from './Switcher';

const defaultForm = {
  product_img: {},
  product_name: '',
  barcode: '',
  id_category: {},
  capital_price: 0,
  selling_price: 0,
  available_stock: 1,
  id_unit: {},
  stock_quantity: 1,
  stock_min: 0,
  variants: [],
  newVariants: [],
  removeVariants: []
}

const defaultFormVariant = {
  variant_name: '',
  capital_price: 0,
  selling_price: 0,
  available_stock: 0,
  id_unit: {},
  stock_quantity: 1,
  stock_min: 0
}

class ProductScreen extends Component {
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
      DataCategory: [
        {
          id_owner: 0,
          id_category: 0,
          category_name: 'Loading Category Name'
        }
      ],
      DataUnits: [
        {
          id_owner: 0,
          id_unit: 0,
          unit_name: 'Loading Unit Name'
        },
      ],
      inputSearch: '',
      form: defaultForm,
      formVariant: defaultFormVariant,
      isReadOnly: false,
      isLoading: false,
      isAddMode: false,
      isEdit: false,
      isCategory: false,
      isVariant: false,
      indexSelected: 0,
      indexVariantSelected: 0,
      idProductSelected: 0,
      showMainModal: false,
      showVariantModal: false,
      showSecondaryModal: false,
      showModalDetail: false,
      showDeleteModal: false,
      showModalAction: false
    }
    this._handleLoadMore = this._handleLoadMore.bind(this)
    this._onSubmitSearch = this._onSubmitSearch.bind(this)
    this._onSubmitNewData = this._onSubmitNewData.bind(this)
    this._onSubmitVariant = this._onSubmitVariant.bind(this)
    this._onSubmit = this._onSubmit.bind(this)
    this._onSubmitDelete = this._onSubmitDelete.bind(this)
  }

  componentDidMount(){
    this.props.navigation.addListener('focus', () => {
      this._categoryLoad()
      this._unitLoad()
      console.log('Refreshed');

      if (this.props.route.params) {
        this.setState({
          inputSearch: this.props.route.params.product_name
        }, () => {
          this._onSubmitSearch()
          setTimeout(() => {
            this.setState({
              inputSearch: ''
            })
          }, 1000);
        })
      } else {
        this._firstLoad()
      }
    })
  }

  async _firstLoad(query){
    try {
      const level = await AsyncStorage.getItem('level')
      const id_owner = await AsyncStorage.getItem('id_owner')
      const id_category = await AsyncStorage.getItem('id_category')
      const products_ro = await AsyncStorage.getItem('products_ro')
      let url = ''

      if (parseInt(level) === 0) {
        url = query ? util.ServerUrl+'products'+query : util.ServerUrl+`products?id_owner=${id_owner}`
      } else {
        url = query ? util.ServerUrl+'products'+query : util.ServerUrl+`products?id_owner=${id_owner}&id_category=${id_category}`
      }

      axios.get(url)
      .then(res => {
        this.setState({
          Data: res.data.result,
          isReadOnly: parseInt(products_ro) ? true : false
        })
      }).catch(err => console.log('Request Error',err))
    } catch (error) {
      console.log(error)
    }
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
    } catch (error) {
      console.log(error)
    }
  }
  
  async _unitLoad(){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')
      axios.get(util.ServerUrl+`units?id_owner=${id_owner}`)
      .then(res => {
        this.setState({
          DataUnits: res.data.result.results
        })
      }).catch(err => console.log('Request Error',err))  
    } catch (error) {
      console.log(error)
    }
  }

  async _handleLoadMore(){
    if (this.state.Data.active_page === this.state.Data.total_pages) {
      console.log('No more product data');
    } else {
      try {
        const level = await AsyncStorage.getItem('level')
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_category = await AsyncStorage.getItem('id_category')
        let url = ''
        const query = this.state.Data.key_search === 'Semua' ? `&page=${this.state.Data.active_page + 1}` : `&page=${this.state.Data.active_page + 1}&q=${this.state.Data.key_search}`

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
      } catch (error) {
        console.log(error)
      }
    }
  }

  async _onSubmitSearch(){
    if (this.state.Data.key_search.toLowerCase() === this.state.inputSearch.toLowerCase() || this.state.inputSearch === '' && this.state.Data.key_search === 'Semua') {
      console.log('search kosong karena sama atau input search kosong');
    } else {
      const level = await AsyncStorage.getItem('level')
      const id_owner = await AsyncStorage.getItem('id_owner')
      const id_category = await AsyncStorage.getItem('id_category')
      let url = ''

      if (parseInt(level) === 0) {
        url = util.ServerUrl+`products?${this.state.inputSearch === '' ? `id_owner=${id_owner}` : `id_owner=${id_owner}&q=${this.state.inputSearch}`}`
      } else {
        url = util.ServerUrl+`products?${this.state.inputSearch === '' ? `id_owner=${id_owner}&id_category=${id_category}` : `id_owner=${id_owner}&id_category=${id_category}&q=${this.state.inputSearch}`}`
      }

      axios.get(url)
      .then(res => {
        this.setState({
          Data: res.data.result
        })
      }).catch(err => console.log('Request Error',err))
    }
  }

  async _onSubmitNewData(isCategory, v){
    if (v.toLowerCase() === '') {
      ToastAndroid.show('Inputan tidak boleh kosong', ToastAndroid.SHORT)
    } else {
      if (isCategory) {
        try {
          const id_owner = await AsyncStorage.getItem('id_owner')
          const data = new FormData()

          data.append('id_owner', id_owner)
          data.append('category_name', v.trim())
    
          this.setState({isLoading: true})
          await util.CallAPIPost('categories/create', data, (success, message) => {
            this.setState({isLoading: false})
            if (success) this.setState({isAddMode: false})
            ToastAndroid.show(message, ToastAndroid.SHORT)
            this._categoryLoad()
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
          const id_owner = await AsyncStorage.getItem('id_owner')
          const data = new FormData()

          data.append('id_owner', id_owner)
          data.append('unit_name', v.trim())
    
          this.setState({isLoading: true})
          await util.CallAPIPost('units/create', data, (success, message) => {
            this.setState({isLoading: false})
            if (success) this.setState({isAddMode: false})
            ToastAndroid.show(message, ToastAndroid.SHORT)
            this._unitLoad()
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  _onSubmitVariant(){
    if (this.state.formVariant.variant_name === '') {
      ToastAndroid.show('Nama variasi tidak boleh kosong', ToastAndroid.SHORT)
    } else if (parseInt(this.state.formVariant.selling_price) === 0 || this.state.formVariant.selling_price === '') {
      ToastAndroid.show('Harga jual tidak boleh kosong', ToastAndroid.SHORT)
    } else if ((parseInt(this.state.formVariant.capital_price) !== 0 || this.state.formVariant.capital_price !== '') && (parseInt(this.state.formVariant.selling_price) <= parseInt(this.state.formVariant.capital_price))) {
      ToastAndroid.show('Harga jual harus lebih besar dari pada harga modal', ToastAndroid.SHORT)
    } else {
      if (this.state.formVariant.available_stock && Object.keys(this.state.formVariant.id_unit).length === 0) {
        ToastAndroid.show('Satuan tidak boleh kosong', ToastAndroid.SHORT)
      } else {
        if (this.state.isEdit && this.state.formVariant.id_product === undefined) {
          // making new variant on edit
          this.setState({
            showVariantModal: false,
            form: {
              ...this.state.form,
              newVariants: this.state.form.newVariants.concat(this.state.formVariant)
            }
          })
        } else if (this.state.isEdit && this.state.formVariant.id_product !== undefined) {
          // changing variants value by indexVariantSelected on edit
          this.state.form.variants[this.state.indexVariantSelected] = this.state.formVariant
          this.setState({
            showVariantModal: false,
            form: {
              ...this.state.form,
              variants: this.state.form.variants
            }
          })
        } else {
          // making new variant on add
          this.setState({
            showVariantModal: false,
            form: {
              ...this.state.form,
              variants: this.state.form.variants.concat(this.state.formVariant)
            }
          })
        }
      }
    }
  }

  async _onSubmit(){
    if (this.state.isEdit) {
      if (this.state.form.product_name === '') {
        ToastAndroid.show('Nama produk tidak boleh kosong', ToastAndroid.SHORT)
      } else if ((parseInt(this.state.form.selling_price) === 0 || this.state.form.selling_price === '') && this.state.form.variants.length === 0) {
        ToastAndroid.show('Harga jual tidak boleh kosong', ToastAndroid.SHORT)
      } else if (((parseInt(this.state.form.capital_price) !== 0 || this.state.form.capital_price !== '') && (parseInt(this.state.form.selling_price) <= parseInt(this.state.form.capital_price))) && this.state.form.variants.length === 0) {
        ToastAndroid.show('Harga jual harus lebih besar dari pada harga modal', ToastAndroid.SHORT)
      } else {
        if (this.state.form.available_stock && Object.keys(this.state.form.id_unit).length === 0) {
          ToastAndroid.show('Satuan tidak boleh kosong', ToastAndroid.SHORT)
        } else {
          try {
            const id_owner = await AsyncStorage.getItem('id_owner')
            const id_category = await AsyncStorage.getItem('id_category')

            this.setState({isLoading: true})
      
            ReactNativeBlobUtil.fetch('POST', util.ServerUrl+'products/edit/'+this.state.idProductSelected, {
              Authorization: "Bearer access-token",
              otherHeader: "foo",
              'Content-Type': 'multipart/form-data',
            }, 
            [
              {name: 'id_owner', data: id_owner.toString()},
              {
                name: 'product_img', 
                filename: this.state.form.product_img === null ? null : (typeof this.state.form.product_img === 'object' ? (Object.keys(this.state.form.product_img).length === 0 ? null : this.state.form.product_img.fileName) : null), 
                type: this.state.form.product_img === null ? null : (typeof this.state.form.product_img === 'object' ? (Object.keys(this.state.form.product_img).length === 0 ? null : this.state.form.product_img.type) : null), 
                data: this.state.form.product_img === null ? null : (typeof this.state.form.product_img === 'object' ? (Object.keys(this.state.form.product_img).length === 0 ? null : this.state.form.product_img.base64) : null)
              },
              {name: 'product_name', data: this.state.form.product_name},
              {name: 'barcode', data: this.state.form.barcode},
              {name: 'id_category', data: Object.keys(this.state.form.id_category).length === 0 ? id_category ? id_category.toString() : '0' : this.state.form.id_category.id_category.toString()},
              {name: 'selling_price', data: this.state.form.selling_price.toString()},
              {name: 'capital_price', data: this.state.form.capital_price.toString()},
              {name: 'available_stock', data: this.state.form.available_stock.toString()},
              {name: 'id_unit', data: Object.keys(this.state.form.id_unit).length === 0 ? '0' : this.state.form.id_unit.id_unit.toString()},
              {name: 'stock_quantity', data: this.state.form.stock_quantity.toString()},
              {name: 'stock_min', data: this.state.form.stock_min.toString()},
              {name: 'platform', data: 'android'},
              // create a new variant
              {name: 'variant_name', data: this.state.form.newVariants.map(d => d.variant_name).toString()},
              {name: 'capital_price_n', data: this.state.form.newVariants.map(d => d.capital_price).toString()},
              {name: 'selling_price_n', data: this.state.form.newVariants.map(d => d.selling_price).toString()},
              {name: 'available_stock_n', data: this.state.form.newVariants.map(d => d.available_stock).toString()},
              {name: 'id_unit_n', data: this.state.form.newVariants.map(d => d.id_unit.id_unit).toString()},
              {name: 'stock_quantity_n', data: this.state.form.newVariants.map(d => d.stock_quantity).toString()},
              {name: 'stock_min_n', data: this.state.form.newVariants.map(d => d.stock_min).toString()},
              //  edit variant
              {name: 'id_variant_e', data: this.state.form.variants.map(d => d.id_variant).toString()},
              {name: 'variant_name_e', data: this.state.form.variants.map(d => d.variant_name).toString()},
              {name: 'capital_price_e', data: this.state.form.variants.map(d => d.capital_price).toString()},
              {name: 'selling_price_e', data: this.state.form.variants.map(d => d.selling_price).toString()},
              {name: 'available_stock_e', data: this.state.form.variants.map(d => d.available_stock).toString()},
              {name: 'id_unit_e', data: this.state.form.variants.map(d => d.id_unit.id_unit).toString()},
              {name: 'stock_quantity_e', data: this.state.form.variants.map(d => d.stock_quantity).toString()},
              {name: 'stock_min_e', data: this.state.form.variants.map(d => d.stock_min).toString()},
              // remove variant
              {name: 'id_variant_d', data: this.state.form.removeVariants.map(d => d.id_variant).toString()}
            ]).then((resp) => {
              const res = JSON.parse(resp.data)
        
              this.setState({isLoading: false})
              if (res.response_code === 200) this.setState({showMainModal: false})
              ToastAndroid.show(res.result.message, ToastAndroid.SHORT)
              this._firstLoad()
            }).catch((err) => {
              this.setState({isLoading: false})
              ToastAndroid.show('Gagal updatet data', ToastAndroid.SHORT)
              this._firstLoad()
              console.log(err);
            })
          } catch (error) {
            console.log(error)
          }
        }
      }
    } else {
      if (this.state.form.product_name === '') {
        ToastAndroid.show('Nama produk tidak boleh kosong', ToastAndroid.SHORT)
      } else if ((parseInt(this.state.form.selling_price) === 0 || this.state.form.selling_price === '') && this.state.form.variants.length === 0) {
        ToastAndroid.show('Harga jual tidak boleh kosong', ToastAndroid.SHORT)
      } else if (((parseInt(this.state.form.capital_price) !== 0 || this.state.form.capital_price !== '') && (parseInt(this.state.form.selling_price) <= parseInt(this.state.form.capital_price))) && this.state.form.variants.length === 0) {
        ToastAndroid.show('Harga jual harus lebih besar dari pada harga modal', ToastAndroid.SHORT)
      } else {
        if (this.state.form.available_stock && Object.keys(this.state.form.id_unit).length === 0) {
          ToastAndroid.show('Satuan tidak boleh kosong', ToastAndroid.SHORT)
        } else {
          try {
            const id_owner = await AsyncStorage.getItem('id_owner')
            const id_category = await AsyncStorage.getItem('id_category')

            this.setState({isLoading: true})
  
            ReactNativeBlobUtil.fetch('POST', util.ServerUrl+'products/create', {
              Authorization: "Bearer access-token",
              otherHeader: "foo",
              'Content-Type': 'multipart/form-data',
            }, 
            [
              {name: 'id_owner', data: id_owner.toString()},
              {name: 'product_img', filename: this.state.form.product_img.fileName, type: this.state.form.product_img.type, data: Object.keys(this.state.form.product_img).length === 0 ? '' : this.state.form.product_img.base64},
              {name: 'product_name', data: this.state.form.product_name},
              {name: 'barcode', data: this.state.form.barcode},
              {name: 'id_category', data: Object.keys(this.state.form.id_category).length === 0 ? id_category ? id_category.toString() : '0' : this.state.form.id_category.id_category.toString()},
              {name: 'selling_price', data: this.state.form.selling_price.toString()},
              {name: 'capital_price', data: this.state.form.capital_price.toString()},
              {name: 'available_stock', data: this.state.form.available_stock.toString()},
              {name: 'id_unit', data: Object.keys(this.state.form.id_unit).length === 0 ? '0' : this.state.form.id_unit.id_unit.toString()},
              {name: 'stock_quantity', data: this.state.form.stock_quantity.toString()},
              {name: 'stock_min', data: this.state.form.stock_min.toString()},
              {name: 'platform', data: 'android'},
              {name: 'variant_name', data: this.state.form.variants.map(d => d.variant_name).toString()},
              {name: 'capital_price_v', data: this.state.form.variants.map(d => d.capital_price).toString()},
              {name: 'selling_price_v', data: this.state.form.variants.map(d => d.selling_price).toString()},
              {name: 'available_stock_v', data: this.state.form.variants.map(d => d.available_stock).toString()},
              {name: 'id_unit_v', data: this.state.form.variants.map(d => d.id_unit.id_unit).toString()},
              {name: 'stock_quantity_v', data: this.state.form.variants.map(d => d.stock_quantity).toString()},
              {name: 'stock_min_v', data: this.state.form.variants.map(d => d.stock_min).toString()},
            ]).then((resp) => {
              const res = JSON.parse(resp.data)
        
              this.setState({isLoading: false})
              if (res.response_code === 200) this.setState({showMainModal: false})
              ToastAndroid.show(res.result.message, ToastAndroid.SHORT)
              this._firstLoad()
            }).catch((err) => {
              this.setState({isLoading: false})
              ToastAndroid.show('Gagal tambah data', ToastAndroid.SHORT)
              this._firstLoad()
              console.log(err);
            })
          } catch (error) {
            console.log(error)
          }
        }
      }
    }
  }

  async _onSubmitDelete(){
    try {
      const level = await AsyncStorage.getItem('level')
      const id_owner = await AsyncStorage.getItem('id_owner')
      const id_category = await AsyncStorage.getItem('id_category')
      let query = ''

      if (parseInt(level) === 0) {
        query = this.state.inputSearch === '' ? `?id_owner=${id_owner}` : `?id_owner=${id_owner}&q=${this.state.inputSearch}`
      } else {
        query = this.state.inputSearch === '' ? `?id_owner=${id_owner}&id_category=${id_category}` : `?id_owner=${id_owner}&id_category=${id_category}&q=${this.state.inputSearch}`
      }

      this.setState({isLoading: true})
      util.CallAPIDelete(`products/delete/${this.state.idProductSelected}?id_owner=${id_owner}`, (success, message) => {
        this.setState({isLoading: false})
        if (success) this.setState({showDeleteModal: false})
        ToastAndroid.show(message, ToastAndroid.SHORT)
        this._firstLoad(query)
      })
    } catch (error) {
      console.log(error)
    }
  }

  render(){
    const dataDetail = this.state.Data.results !== null ? this.state.Data.results[this.state.indexSelected] : null

    return(
      <ManagementLayout>
        <ManagementLayout.Header title={this.state.Data.key_search === 'Semua' ? undefined : `Daftar Pencarian Untuk '${this.state.Data.key_search}'`}>
          <TextInputSearch 
            placeholder='Cari produk/barcode' 
            onChangeText={v => this.setState({
              inputSearch: v
            })}
            onSubmitSearch={this._onSubmitSearch}
          />
          {!this.state.isReadOnly && (
            <AddButton onPress={async () => 
              this.setState({
                isEdit: false,
                form: defaultForm,
                formVariant: defaultFormVariant,
                showMainModal: true
              })
            } />
          )}
        </ManagementLayout.Header>
        <FlatList
          data={this.state.Data.results} 
          renderItem={({ item, index }) => <Card 
                                            index={index}
                                            totalData={this.state.Data.results.length - 1} 
                                            onPress={() => this.setState({
                                              indexSelected: index,
                                              showModalDetail: true
                                            })}
                                            onLongPress={() => {
                                              if (!this.state.isReadOnly) {
                                                this.setState({
                                                  idProductSelected: item.id_product,
                                                  indexSelected: index,
                                                  showModalAction: true
                                                })
                                              }
                                            }}
                                          >
                                            <Card.Product data={item}/>
                                          </Card>}
          keyExtractor={item => item.id_product}
          ListEmptyComponent={() => <NoData title='Produk' />}
          ListFooterComponent={() => <LoadingLoadMore show={(!(this.state.Data.results === null) && this.state.Data.total_pages === 0) || (this.state.Data.results !== null && !(this.state.Data.active_page === this.state.Data.total_pages))} />}
          onEndReached={this._handleLoadMore}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 15
          }}
        />

        {/* ============================================= Modal Add/Edit Product ============================================= */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showMainModal}
        >
          <HeaderModal
            title={(this.state.isEdit ? 'Edit' : 'Tambah')+' Barang'}
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
            <ImagePicker 
              isEdit={this.state.isEdit}
              srcUri={this.state.isEdit ? this.state.form.product_img : ''}
              file={file => this.setState({
                form: {
                  ...this.state.form,
                  product_img: file
                }
              })} 
            />
            <CommonTextInput 
              label='Nama' 
              value={this.state.isEdit ? this.state.form.product_name : undefined}
              onChangeText={v => this.setState({form: {...this.state.form, product_name: v}})} 
            />
            <CommonTextInput 
              label='Barcode' 
              value={this.state.isEdit ? this.state.form.barcode : undefined}
              onChangeText={v => this.setState({form: {...this.state.form, barcode: v}})} 
            />
            <CommonTextInput 
              label='Kategori' 
              disable 
              defaultValue='Pilih Kategori' 
              value={Object.keys(this.state.form.id_category).length === 0 ? undefined : this.state.form.id_category.category_name}
              onPress={() => this.setState({
                isCategory: true,
                isVariant: false,
                showSecondaryModal: true
              })} />
            {(this.state.isEdit ? this.state.form.variants.length === 0 && this.state.form.newVariants.length === 0 : this.state.form.variants.length === 0) && (
              <View>
                <CommonTextInput label='Harga Jual' value={this.state.form.selling_price.toString() === '0' || this.state.form.selling_price.toString() === '' ? undefined : this.state.form.selling_price.toString()} onChangeText={v => this.setState({form: {...this.state.form, selling_price: v}})} />
                <CommonTextInput label='Harga Modal' value={this.state.form.capital_price.toString() === '0' || this.state.form.capital_price.toString() === '' ? undefined : this.state.form.capital_price.toString()} onChangeText={v => this.setState({form: {...this.state.form, capital_price: v}})} />
                <Switcher 
                  value={this.state.form.available_stock ? true : false}
                  onValueChange={v => this.setState({
                    form: {
                      ...this.state.form,
                      available_stock: v ? 1 : 0
                    }
                  })} 
                />
              </View>
            )}
            {this.state.form.available_stock === 1 && this.state.form.variants.length === 0 && (
              <View>
                <Text style={{color: 'black', marginVertical: 10}}>
                  <Text style={{fontWeight: 'bold'}}>Note:</Text> Mengaktifkan fitur stok akan mempengaruhi fitur kasir, jika jumlah pembelian produk ini melebihi batas stok yang dimiliki, secara otomatis produk tidak bisa masuk tagihan dan jika stok mencapai batas minimum, secara otomatis akan muncul notifikasi
                </Text>
                <CommonTextInput 
                  label='Satuan' 
                  disable 
                  defaultValue='Pilih Satuan'
                  value={Object.keys(this.state.form.id_unit).length === 0 ? undefined : this.state.form.id_unit.unit_name}
                  onPress={() => this.setState({
                    isCategory: false,
                    isVariant: false,
                    showSecondaryModal: true
                  })} />
                <CommonTextInput 
                  label='Jumlah Stok' 
                  value={this.state.isEdit ? this.state.form.stock_quantity.toString() : undefined}
                  onChangeText={v => this.setState({form: {...this.state.form, stock_quantity: v}})} 
                />
                <CommonTextInput 
                  label='Stok Min' 
                  value={this.state.isEdit ? this.state.form.stock_min.toString() : undefined}
                  onChangeText={v => this.setState({form: {...this.state.form, stock_min: v}})} 
                />
              </View>
            )}
            
            {this.state.form.variants.length === 0 && this.state.form.newVariants.length === 0 ? null : (
              <SimpleData style={{
                marginTop: 8
              }}>
                <SimpleData.HasVariants>
                  {(this.state.isEdit ? this.state.form.variants.concat(this.state.form.newVariants) : this.state.form.variants).map((d, i) => <SimpleData.HasVariants.Item 
                                                            key={i} 
                                                            name={d.variant_name}
                                                            sellingPrice={d.selling_price}
                                                            capitalPrice={d.capital_price}
                                                            availableStock={d.available_stock}
                                                            stockQuantity={d.stock_quantity}
                                                            unit={d.id_unit.unit_name}
                                                            onPressEdit={this.state.isEdit && d.id_product !== undefined ? () => this.setState({
                                                              indexVariantSelected: i,
                                                              showVariantModal: true,
                                                              formVariant: this.state.form.variants[i]
                                                            }) : undefined}
                                                            onPressDelete={() => {
                                                              if (d.id_product === undefined) {
                                                                if (this.state.form.newVariants.includes(d)) {
                                                                  this.state.form.newVariants.splice(this.state.form.newVariants.indexOf(d), 1)
                                                                  this.setState({
                                                                    form: {
                                                                      ...this.state.form,
                                                                      newVariants: this.state.form.newVariants 
                                                                    }
                                                                  })
                                                                } else {
                                                                  this.state.form.variants.splice(i, 1)
                                                                  this.setState({
                                                                    form: {
                                                                      ...this.state.form,
                                                                      variants: this.state.form.variants
                                                                    }
                                                                  })
                                                                }
                                                              } else {
                                                                this.setState({
                                                                  form: {
                                                                    ...this.state.form,
                                                                    removeVariants: this.state.form.removeVariants.concat(this.state.form.variants.splice(i, 1))
                                                                  }
                                                                })
                                                              }
                                                            }}
                                                          />)}
                </SimpleData.HasVariants>
              </SimpleData>
            )}
            <View style={{
              flexDirection: 'row',
              marginTop: 8
            }}>
              <ActionButton label='Tambah Variasi' enableMarginRight onPress={() => this.setState({
                showVariantModal: true,
                formVariant: {
                  ...defaultFormVariant,
                  selling_price: this.state.form.selling_price.toString() === '0' || this.state.form.selling_price.toString() === '' ? 0 : this.state.form.selling_price.toString(),
                  capital_price: this.state.form.capital_price.toString() === '0' || this.state.form.capital_price.toString() === '' ? 0 : this.state.form.capital_price.toString()
                }
              })} />
              <ActionButton label='Simpan' loading={this.state.isLoading} onPress={this._onSubmit} />
            </View>
          </ScrollView>
        </Modal>

        {/* ============================================= Modal Add Variant ============================================= */}
        <Modal
          animationType='fade'
          transparent={true}
          visible={this.state.showVariantModal}
        >
          <View style={{
            backgroundColor: util.Colors.ModalBackground,
            flex: 1
          }}>
            <HeaderModal
              title='Tambah Variasi'
              onDismiss={() => this.setState({
                showVariantModal: false
              })}
            />
            <ScrollView 
              style={{
                backgroundColor: 'white'
              }}
              contentContainerStyle={{
                padding: 15
              }}
              showsVerticalScrollIndicator={false}
            >
              <CommonTextInput 
                label='Nama Variasi' 
                value={this.state.isEdit ? this.state.formVariant.variant_name : undefined}
                onChangeText={v => this.setState({formVariant: {...this.state.formVariant, variant_name: v}})} 
              />
              <CommonTextInput label='Harga Jual' value={this.state.formVariant.selling_price.toString() === '0' || this.state.formVariant.selling_price.toString() === '' ? undefined : this.state.formVariant.selling_price.toString()} onChangeText={v => this.setState({formVariant: {...this.state.formVariant, selling_price: v}})} />
              <CommonTextInput label='Harga Modal' value={this.state.formVariant.capital_price.toString() === '0' || this.state.formVariant.capital_price.toString() === '' ? undefined : this.state.formVariant.capital_price.toString()} onChangeText={v => this.setState({formVariant: {...this.state.formVariant, capital_price: v}})} />
              <Switcher 
                value={this.state.formVariant.available_stock ? true : false}
                onValueChange={v => this.setState({
                  formVariant: {
                    ...this.state.formVariant,
                    available_stock: v ? 1 : 0
                  }
                })} 
              />
              {this.state.formVariant.available_stock === 1 && (
                <View>
                  <Text style={{color: 'black', marginVertical: 10}}>
                    <Text style={{fontWeight: 'bold'}}>Note:</Text> Mengaktifkan fitur stok akan mempengaruhi fitur kasir, jika jumlah pembelian produk ini melebihi batas stok yang dimiliki, secara otomatis produk tidak bisa masuk tagihan dan jika stok mencapai batas minimum, secara otomatis akan muncul notifikasi
                  </Text>
                  <CommonTextInput 
                    label='Satuan' 
                    disable 
                    defaultValue='Pilih Satuan'
                    value={Object.keys(this.state.formVariant.id_unit).length === 0 ? undefined : this.state.formVariant.id_unit.unit_name}
                    onPress={() => this.setState({
                      isCategory: false,
                      isVariant: true,
                      showSecondaryModal: true
                    })} />
                  <CommonTextInput 
                    label='Jumlah Stok' 
                    value={this.state.isEdit ? this.state.formVariant.stock_quantity.toString() : undefined}
                    onChangeText={v => this.setState({formVariant: {...this.state.formVariant, stock_quantity: v}})} 
                  />
                  <CommonTextInput 
                    label='Stok Min' 
                    value={this.state.isEdit ? this.state.formVariant.stock_min.toString() : undefined}
                    onChangeText={v => this.setState({formVariant: {...this.state.formVariant, stock_min: v}})} 
                  />
                </View>
              )}
              <View style={{
                flexDirection: 'row',
                marginTop: 8
              }}>
                <ActionButton label='Simpan' onPress={this._onSubmitVariant} />
              </View> 
            </ScrollView>
          </View>
        </Modal>

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
            <SimpleData style={{marginBottom: 8}}>
              <SimpleData.Image uri={dataDetail && dataDetail.product_img} />
            </SimpleData>
            <SimpleData style={{marginBottom: 8}}>
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
                    />
                  ))}
                </SimpleData.HasVariants>
              </SimpleData>
            )}
          </ScrollView>
        </BottomSheet>

        {/* ============================================= Modal Categories and Units ============================================= */}
        <MyOwnModal visible={this.state.showSecondaryModal}>
          <MyOwnModal.Picker
            title={this.state.isCategory ? 'Kategori' : 'Satuan'}
            isLoading={this.state.isLoading}
            list={this.state.isCategory ? this.state.DataCategory : this.state.DataUnits}
            isCategory={this.state.isCategory}
            isAddMode={this.state.isAddMode}
            setIsAddMode={s => this.setState({
              isAddMode: s
            })}
            onPress={(item) => {
              if (this.state.isCategory) {
                this.setState({
                  showSecondaryModal: false,
                  form: {
                    ...this.state.form,
                    id_category: item
                  }
                })
              } else {
                if (this.state.isVariant) {
                  this.setState({
                    showSecondaryModal: false,
                    formVariant: {
                      ...this.state.formVariant,
                      id_unit: item
                    }
                  })
                } else {
                  this.setState({
                    showSecondaryModal: false,
                    form: {
                      ...this.state.form,
                      id_unit: item
                    }
                  })
                }
              }
            }}
            onDismiss={() => this.setState({
              showSecondaryModal: false
            })}
            onSubmitNewData={this._onSubmitNewData}
          />
        </MyOwnModal>

        {/* ============================================= Modal Delete Product ============================================= */}
        <MyOwnModal visible={this.state.showDeleteModal}>
          <MyOwnModal.Delete 
            label={this.state.Data.results !== null && this.state.Data.results[this.state.indexSelected]?.product_name}
            loading={this.state.isLoading}
            onDismiss={() => this.setState({
              showDeleteModal: false
            })} 
            onDelete={this._onSubmitDelete}
          />
        </MyOwnModal>

        {/* ============================================= Modal Actions ============================================= */}
        <MyOwnModal visible={this.state.showModalAction}>
          <MyOwnModal.Actions 
            onDismiss={() => this.setState({
              showModalAction: false
            })}
            onEdit={() => this.setState({
              isEdit: true,
              form: {
                ...dataDetail,
                available_stock: dataDetail.available_stock ? 1 : 0,
                id_unit: dataDetail.id_unit === null ? {} : dataDetail.id_unit,
                variants: dataDetail.variants === null ? [] : dataDetail.variants.map(d => {
                  return {
                    id_product: d.id_product,
                    id_variant: d.id_variant,
                    variant_name: d.variant_name,
                    capital_price: d.capital_price,
                    selling_price: d.selling_price,
                    available_stock: d.available_stock ? 1 : 0,
                    id_unit: d.id_unit === null ? {} : {
                      id_owner: d.id_unit.id_owner,
                      id_unit: d.id_unit.id_unit,
                      unit_name: d.id_unit.unit_name
                    },
                    stock_quantity: d.stock_quantity,
                    stock_min: d.stock_min
                  }
                }),
                newVariants: [],
                removeVariants: []
              },
              showModalAction: false,
              showMainModal: true
            })}
            onDelete={() => this.setState({
              showModalAction: false,
              showDeleteModal: true
            })}
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

export default GlobalConsumer(ProductScreen)