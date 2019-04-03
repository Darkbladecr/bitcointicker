import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { numberWithCommas } from './helpers';

export default class TickerList extends Component {
  render() {
    const { data } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.padding} />
        <View style={styles.separatorBody}>
          <View style={styles.separator} />
        </View>
        <FlatList
          style={styles.list}
          data={data}
          renderItem={({ item }) => (
            <View style={styles.column}>
              <View style={styles.row}>
                <Text style={styles.item}>Bitcoin ({item.key})</Text>
                <Text style={styles.item}>
                  {item.sign}
                  {numberWithCommas(item.price)}
                </Text>
              </View>
              <View style={styles.separator} />
            </View>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    marginBottom: 36,
  },
  padding: {
    flex: 1,
  },
  list: {
    flex: 1,
    margin: 2,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  item: {
    color: '#fff',
    fontSize: 18,
  },
  itemKey: {
    textAlign: 'left',
  },
  itemPrice: {
    textAlign: 'right',
  },
  separatorBody: {
    flexDirection: 'row',
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: '#6A86B4',
  },
});
