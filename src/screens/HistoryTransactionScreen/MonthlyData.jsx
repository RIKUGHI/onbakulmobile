import React from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Card } from '../../components';
import util from '../../util';

export default ({ index, totalData, data, onPressTransactionItem }) => {
  const isLastItem = index === totalData ? true : false

  return(
    <View style={isLastItem ? {} : {marginBottom: 25}}>
      <View style={{
        // borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
        <Text style={{color: util.Colors.MainColor, fontWeight: 'bold'}}>{util.getDay(data.date)}, {util.dateToInaFormat(data.date)}</Text>
        <Text style={{color: util.Colors.MainColor, fontWeight: 'bold'}}>{util.formatRupiah(data.total)}</Text>
      </View>
      <FlatList
        data={data.results}
        renderItem={({ item, index }) => <Card
                            index={index}
                            totalData={data.results.length - 1}
                            onPress={() => onPressTransactionItem(index)}
                          >
                            <Card.TransactionHistory
                              invoice={item.invoice}
                              grandTotal={item.grand_total}
                              method={item.method}
                              isLunas={parseInt(item.paid_off) - parseInt(item.grand_total) >= 0}
                              time={item.time}
                            />
                          </Card>
                        }
        keyExtractor={item => item.id_transaction}
        style={{
          marginTop: 10
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})