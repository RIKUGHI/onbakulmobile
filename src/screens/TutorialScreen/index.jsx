import React, { Component } from 'react';
import { FlatList, StyleSheet, Linking, ToastAndroid } from 'react-native';
import { ActionButton, AddButton, Card, LoadingLoadMore, ManagementLayout, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';

const initData = [
  {
    id: 1,
    title: 'Menambahkan Produk Tanpa Stok',
    url: 'https://www.m.youtube.com/embed/f7zHYQ-nqXU'
  },
  {
    id: 2,
    title: 'Menambahkan Produk Dengan Stok',
    url: 'https://youtu.be/f7zHYQ-nqXU'
  },
  {
    id: 3,
    title: 'Menambahkan Produk Dengan Variasi',
    url: 'https://youtu.be/wMzgfc5jAMM'
  },
  {
    id: 4,
    title: 'Mengubah Produk',
    url: 'https://youtu.be/gEVlFGPpiWE'
  },
  {
    id: 5,
    title: 'Menghapus Produk',
    url: 'https://youtu.be/4tgPQOd9Y68'
  },
  {
    id: 6,
    title: 'Lihat Transaksi',
    url: ''
  },
]

class TutorialScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      Data: initData,
    }
    this._handleLoadMore = this._handleLoadMore.bind(this)
  } 

  _add(){
    console.log('add');
  }

  _handleLoadMore(){
    console.log('load more');
    // this.setState({
    //   Data: this.state.Data.concat([
    //       {
    //         id: 7,
    //         title: 'Seventh Item',
    //       },
    //       {
    //         id: 8,
    //         title: 'Eighth Item',
    //       },
    //   ])
    // })
  }

  render(){
    return(
      <ManagementLayout>
        <ManagementLayout.Header>
          <TextInputSearch 
            placeholder='Cari tutorial' 
            onChangeText={v => this.setState({
              Data: initData.filter(text => text.title.toLowerCase().includes(v.toLowerCase()))
            })}
          />
        </ManagementLayout.Header>
        <FlatList
          data={this.state.Data} 
          renderItem={({ item, index }) => <Card
                                            index={index}
                                            totalData={this.state.Data.length - 1}
                                            onPress={async () => {
                                              const isSupported = await Linking.canOpenURL(item.url)

                                              if (isSupported) {
                                                await Linking.openURL(item.url)
                                              } else {
                                                ToastAndroid.show('Device does not support', ToastAndroid.SHORT)
                                              }
                                            }} 
                                          >
                                            <Card.Tutorial title={item.title} />
                                          </Card>}
          keyExtractor={item => item.id}
          ListFooterComponent={LoadingLoadMore}
          onEndReached={this._handleLoadMore}
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

export default GlobalConsumer(TutorialScreen)