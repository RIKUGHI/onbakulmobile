import { faTemperature0 } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Text, Modal, Button, ScrollView, ToastAndroid } from 'react-native';
import Calendar from 'react-native-calendar-range-picker'
import { Provider } from 'react-native-paper';
import { ActionButton, AddButton, BottomSheet, Card, LoadingLoadMore, ManagementLayout, MyOwnModal, NoData, TextInputSearch } from '../../components';
import { GlobalConsumer } from '../../context';
import util from '../../util';
import CalendarRangePicker from './CalendarRangePicker';
import DetailTransaction from './DetailTransaction';
import MonthlyData from './MonthlyData';
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import RNPrint from 'react-native-print';

class HistoryTransactionScreen extends Component {
  constructor(props){
    super(props)
    this.state = {
      Data: {
        type: 'single',
        start: '',
        end: '',
        key_search: '',
        first_data: 0,
        active_page: 0,
        total_pages: 0,
        results: [
          {
            date: 'yyyy-mm-dd',
            total: 0,
            results: [
              {
                id_owner: 0,
                id_outlet: {
                  id_owner: 0,
                  id_outlet: 0,
                  id_category: '0',
                  loginable: '1',
                  owner_code: '',
                  pin: '',
                  outlet_name: '',
                  city: '',
                  address: '',
                  telp: '',
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
                invoice: 'Loading Invoice',
                date: 'yyyy-mm-dd',
                time: 'H:i:s',
                method: 0,
                customer_name: 'Umum',
                discount: 0,
                grand_total: 0,
                paid_off: 0,
                details: [
                  {
                    invoice: 'Loading Invoice',
                    product_name: 'Loading Product Name',
                    capital_price: 0,
                    selling_price: 0,
                    quantity: 0
                  }
                ]
              }
            ]
          }
        ]
      },
      isReadOnly: false,
      inputSearch: '',
      startDate: '2022-03-01',
      endDate: '2022-03-15',
      isLoading: false,
      valuePickerSelected: 'all',
      indexGroupDateSelected: 0,
      indexTranscationSelected: 0,
      idTransactionSelected: 0,
      invoiceSelected: '',
      showCalendar: false,
      showModalTransactionDetail: false,
      showDeleteModal: false
    }
    this._handleLoadMore = this._handleLoadMore.bind(this)
    this._onSubmitSearch = this._onSubmitSearch.bind(this)
    this._onValuePickerChange = this._onValuePickerChange.bind(this)
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
      const transactions_ro = await AsyncStorage.getItem('transactions_ro')
      let url = ''

      if (parseInt(level) === 0) {
        url = query ? query : `?id_owner=${id_owner}`
      } else {
        url = query ? query : `?id_owner=${id_owner}&id_outlet=${id_outlet}`         
      }

      axios.get(util.ServerUrl+'transactions'+url)
      .then(res => {
        this.setState({
          Data: res.data.result,
          isReadOnly: parseInt(transactions_ro) ? true : false
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
        const level = await AsyncStorage.getItem('level')
        const id_owner = await AsyncStorage.getItem('id_owner')
        const id_outlet = await AsyncStorage.getItem('id_outlet')
        
        if (this.state.valuePickerSelected === 'all') {
          const query = this.state.Data.key_search === 'Semua' ? `&page=${this.state.Data.active_page + 1}` : `&page=${this.state.Data.active_page + 1}&q=${this.state.Data.key_search}`
          let url = ''

          if (parseInt(level) === 0) {
            url = `?id_owner=${id_owner}`
          } else {
            url = `?id_owner=${id_owner}&id_outlet=${id_outlet}`
          }

          axios.get(util.ServerUrl+`transactions${url}${query}`)
          .then(res => {
            this.setState({
              Data: {
                type: res.data.result.type,
                start: res.data.result.start,
                end: res.data.result.end,
                key_search: res.data.result.key_search,
                first_data: res.data.result.first_data,
                active_page: res.data.result.active_page,
                total_pages: res.data.result.total_pages,
                results: this.state.Data.results.concat(res.data.result.results)
              }
            })
          }).catch(err => console.log(err))
        } else {
          let url = ''

          if (parseInt(level) === 0) {
            url = util.ServerUrl+`transactions?type=periode&start=${this.state.startDate}&end=${this.state.endDate}&id_owner=${id_owner}&page=${this.state.Data.active_page + 1}`
          } else {
            url = util.ServerUrl+`transactions?type=periode&start=${this.state.startDate}&end=${this.state.endDate}&id_owner=${id_owner}&id_outlet=${id_outlet}&page=${this.state.Data.active_page + 1}`
          }

          axios.get(url)
          .then(res => {
            this.setState({
              Data: {
                type: res.data.result.type,
                start: res.data.result.start,
                end: res.data.result.end,
                key_search: res.data.result.key_search,
                first_data: res.data.result.first_data,
                active_page: res.data.result.active_page,
                total_pages: res.data.result.total_pages,
                results: this.state.Data.results.concat(res.data.result.results)
              }
            })
          }).catch(err => console.log(err))
          
        }
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
      
      if (this.state.valuePickerSelected == 'all') {
        let query

        if (parseInt(level) === 0) {
          query = this.state.inputSearch === '' ? `id_owner=${id_owner}` : `id_owner=${id_owner}&q=${this.state.inputSearch}`
        } else {
          query = this.state.inputSearch === '' ? `id_owner=${id_owner}&id_outlet=${id_outlet}` : `id_owner=${id_owner}&id_outlet=${id_outlet}&q=${this.state.inputSearch}`
        }
        
        axios.get(util.ServerUrl+`transactions?${query}`)
        .then(res => {
          this.setState({
            Data: res.data.result
          })
        }).catch(err => console.log('Request Error',err))
      } else {
        let url = ''

        if (parseInt(level) === 0) {
          url = util.ServerUrl+`transactions?type=periode&start=${this.state.startDate}&end=${this.state.endDate}&id_owner=${id_owner}`
        } else {      
          url = util.ServerUrl+`transactions?type=periode&start=${this.state.startDate}&end=${this.state.endDate}&id_owner=${id_owner}&id_outlet=${id_outlet}`
        }

        axios.get(url)
        .then(res => {
          this.setState({
            Data: res.data.result
          })
        }).catch(err => console.log('Request Error',err))
      }
    } catch (e) {
      console.log(e)
    }
  }

  _onValuePickerChange = (value, index) => {
    this.setState({
      valuePickerSelected: value
    })
  }

  async _onSubmitDelete(){
    try {
      const id_owner = await AsyncStorage.getItem('id_owner')

      this.setState({isLoading: true})
      util.CallAPIDelete(`transactions/delete/${this.state.invoiceSelected}?id_owner=${id_owner}&id_transaction=${this.state.idTransactionSelected}`, (success, message) => {
        this.setState({isLoading: false})
        if (success) this.setState({showDeleteModal: false})
        ToastAndroid.show(message, ToastAndroid.SHORT)
        this._onSubmitSearch()
        // this._firstLoad(this.state.inputSearch === '' ? `?id_owner=${this.props.state.id_owner}` : `?id_owner=${this.props.state.id_owner}&q=${this.state.inputSearch}`)
      })
    } catch (e) {
      console.log(e)
    }
  }

  async printPDF({outletName, invoice, date, method, customer, detailProducts, totalHarga, discount, grandTotal, paidOff, change}) {
    const results = await RNHTMLtoPDF.convert({
      html: `
              <style>
                table{
                  border-collapse: collapse;
                  font-family: 'Times New Roman', Times, serif;
                  width: 400px;
                }
                th,td{
                  padding: 1px 5px;
                  font-size: 12px;
                }
            
                thead tr:first-child th,thead tr:nth-child(2) td,thead tr:nth-child(3) th{
                  text-align: center;
                  padding: 1px 0px;
                }
            
                p{
                  margin: 0;
                }
            
                tbody tr td:first-child{
                  width: 100%;
                }
            
                tbody tr td:nth-child(2),tbody tr td:nth-child(3),tbody tr td:nth-child(4){
                  white-space: nowrap;
                }
            
                tbody tr td:nth-child(3){
                  text-align: center;
                }
            
                tfoot tr td:first-child{
                  text-align: right;
                }
            
                tfoot tr td:last-child{
                  text-align: right;
                  white-space: nowrap;
                }
            
                tfoot tr:last-child td{
                  text-align: center;
                }
            
                .simple-info{
                  display: flex;
                  width: 100%;
                }
            
                .simple-info p:first-child{
                  width: 40px;
                }
            
                .simple-info p:nth-child(2){
                  color: blue;
                  width: 10px;
                }
              </style>
              <table border="0">
                <thead>
                  <tr>
                    <th colspan="4">${outletName}</th>
                  </tr>
                  <tr>
                    <th colspan="4">====================================================================</th>
                  </tr>
                  <tr>
                    <td class="simple-info">
                      <p>Invoice</p>
                      <p>:</p>
                      <p>${invoice}</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="simple-info">
                      <p>Tanggal</p>
                      <p>:</p>
                      <p>${date}</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="simple-info">
                      <p>Metode</p>
                      <p>:</p>
                      <p>${method}</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="simple-info">
                      <p>Pembeli</p>
                      <p>:</p>
                      <p>${customer}</p>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="4" align="center">---------------------------------------------------------------------------------------------------------------------</td>
                  </tr>
                  <tr>
                    <td align="center">Nama</td>
                    <td align="center">Harga</td>
                    <td align="center">Jumlah</td>
                    <td align="center">Sub Total</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="4" align="center">---------------------------------------------------------------------------------------------------------------------</td>
                  </tr>
                    ${
                      detailProducts.map(d => {
                        return `
                                <tr>
                                  <td>${d.product_name}</td>
                                  <td align="right">${util.formatRupiah(d.selling_price)}</td>
                                  <td>${d.quantity}</td>
                                  <td align="right">${util.formatRupiah(d.selling_price * d.quantity)}</td>
                                </tr>
                              `
                      }).join('')
                    }
                  <tr>
                    <td colspan="4" align="center">---------------------------------------------------------------------------------------------------------------------</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3">Total Harga</td>
                    <td>${totalHarga}</td>
                  </tr>
                  ${discount !== 0 && (
                    `
                      <tr>
                        <td colspan="3">Diskon</td>
                        <td>${discount}</td>
                      </tr>
                      <tr>
                        <td colspan="3">Total Belanja</td>
                        <td>${grandTotal}</td>
                      </tr>
                    `
                  )}
                  <tr>
                    <td colspan="3">Bayar</td>
                    <td>${paidOff}</td>
                  </tr>
                  <tr>
                    <td colspan="3">kembali</td>
                    <td>${change}</td>
                  </tr>
                  <tr>
                    <td colspan="4" align="center">---------------------------------------------------------------------------------------------------------------------</td>
                  </tr>
                  <tr>
                    <td colspan="4">Terima Kasih Atas Kunjungan Anda</td>
                  </tr>
                </tfoot>
              </table>
            `,
      fileName: outletName+'_'+date,
      base64: true,
    })

    await RNPrint.print({ filePath: results.filePath })
    console.log(results.filePath);
  }

  render(){
    const dataDetail = this.state.Data.results !== null ? (this.state.Data.results[this.state.indexGroupDateSelected] != null ? this.state.Data.results[this.state.indexGroupDateSelected].results[this.state.indexTranscationSelected] : null) : null;

    return(
      <ManagementLayout>
        <ManagementLayout.Header>
          <Picker 
            style={{backgroundColor: util.Colors.SecondaryWhite, flex: 1, height: 42}}
            selectedValue={this.state.valuePickerSelected}
            mode='dropdown'
            onValueChange={this._onValuePickerChange}
          >
            <Picker.Item label='Semua' value='all' />
            <Picker.Item label='Per Periode' value='periode' />
          </Picker>
        </ManagementLayout.Header>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          {this.state.valuePickerSelected == 'all' ? <TextInputSearch
                                                        placeholder='Cari invoice'
                                                        onChangeText={v => this.setState({
                                                          inputSearch: v
                                                        })}
                                                        onSubmitSearch={this._onSubmitSearch}
                                                      /> : <CalendarRangePicker
                                                                              startDate={this.state.startDate}
                                                                              endDate={this.state.endDate}
                                                                              onOpenCalendar={() => this.setState({
                                                                                showCalendar: true
                                                                              })}
                                                                              onShowData={this._onSubmitSearch}
                                                                          />}
        </View>
        <FlatList
          data={this.state.Data.results} 
          renderItem={({ item, index }) => <MonthlyData 
                                            key={index}
                                            index={index} 
                                            totalData={this.state.Data.results. length -1}
                                            data={item} 
                                            onPressTransactionItem={indexTranscationSelected => this.setState({
                                              indexGroupDateSelected: index,
                                              indexTranscationSelected,
                                              idTransactionSelected: item.results[indexTranscationSelected].id_transaction,
                                              invoiceSelected: item.results[indexTranscationSelected].invoice,
                                              showModalTransactionDetail: true
                                            })}
                                          />}
          ListEmptyComponent={() => <NoData title='Transaksi' />}
          ListFooterComponent={() => <LoadingLoadMore show={(!(this.state.Data.results === null) && this.state.Data.total_pages === 0) || (this.state.Data.results !== null && !(this.state.Data.active_page === this.state.Data.total_pages))} />}
          onEndReached={this._handleLoadMore}
          showsVerticalScrollIndicator={false}
          style={{
            marginTop: 15
          }}
        />

        {/* ============================================= Calendar Range Picker ============================================= */}
        <BottomSheet
          show={this.state.showCalendar}
          onDismiss={() => this.setState({
            showCalendar: false
          })}
        >
          <Calendar
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            futureYearRange={1}
            onChange={({ startDate, endDate }) => {
              this.setState({
                startDate: startDate,
                endDate: endDate
              })
              if (startDate && endDate) {
                this.setState({
                  showCalendar: false
                })
              }
            }}
          />
        </BottomSheet>

        {/* ============================================= Modal Detail Transaction ============================================= */}
        <BottomSheet
          title='Detail Transaksi'
          show={this.state.showModalTransactionDetail}
          onDismiss={() => this.setState({
            showModalTransactionDetail: false
          })}
        >
          <ScrollView 
            contentContainerStyle={{padding: 15}}
            showsVerticalScrollIndicator={false}
          >
            <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>{dataDetail && dataDetail.id_outlet.outlet_name}</Text>
            <DetailTransaction>
              <DetailTransaction.Common label={{text: 'Invoice', bold: false}} value={{text: dataDetail && dataDetail.invoice, bold: false}} />
              <DetailTransaction.Common label={{text: 'Tanggal', bold: false}} value={{text: dataDetail && util.dateToInaFormat(dataDetail.date), bold: false}} />
              <DetailTransaction.Common label={{text: 'Metode', bold: false}} value={{text: dataDetail && util.methods[dataDetail.method], bold: false}} />
              <DetailTransaction.Common label={{text: 'Pembeli', bold: false}} value={{text: dataDetail && dataDetail.customer_name, bold: false}} disableMarginBottom />
            </DetailTransaction>
            <DetailTransaction>
              {dataDetail && dataDetail.details.map((d, i) => <DetailTransaction.Product 
                                                  key={i}
                                                  name={d.product_name}
                                                  price={d.selling_price}
                                                  quantity={d.quantity}
                                                  disableMarginBottom={i === dataDetail.details.length - 1}
                                                />)}
            </DetailTransaction>
            <DetailTransaction>
              <DetailTransaction.Common label={{text: 'Total Harga', bold: true}} value={{text: util.formatRupiah(dataDetail ? (dataDetail.discount === 0 ? dataDetail.grand_total : dataDetail.grand_total + dataDetail.discount) : 0), bold: true}} />
              {dataDetail && dataDetail.discount !== 0 && (
                <View>
                  <DetailTransaction.Common label={{text: 'Diskon', bold: true}} value={{text: '-'+dataDetail && util.formatRupiah(dataDetail.discount), bold: true}} />
                  <DetailTransaction.Common label={{text: 'Total Belanja', bold: true}} value={{text: dataDetail && util.formatRupiah(dataDetail.grand_total), bold: true}} />
                </View>
              )}
            </DetailTransaction>
            <DetailTransaction>
              <DetailTransaction.Common label={{text: 'Bayar', bold: false}} value={{text: util.formatRupiah(dataDetail ? dataDetail.paid_off : 0), bold: true}} />
              <DetailTransaction.Common label={{text: 'Kembali', bold: false}} value={{text: util.formatRupiah(dataDetail ? (dataDetail.paid_off - dataDetail.grand_total) : 0), bold: true}} />
            </DetailTransaction>
            <View style={{flexDirection: 'row'}}>
              {!this.state.isReadOnly && (
                <ActionButton 
                  label='Hapus' 
                  backgroundColor='red' 
                  enableMarginRight
                  onPress={() => this.setState({
                    showModalTransactionDetail: false,
                    showDeleteModal: true
                  })}
                />
              )}
              <ActionButton 
                label='Cetak' 
                backgroundColor={util.Colors.MainColor} 
                onPress={() => this.printPDF({
                  outletName: dataDetail && dataDetail.id_outlet.outlet_name,
                  invoice: dataDetail && dataDetail.invoice,
                  date: dataDetail && util.dateToInaFormat(dataDetail.date),
                  method: dataDetail && util.methods[dataDetail.method],
                  detailProducts: dataDetail && dataDetail.details,
                  customer: dataDetail && dataDetail.customer_name,
                  totalHarga: util.formatRupiah(dataDetail && (dataDetail.discount === 0 ? dataDetail.grand_total : dataDetail.grand_total + dataDetail.discount)),
                  discount: dataDetail && dataDetail.discount !== 0 ? '-'+util.formatRupiah(dataDetail && dataDetail.discount) : 0,
                  grandTotal: util.formatRupiah(dataDetail && dataDetail.grand_total),
                  paidOff: dataDetail && util.formatRupiah(dataDetail.paid_off),
                  change: dataDetail && util.formatRupiah(dataDetail.paid_off - dataDetail.grand_total)
                })}
              />
            </View>
          </ScrollView>
        </BottomSheet>

        {/* ============================================= Modal Delete Transaction ============================================= */}
        <MyOwnModal
          visible={this.state.showDeleteModal}
        >
          <MyOwnModal.Delete
            label={dataDetail && dataDetail.invoice}
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

export default HistoryTransactionScreen