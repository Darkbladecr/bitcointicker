// import crypto from 'crypto';
import axios from 'axios';
import cryptoJS from 'crypto-js';

const requestWallet = (apiKey, apiSecret) => {
  const verb = 'GET',
    path = '/api/v1/user/walletSummary?currency=XBt',
    expires = Math.round(new Date().getTime() / 1000) + 60, // 1 min in the future
    data = { currency: 'XBt' };

  const postBody = JSON.stringify(data);
  const message = verb + path + expires + postBody;
  const signature = cryptoJS
    .HmacSHA256(message, apiSecret)
    .toString(cryptoJS.enc.Hex);

  const headers = {
    'content-type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'api-expires': expires,
    'api-key': apiKey,
    'api-signature': signature,
  };

  const requestOptions = {
    headers,
    url: 'https://www.bitmex.com' + path,
    method: verb,
    data: postBody,
  };
  return axios(requestOptions);
};

const getWallet = async (apiKey, apiSecret) => {
  try {
    const res = await requestWallet(apiKey, apiSecret);
    let total = {
      account: 0,
      currency: 'XBt',
      transactType: 'Total',
      symbol: '',
      amount: 0,
      pendingDebit: 0,
      realisedPnl: 0,
      walletBalance: 0,
      unrealisedPnl: 0,
      marginBalance: 0,
    };
    for (const i = res.data.length - 1; i > 0; i--) {
      if (
        res.data[i] &&
        res.data[i].hasOwnProperty('transactType') &&
        res.data[i].transactType == 'Total'
      ) {
        total = res.data[i];
        break;
      }
    }
    return total;
  } catch (err) {
    throw err;
  }
};

export { getWallet };
