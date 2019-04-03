import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import gdax from './gdax';

function Ticker(props) {
  const [price, setPrice] = useState(0);
  useEffect(() => {
    const priceSub = gdax['BTC-GBP'].subscribe(
      price => setPrice(price),
      err => console.log(err),
      () => console.log('disconnected')
    );
    return () => priceSub.unsubscribe();
  });
  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <Text>Price: £{Number.parseFloat(price).toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  padding: {
    height: 30,
  },
  separator: {
    height: 2,
    width: 100,
    backgroundColor: '#000',
    marginTop: 5,
    marginBottom: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  quote: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});

export default Ticker;
