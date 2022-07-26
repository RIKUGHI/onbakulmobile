import React, { Component } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import InfoCard from './InfoCard'
import util from '../../util';
import GraphCard from './GraphCard';
import { faDollarSign, faDonate, faFileAlt, faFileInvoice, faFileInvoiceDollar, faHandHoldingDollar } from '@fortawesome/free-solid-svg-icons';
import { GlobalConsumer } from '../../context';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheet, HeaderModal, TextInputSearch } from '../../components';

class DashboardScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      chartWidth: Dimensions.get("window").width - 60,
      showOmset: false,
      isOmset: false,
      Data: {
        total_transactions: 0,
        omset: {
          month: 0,
          total: 0,
          omsets: [
              {
                id_transaction: 0,
                id_outlet: {
                  id_owner: 0,
                  id_outlet: 0,
                  id_category: 0,
                  loginable: 0,
                  owner_code: 'Loading Owner Code',
                  pin: 0,
                  outlet_name: 'Loading Outlet Name',
                  city: '',
                  address: '',
                  telp: '0',
                  products_ro: '0',
                  units_ro: '0',
                  categories_ro: '0',
                  customers_ro: '0',
                  suppliers_ro: '0',
                  outlets_ro: '0',
                  transactions_ro: '0',
                  purchases_ro: '0'
                },
              invoice: 'Loading Invoice',
              date: '0000-00-00',
              time: '00:00:00',
              grand_total: 0
            }
          ],
          data: [
            {
              id_outlet: {
                id_owner: 0,
                id_outlet: 0,
                id_category: 0,
                loginable: 0,
                owner_code: 'Loading Owner Code',
                pin: 0,
                outlet_name: 'Loading Outlet Name',
                city: '',
                address: '',
                telp: '0',
                products_ro: '0',
                units_ro: '0',
                categories_ro: '0',
                customers_ro: '0',
                suppliers_ro: '0',
                outlets_ro: '0',
                transactions_ro: '0',
                purchases_ro: '0'
              },
                id_transaction: 0,
                product_name: 'Loading Product Name',
                selling_price: 0,
                capital_price: 0,
                quantity: 0
            }
          ]
        },
        profit: 0,
        expenditure: 0,
        total_order_plan: 0,
        daily_profit: {
          month: 1,
          data: [
            {
              date: '2000-01-01',
              profit: 0
            }
          ]
        },
        top_10_products: {
          month: 1,
          data: [
            {
              product_name: "kosong",
              total: 0
            }
          ]
        },
        last_7_days_trasaction: {
          month: 1,
          data: [
            {
              date: '2000-01-01',
              total: 0
            }
          ]
        },
        monthly_transactions: {
          month: 1,
          data: [
            {
              date: '2000-01-01',
              total: 0
            }
          ]
        },
        yearly_transactions: {
          year: 12,
          data: [
            {
              date: '2000',
              total: 0
            }
          ]
        }
      },
      filteredOmsets: [
        {
          id_transaction: 0,
          id_outlet: {
            id_owner: 0,
            id_outlet: 0,
            id_category: 0,
            loginable: 0,
            owner_code: 'Loading Owner Code',
            pin: 0,
            outlet_name: 'Loading Outlet Name',
            city: '',
            address: '',
            telp: '0',
            products_ro: '0',
            units_ro: '0',
            categories_ro: '0',
            customers_ro: '0',
            suppliers_ro: '0',
            outlets_ro: '0',
            transactions_ro: '0',
            purchases_ro: '0'
          },
          invoice: 'Loading Invoice',
          date: '0000-00-00',
          time: '00:00:00',
          grand_total: 0
        }
      ],
      filteredDetails: [
        {
          id_outlet: {
            id_owner: 0,
            id_outlet: 0,
            id_category: 0,
            loginable: 0,
            owner_code: 'Loading Owner Code',
            pin: 0,
            outlet_name: 'Loading Outlet Name',
            city: '',
            address: '',
            telp: '0',
            products_ro: '0',
            units_ro: '0',
            categories_ro: '0',
            customers_ro: '0',
            suppliers_ro: '0',
            outlets_ro: '0',
            transactions_ro: '0',
            purchases_ro: '0'
          },
            id_transaction: 0,
            product_name: 'Loading Product Name',
            selling_price: 0,
            capital_price: 0,
            quantity: 0
        }
      ]
    }
  }
  
  componentDidMount(){
    this.props.navigation.addListener('focus', () => {
      Dimensions.addEventListener('change', ({window: {width, height}}) =>{
        this.setState({
          chartWidth: Dimensions.get('window').width - 60
        })
      }) 
  
      this._firstLoad()
    })
  }

  async _firstLoad(){
    try {
      const level = await AsyncStorage.getItem('level')
      const id_owner = await AsyncStorage.getItem('id_owner')
      const id_outlet = await AsyncStorage.getItem('id_outlet')
      let url = ''
      
      if (parseInt(level) === 0) {
        url = util.ServerUrl+`transactions/dashboard?id_owner=${id_owner}`
      } else {
        url = util.ServerUrl+`transactions/dashboard?id_owner=${id_owner}&id_outlet=${id_outlet}`
      }

      axios.get(url)
      .then(res => {
        this.setState({
          Data: res.data.result,
          filteredOmsets: res.data.result.omset.omsets,
          filteredDetails: res.data.result.omset.data
        })
      }).catch(err => console.log('Request Error',err))
    } catch (error) {
      console.log(error)
    }
  }
  
  render(){
    return(
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <InfoCard title='Transaksi' value={this.state.Data.total_transactions} icon={faFileInvoiceDollar} />
        <InfoCard 
          title='Omset' 
          value={util.formatRupiah(this.state.Data.omset.total)} 
          icon={faDollarSign} 
          onPress={() => this.setState({showOmset: true, isOmset: true})}
        />
        <InfoCard 
          title='Keuntungan Produk' 
          value={util.formatRupiah(this.state.Data.profit)} 
          icon={faHandHoldingDollar} 
          onPress={() => this.setState({showOmset: true, isOmset: false})}
        />
        <InfoCard title='Pengeluaran' value={this.state.Data.expenditure} icon={faDonate} />
        <InfoCard title='Rencana Order' value={this.state.Data.total_order_plan} icon={faFileAlt} marginBot />
        <GraphCard title={`Grafik Keuntungan Pada Bulan ${util.Months[this.state.Data.monthly_transactions.month - 1]}`}>
          <LineChart
            data={{
              labels: this.state.Data.daily_profit.data.map(d => d.date),
              datasets: [
                {
                  data: this.state.Data.daily_profit.data.length === 0 ? [0] : this.state.Data.daily_profit.data.map(d => d.profit)
                }
              ]
            }}
            width={this.state.chartWidth}
            height={320}
            yAxisLabel="Rp"
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(83, 84, 215, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: util.Colors.MainColor,
                fill: 'rgb(255, 255, 255, 0)'
              }
            }}
            verticalLabelRotation={30}
          />
        </GraphCard>
        <GraphCard title={`Top 10 Barang Terlaris Pada Bulan ${util.Months[this.state.Data.monthly_transactions.month - 1]}`}>
          <BarChart
            data={{
              labels: this.state.Data.top_10_products.data.map(d => d.product_name),
              datasets: [
                {
                  data: this.state.Data.top_10_products.data.length === 0 ? [0] : this.state.Data.top_10_products.data.map(d => d.total)
                }
              ]
            }}
            width={Dimensions.get("window").width - 60}
            height={320}
            chartConfig={{
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(83, 84, 215, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                // stroke: util.Colors.MainColor,
                // fill: 'transaparent'
              }
            }}
            verticalLabelRotation={30}
          />
        </GraphCard>
        <GraphCard title='Transaksi 7 Hari Terakhir'>
          <LineChart
            data={{
              labels: this.state.Data.last_7_days_trasaction.data.map(d => d.date),
              datasets: [
                {
                  data: this.state.Data.last_7_days_trasaction.data.length === 0 ? [0] : this.state.Data.last_7_days_trasaction.data.map(d => d.total)
                }
              ]
            }}
            width={Dimensions.get("window").width - 60}
            height={320}
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(83, 84, 215, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: util.Colors.MainColor,
                fill: 'rgb(255, 255, 255, 0)'
              }
            }}
            verticalLabelRotation={30}
          />
        </GraphCard>
        <GraphCard title={`Transaksi Bulan ${util.Months[this.state.Data.monthly_transactions.month - 1]}`}>
          <LineChart
            data={{
              labels: this.state.Data.monthly_transactions.data.map(d => d.date),
              datasets: [
                {
                  data: this.state.Data.monthly_transactions.data.length === 0 ? [0] : this.state.Data.monthly_transactions.data.map(d => d.total)
                }
              ]
            }}
            width={Dimensions.get("window").width - 60}
            height={320}
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(83, 84, 215, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: util.Colors.MainColor,
                fill: 'rgb(255, 255, 255, 0)'
              }
            }}
            verticalLabelRotation={30}
          />
        </GraphCard>
        <GraphCard title={`Transaksi Tahun ${this.state.Data.yearly_transactions.year}`} marginBot>
          <LineChart
            data={{
              labels: this.state.Data.yearly_transactions.data.map(d => d.date),
              datasets: [
                {
                  data: this.state.Data.yearly_transactions.data.length === 0 ? [0] : this.state.Data.yearly_transactions.data.map(d => d.total)
                }
              ]
            }}
            width={Dimensions.get("window").width - 60}
            height={320}
            yAxisInterval={1}
            chartConfig={{
              backgroundGradientFrom: 'white',
              backgroundGradientTo: 'white',
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(83, 84, 215, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: util.Colors.MainColor,
                fill: 'rgb(255, 255, 255, 0)'
              }
            }}
            verticalLabelRotation={30}
          />
        </GraphCard>

        {/* ============================================= Modal Omset ============================================= */}
        <Modal
          animationType='slide'
          transparent={true}
          visible={this.state.showOmset}
        >
          <HeaderModal
            title={`Detail ${this.state.isOmset ? 'Omset' : 'Keuntungan'}`}
            onDismiss={() => this.setState({
              showOmset: false,
              filteredOmsets: this.state.Data.omset.omsets,
              filteredDetails: this.state.Data.omset.data,
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
            <View style={{marginBottom: 15}}>
              <TextInputSearch 
                placeholder='Cari Outlet' 
                onChangeText={v => this.setState({
                  filteredOmsets: this.state.Data.omset.omsets.filter(text => text.id_outlet.outlet_name.toLowerCase().includes(v.toLowerCase())),
                  filteredDetails: this.state.Data.omset.data.filter(text => text.id_outlet.outlet_name.toLowerCase().includes(v.toLowerCase()))
                })}
              />
            </View>
            {(this.state.filteredOmsets || this.state.filteredDetails).length === 0 && <Text>Outlet Tersebut Tidak Tersedia</Text>}
            {(this.state.isOmset ? this.state.filteredOmsets : this.state.filteredDetails).map((d, i) => (
              <View
                key={i} 
                style={{
                  flex: 1,
                  flexDirection: 'row', 
                  backgroundColor: util.Colors.SecondaryWhite, 
                  padding: 10, 
                  borderRadius: 10,
                  marginBottom: this.state.Data.omset.data.length === i + 1 ? 0 : 5 
                }}>
                <View style={{flex: 1}}>
                  <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>{this.state.isOmset ? d.invoice : d.product_name+' - '+d.id_outlet.outlet_name}</Text>
                  {this.state.isOmset ? (
                    <View>
                      <Text style={{color: 'black'}}>Outlet: {d.id_outlet.outlet_name}</Text>
                      <Text style={{color: 'black'}}>Tanggal: {d.date+' '+d.time}</Text>
                    </View>
                    ) : (
                      <View>
                        <Text style={{color: 'black'}}>Harga Jual: {util.formatRupiah(d.selling_price)}</Text>
                        <Text style={{color: 'black'}}>Harga Modal: {util.formatRupiah(d.capital_price)}</Text>
                        <Text style={{color: 'black'}}>Keuntungan: {util.formatRupiah(d.selling_price - d.capital_price)} x {d.quantity}</Text>
                      </View>
                  )}
                </View>
                {this.state.isOmset ? (
                  <Text style={{color: 'black', alignSelf: 'center'}}>{util.formatRupiah(d.grand_total)}</Text>
                  ) : (
                  <Text style={{color: 'black', alignSelf: 'center'}}>{util.formatRupiah((d.selling_price - d.capital_price) * d.quantity)}</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </Modal>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // padding: 15,
    backgroundColor: util.Colors.White
  },
})

export default GlobalConsumer(DashboardScreen)