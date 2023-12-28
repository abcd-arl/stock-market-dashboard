export default function updatePrices(
  currentSymbol,
  currLastPrice,
  currHighPrice,
  currLowPrice,
  trades,
) {
  const filteredTrades = trades
    .filter((data) => data.s === currentSymbol)
    .sort((a, b) => a.t - b.t);
  const lastPriceIsNull = currLastPrice === null;

  let newLastPrice;
  let newHighPrice;
  let newLowPrice;

  filteredTrades.forEach((trade) => {
    const { p: lastPrice, c: code } = trade;
    newLastPrice = shouldUpdateLastPrice(lastPriceIsNull, code)
      ? lastPrice
      : currLastPrice;
    newHighPrice =
      currHighPrice < lastPrice && shouldUpdateHighLowPrice(code)
        ? lastPrice
        : currHighPrice;
    newLowPrice =
      currLowPrice > lastPrice && shouldUpdateHighLowPrice(code)
        ? lastPrice
        : currLowPrice;
  });

  return { newLastPrice, newHighPrice, newLowPrice };
}

function shouldUpdateLastPrice(lastPriceIsNull, code) {
  const updateLastPriceCodes = [
    1, 2, 4, 6, 7, 8, 13, 14, 15, 16, 19, 23, 28, 29, 33, 35,
  ];
  return (
    updateLastPriceCodes.includes(parseInt(code)) ||
    (lastPriceIsNull && parseInt(code) === 9)
  );
}

function shouldUpdateHighLowPrice(code) {
  const updateHighLowPriceCodes = [
    1, 2, 4, 6, 7, 8, 9, 13, 14, 15, 16, 18, 19, 21, 23, 28, 29, 30, 32, 33, 35,
  ];
  return updateHighLowPriceCodes.includes(parseInt(code));
}
