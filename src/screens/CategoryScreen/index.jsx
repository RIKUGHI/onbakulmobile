import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, View, Text, Modal, ToastAndroid } from 'react-native';
import { ActionButton, AddButton, Card, CommonTextInput, HeaderModal, LoadingLoadMore, ManagementLayout, MyOwnModal, NoData, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';

const defaultForm = {
  category_name: ''
}

class CategoryScreen extends Component {
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
            id_category: 0,
            category_name: 'Loading Category Name'
          }
        ]
      },
      inputSearch: '',
      form: defaultForm,
      isReadOnly: false,
      isLoading: false,
      indexSelected: 0,
      idCategorytSelected: 0,
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
      const categories_ro = await AsyncStorage.getItem('categories_ro')
      let url = query ? query : `?id_owner=${id_owner}` 

      axios.get(util.ServerUrl+'categories'+url)
      .then(res => {
        this.setState({
          Data: res.data.result,
          isReadOnly: parseInt(categories_ro) ? true : false 
        })
      }).catch(err => console.log('Request Error',err))
    } catch (error) {
      console.log(error)
    }
  }

  async _handleLoadMore(){
    if (this.state.Data.active_page === this.state.Data.total_pages || this.state.Data.results.length === 1) {
      console.log('No more product data');
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const query = this.state.Data.key_search === 'Semua' ? `&page=${this.state.Data.active_page + 1}` : `&page=${this.state.Data.active_page + 1}&q=${this.state.Data.key_search}`
        
        axios.get(util.ServerUrl+`categories?id_owner=${id_owner}${query}`)
        .then(res => {
          res.data.result.results.shift()
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
    if (!(this.state.inputSearch.toLocaleLowerCase() === 'umum')) {
      if (this.state.Data.key_search.toLowerCase() === this.state.inputSearch.toLowerCase() || this.state.inputSearch === '' && this.state.Data.key_search === 'Semua') {
        console.log('search kosong karena sama atau input search kosong');
      } else {
        try {
          const id_owner = await AsyncStorage.getItem('id_owner')
          const query = this.state.inputSearch === '' ? `id_owner=${id_owner}` : `id_owner=${id_owner}&q=${this.state.inputSearch}`
          
          axios.get(util.ServerUrl+`categories?${query}`)
          .then(res => {
            this.setState({
              Data: res.data.result
            })
          }).catch(err => console.log('Request Error',err))
        } catch (error) {
          console.log(error)
        }
      }
    } 
  }

  async _onSubmit(){
    if (this.state.form.category_name === '') {
      ToastAndroid.show('Nama tidak boleh kosong', ToastAndroid.SHORT)
    } else {
      try {
        const id_owner = await AsyncStorage.getItem('id_owner')
        const data = new FormData()
        
        data.append('id_owner', id_owner)
        data.append('category_name', this.state.form.category_name.toString().trim())
    
        this.setState({isLoading: true})
        await util.CallAPIPost('categories/'+(this.state.isEdit ? 'edit/'+this.state.idCategorytSelected : 'create'), data, (success, message) => {
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
      util.CallAPIDelete(`categories/delete/${this.state.idCategorytSelected}?id_owner=${id_owner}`, (success, message) => {
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
            placeholder='Cari kategori' 
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
                                            onPress={item.id_owner === 0 ? undefined : (!this.state.isReadOnly ? () => this.setState({
                                              isEdit: true,
                                              indexSelected: index,
                                              idCategorytSelected: item.id_category,
                                              form: item,
                                              showMainModal: true
                                            }) : undefined)} 
                                            onLongPress={() => {
                                              if (!this.state.isReadOnly) {
                                                this.setState({
                                                  indexSelected: index,
                                                  idCategorytSelected: item.id_category,
                                                  showDeleteModal: item.id_category === 0 ? false : true
                                                })
                                              }
                                            }}
                                          >
                                            <Card.SingleData label={item.category_name} />
                                          </Card>}
          keyExtractor={item => item.id_category}
          ListEmptyComponent={() => <NoData title='Satuan' />}
          ListFooterComponent={() => <LoadingLoadMore show={this.state.Data.results === null ? false : (this.state.Data.results.length === 1 ? false : (!(this.state.Data.results === null) && this.state.Data.total_pages === 0) || (this.state.Data.results !== null && !(this.state.Data.active_page === this.state.Data.total_pages)))} />}
          onEndReached={this._handleLoadMore}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 15
          }}
        />
        
        {/* ============================================= Modal Add/Edit Category ============================================= */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showMainModal}
        >
          <HeaderModal
            title={`${this.state.isEdit ? 'Edit' : 'Tambah'} Kategori`}
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
              value={this.state.isEdit ? this.state.form.category_name : undefined}
              onChangeText={v => this.setState({form: {...this.state.form, category_name: v}})} 
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

        {/* ============================================= Modal Delete Category ============================================= */}
        <MyOwnModal
          visible={this.state.showDeleteModal}
        >
          <MyOwnModal.Delete
            label={this.state.Data.results !== null && this.state.Data.results[this.state.indexSelected]?.category_name}
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

export default GlobalConsumer(CategoryScreen)