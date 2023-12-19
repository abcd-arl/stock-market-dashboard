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

export const formatDatetime = (datetime) => {
  const now = new Date();
  const date = new Date(datetime * 1000);
  const diff = now - date;
  const diffMinutes = Math.floor(diff / 60000);
  const diffHours = Math.floor(diff / 3600000);
  const diffDays = Math.floor(diff / 86400000);
  const diffMonths = Math.floor(diff / 2592000000);

  if (diffMinutes < 60)
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  if (diffHours < 24)
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  if (diffDays < 30)
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  if (diffMonths < 12)
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`;
  return date.toLocaleString();
};
