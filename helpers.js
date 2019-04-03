function numberWithCommas(x) {
  return Number.parseFloat(x)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export { numberWithCommas };
