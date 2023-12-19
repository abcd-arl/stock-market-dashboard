import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  TimeSeriesScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "react-chartjs-2";
import { response } from "../data/historicalData";
import SkeletonLoading from "./skeletonLoading";
import { useGetDailyHistoricalDataQuery } from "../redux/alphavantage";
import Error from "../pages/error";

ChartJS.register(
  TimeSeriesScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function LineChart({ symbol }) {
  // const {
  //   data: response,
  //   isLoading,
  //   isFetching,
  //   isError,
  //   error,
  // } = useGetDailyHistoricalDataQuery(symbol);

  const [numOfMonths, setNumOfMonths] = useState(6);

  if (response?.Information) {
    return <div className="h-[300px] w-full">Error</div>;
  }

  useEffect(() => {
    setNumOfMonths(6);
  }, [symbol]);

  const isLoading = false;
  const isFetching = false;
  if (isLoading || isFetching) {
    return (
      <div className="w-full rounded-md">
        <div className="flex justify-end gap-2 pb-4 text-sm">
          {Array(7)
            .fill()
            .map((_, index) => (
              <SkeletonLoading key={index} className="h-2 w-10" />
            ))}
        </div>
        <div className="h-[300px] w-full">
          <SkeletonLoading className="h-full w-full" />
        </div>
      </div>
    );
  }

  const prices = getClosePricesLastMonths(response, numOfMonths);
  const isIncreasing =
    parseFloat(prices[Object.keys(prices)[0]]) >=
    parseFloat(prices[Object.keys(prices)[Object.keys(prices).length - 1]]);

  const color = isIncreasing ? "22, 163, 74" : "239, 68, 68";

  function getClosePricesLastMonths(response, months) {
    const filtered = {};

    if (months === "all") {
      for (const key in response["Time Series (Daily)"]) {
        filtered[key] = response["Time Series (Daily)"][key]["4. close"];
      }
      return filtered;
    }

    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - months);

    for (const key in response["Time Series (Daily)"]) {
      const date = new Date(key);
      if (date >= fromDate && date <= toDate) {
        filtered[key] = response["Time Series (Daily)"][key]["4. close"];
      }
    }
    return filtered;
  }

  const data = {
    labels: Object.keys(prices),
    datasets: [
      {
        label: "Close Price",
        data: prices,
        fill: true,
        borderColor: `rgb(${color})`,
        backgroundColor: ({ chart: { ctx } }) => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, `rgba(${color}, 0.4)`); // Darker color at the top
          gradient.addColorStop(0.25, `rgba(${color}, 0.15)`);
          gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.15)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 1)"); // White color at the bottom
          return gradient;
        },
        tension: 0.1,
        radius: 0,
        borderWidth: 1.5,
      },
    ],
  };

  const unit =
    numOfMonths == 1
      ? "day"
      : numOfMonths == 6
        ? "week"
        : numOfMonths == 12
          ? "month"
          : "year";
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "timeseries",
        time: {
          unit,
          displayFormats: {
            day: "MMM dd",
            week: "MMM dd",
            month: "MMM",
            year: "yyyy",
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit:
            numOfMonths == 60
              ? 6
              : numOfMonths === "all"
                ? Object.keys(prices).length / 365
                : 10,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        ticks: {
          maxTicksLimit: 8,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: function (context) {
            return new Date(context[0].label.slice(0, -4)).toLocaleDateString(
              undefined,
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            );
          },
        },
        displayColors: false,
        backgroundColor: "rgba(249, 250, 251, 0.9)",
        borderWidth: 0.5,
        borderColor: "rgba(63, 63, 70, 0.5)",
        bodyColor: "rgb(63, 63, 70)",
        titleFont: { weight: "normal" },
        titleColor: "rgb(63, 63, 70)",
        yAlign: "center",
      },
    },
  };

  const optionNumOfMonths = {
    1: "1M",
    6: "6M",
    12: "1Y",
    60: "5Y",
    all: "MAX",
  };

  return (
    <div className="w-full rounded-md">
      <div className="flex justify-end gap-2 text-sm">
        <button
          disabled
          className="cursor-not-allowed px-3 py-1 text-xs text-gray-400"
        >
          1D
        </button>
        <button
          disabled
          className="cursor-not-allowed px-3 py-1 text-xs text-gray-400"
        >
          5D
        </button>
        {Object.keys(optionNumOfMonths).map((month) => (
          <button
            key={month}
            className={`${
              month == numOfMonths
                ? "-mb-0.5 border-b-2 border-zinc-500"
                : "rounded hover:bg-gray-100"
            } px-3 py-1 text-xs`}
            onClick={() => setNumOfMonths(month)}
          >
            {optionNumOfMonths[month]}
          </button>
        ))}
      </div>
      <div className="h-[300px] w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
