import React from 'react';
import { Text, View, StyleSheet, Alert } from 'react-native';
import gdax from './gdax';
import { getWallet } from './bitmex';

let walletPolling, pairs;

class Ticker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: {
        symbol: 'XBTUSD',
        lastPrice: 0,
        lastTickDirection: 'ZeroPlusTick',
        lastChangePcnt: 0,
        timestamp: new Date(),
      },
      price: 0,
      wallet: 0,
    };
  }
  getWallet(bitmexKey, bitmexSecret) {
    if (!bitmexKey && !bitmexSecret) {
      bitmexKey = this.props.bitmexKey;
      bitmexSecret = this.props.bitmexSecret;
    }
    return getWallet(bitmexKey, bitmexSecret)
      .then(summary => {
        const coin = this.props.realized
          ? summary.amount
          : summary.marginBalance;
        this.setState({ wallet: coin / 10 ** 8 });
      })
      .catch(err => console.warn(err));
  }
  componentWillUpdate(nextProps) {
    const { realized, bitmexKey, bitmexSecret } = nextProps;
    if (realized !== this.props.realized) {
      this.getWallet();
    }
    if (!walletPolling && bitmexKey.length > 0 && bitmexSecret.length > 0) {
      this.getWallet(bitmexKey, bitmexSecret);
      walletPolling = setInterval(() => this.getWallet(), 1000 * 60 * 5);
    }
  }
  componentDidMount() {
    pairs = gdax['BTC-GBP'].subscribe(
      price => this.setState({ price }),
      err => console.log(err),
      () => console.log('disconnected')
    );
  }
  componentWillUnmount() {
    clearInterval(walletPolling);
    pairs.unsubscribe();
  }
  render() {
    const { price, wallet } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.quote}>
          £{Number.parseFloat(price * wallet).toFixed(2)}
        </Text>
        <View style={styles.separator} />
        <Text>Wallet: {Number.parseFloat(wallet).toFixed(4)}</Text>
        <Text>Price: £{Number.parseFloat(price).toFixed(2)}</Text>
      </View>
    );
  }
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
