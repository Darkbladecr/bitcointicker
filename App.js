import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  AsyncStorage,
  ActivityIndicator,
  ActionSheetIOS,
} from 'react-native';
import Ticker from './Ticker';
import Login from './Login';
import TickerList from './TickerList';
import gdax from './gdax';

const BITMEX_API_KEY = 'BITMEX_API_KEY',
  BITMEX_API_SECRET = 'BITMEX_API_SECRET';

const pairs = [];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bitmexKey: '',
      bitmexSecret: '',
      loggedOut: true,
      loading: true,
      currency: 'GBP',
      priceBTCUSD: 0,
      priceBTCEUR: 0,
      priceBTCGBP: 0,
    };
  }
  async componentWillMount() {
    pairs.push(
      gdax['BTC-USD'].subscribe(
        price => this.setState({ priceBTCUSD: price }),
        err => console.log(err)
      ),
      gdax['BTC-EUR'].subscribe(
        price => this.setState({ priceBTCEUR: price }),
        err => console.log(err)
      ),
      gdax['BTC-GBP'].subscribe(
        price => this.setState({ priceBTCGBP: price }),
        err => console.log(err)
      )
    );
    await AsyncStorage.multiGet(
      [BITMEX_API_KEY, BITMEX_API_SECRET],
      async (err, res) => {
        if (res[0][1] && res[1][1]) {
          await this.setBitmexKeys(res[0][1], res[1][1]);
        }
      }
    );
  }
  componentWillUnmount() {
    pairs.forEach(sub => sub.unsubscribe());
  }

  setBitmexKeys = async (bitmexKey, bitmexSecret) => {
    await AsyncStorage.multiSet([
      [BITMEX_API_KEY, bitmexKey],
      [BITMEX_API_SECRET, bitmexSecret],
    ]);
    this.setState({
      bitmexKey,
      bitmexSecret,
      loggedOut: false,
      loading: false,
    });
  };
  logOut = async () => {
    await AsyncStorage.multiRemove([BITMEX_API_KEY, BITMEX_API_SECRET]);
    this.setState({ bitmexKey: '', bitmexSecret: '', loggedOut: true });
  };

  currencySelector = () => {
    const options = ['Cancel', 'USD', 'EUR', 'GBP'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'Select your currency',
        options,
        cancelButtonIndex: 0,
      },
      index => {
        switch (index) {
          case 0:
            break;
          default:
            this.setState({ currency: options[index] });
            break;
        }
      }
    );
  };

  render() {
    const {
      loggedOut,
      bitmexKey,
      bitmexSecret,
      loading,
      priceBTCUSD,
      priceBTCEUR,
      priceBTCGBP,
      currency,
    } = this.state;
    if (loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    let price = 0;
    let sign = '';
    switch (currency) {
      case 'USD':
        price = priceBTCUSD;
        sign = '$';
        break;
      case 'EUR':
        price = priceBTCEUR;
        sign = '€';
        break;
      default:
        price = priceBTCGBP;
        sign = '£';
        break;
    }
    return (
      <View style={styles.container}>
        <Login visible={loggedOut} submit={this.setBitmexKeys} />
        <View style={styles.padding2}>
          <Button title="Logout" color="#fff" onPress={this.logOut} />
        </View>
        <Ticker
          style={styles.padding}
          sign={sign}
          price={price}
          selector={this.currencySelector}
          bitmexKey={bitmexKey}
          bitmexSecret={bitmexSecret}
        />
        <TickerList
          style={styles.padding}
          data={[
            { key: 'BTC-USD', sign: '$', price: priceBTCUSD },
            { key: 'BTC-EUR', sign: '€', price: priceBTCEUR },
            { key: 'BTC-GBP', sign: '£', price: priceBTCGBP },
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#254C8C',
    alignItems: 'center',
  },
  padding: {
    flex: 1,
    marginBottom: 100,
  },
  padding2: {
    flex: 1,
    marginTop: 50,
  },
});
