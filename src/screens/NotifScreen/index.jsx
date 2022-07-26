import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { Component } from 'react';
import { FlatList, StyleSheet, ScrollView, View, Text, Modal } from 'react-native';
import { ActionButton, AddButton, Card, CommonTextInput, HeaderModal, LoadingLoadMore, ManagementLayout, MyOwnModal, NoData, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';

class NotifScreen extends Component {
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
            product_name: 'Loading Product Name',
            stock_quantity: 0
          }
        ]
      },
    }
  }

  componentDidMount(){
    this.props.navigation.addListener('focus', () => {
      this._firstLoad()
    })
  }

  componentDidUpdate(){
    this.props.navigation.setOptions({
      headerRight: () => <View />
    })
  }

  async _firstLoad(query){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')
      
      axios.get(util.ServerUrl+`notifications?id_owner=${id_owner}`)
      .then(res => {
        this.setState({
          Data: res.data.result
        })
      }).catch(err => console.log('Request Error',err))
    } catch (e) {
      console.log(e)
    }
  }

  render(){
    return(
      <ManagementLayout>
        <FlatList
          data={this.state.Data.results} 
          renderItem={({ item, index }) => <Card
                                            index={index}
                                            totalData={this.state.Data.length - 1}
                                            onPress={() => {console.log('press unit')}} 
                                            onLongPress={() => {console.log('long press unit')}}
                                          >
                                            <Card.Notif 
                                              data={item} 
                                              onItemPress={() => {
                                                this.props.navigation.navigate('Produk', {
                                                  product_name: item.product_name
                                                })
                                              }}
                                            />
                                          </Card>}
          keyExtractor={item => item.id_product}
          ListEmptyComponent={() => <NoData title='Notifikasi' />}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 15
          }}
        />
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

export default GlobalConsumer(NotifScreen)