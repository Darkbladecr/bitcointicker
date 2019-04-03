import React from 'react';
import { Text, View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { getWallet } from './bitmex';
import { numberWithCommas } from './helpers';

let walletPolling;

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
      wallet: 0,
      realized: false,
    };
  }
  async getWallet(bitmexKey, bitmexSecret) {
    const { realized } = this.state;
    if (!bitmexKey && !bitmexSecret) {
      bitmexKey = this.props.bitmexKey;
      bitmexSecret = this.props.bitmexSecret;
    }
    try {
      const summary = await getWallet(bitmexKey, bitmexSecret);
      const coin = realized ? summary.amount : summary.marginBalance;
      this.setState({ wallet: coin / 10 ** 8 });
    } catch (err) {
      return console.warn(err);
    }
  }
  async componentWillUpdate(nextProps, nextState) {
    const { bitmexKey, bitmexSecret } = nextProps;
    const { realized } = nextState;
    if (realized !== this.state.realized) {
      await this.getWallet();
    }
    if (!walletPolling && bitmexKey.length > 0 && bitmexSecret.length > 0) {
      await this.getWallet(bitmexKey, bitmexSecret);
      walletPolling = setInterval(() => this.getWallet(), 1000 * 10);
    }
  }
  componentWillUnmount() {
    clearInterval(walletPolling);
  }
  toggleRealized = toggle => {
    this.setState({ realized: toggle });
  };
  render() {
    const { wallet, realized } = this.state;
    const { price, sign, selector } = this.props;
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={selector}>
          <Text style={[styles.quote, styles.text]}>
            {sign}
            {numberWithCommas(price * wallet)}
          </Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <Text style={styles.text}>
          Wallet: {Number.parseFloat(wallet).toFixed(4)}
        </Text>
        <View style={styles.padding} />
        <View style={styles.container}>
          <Switch value={realized} onValueChange={this.toggleRealized} />
          <Text style={styles.text}>
            {realized ? 'Realized' : 'Unrealized'}
          </Text>
        </View>
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
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  quote: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  text: {
    color: '#fff',
  },
});

export default Ticker;
