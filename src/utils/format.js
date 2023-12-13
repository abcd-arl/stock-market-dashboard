export const formatMarketCap = (marketCap) => {
  if (marketCap < 1) return marketCap.toFixed(3) + "K";
  if (marketCap < 1000) return marketCap.toFixed(3) + "M";
  if (marketCap < 1000000) return (marketCap / 1000).toFixed(3) + "B";
  if (marketCap < 1000000000) return (marketCap / 1000000).toFixed(3) + "T";
};

export const formatPhoneNumber = (phoneNumber) => {
  if (phoneNumber.length === 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6,
    )}-${phoneNumber.slice(6)}`;
  }
  return phoneNumber;
};
