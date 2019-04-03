import { webSocket } from 'rxjs/webSocket';
import {
  map,
  filter,
  throttleTime,
  distinctUntilChanged,
} from 'rxjs/operators';

const symbols = ['BTC', 'ETH', 'LTC', 'BCH'];
const pairs = [];
symbols.forEach(x => {
  pairs.push(`${x}-USD`, `${x}-EUR`, `${x}-GBP`);
});

const req = {
  type: 'subscribe',
  product_ids: pairs,
  channels: [
    // 'level2',
    // 'heartbeat',
    'ticker',
  ],
};

const subject = webSocket('wss://ws-feed.pro.coinbase.com');
subject.next(req);

const errors = subject.pipe(filter(x => x.type === 'error'));
const quotes = subject.pipe(
  filter(x => x.type === 'ticker' && x.hasOwnProperty('price'))
);

const parseMsg = [
  throttleTime(500),
  map(x => parseFloat(x.price).toFixed(1)),
  distinctUntilChanged(),
];

const $pairs = {};

pairs.forEach(pair => {
  $pairs[pair] = quotes.pipe(
    filter(x => x.product_id === pair),
    ...parseMsg
  );
});

errors.subscribe(msg => console.log(msg), err => console.error(err));

export default $pairs;
