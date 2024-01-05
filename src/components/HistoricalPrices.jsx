import { useState, useEffect } from "react";
import { useLazyGetDailyHistoricalDataQuery } from "../redux/alphavantage";
import LineChart from "./LineChart";
import RelatedTickersByIndustry from "../components/RelatedTickersByIndustry";
import ts1 from "../data/historicalData1";
import ts2 from "../data/historicalData2";

export default function HistoricalPrices({ symbol }) {
  return (
    <>
      <LineChart symbol={symbol} />
      <RelatedTickersByIndustry symbol={symbol} />
    </>
  );
}
