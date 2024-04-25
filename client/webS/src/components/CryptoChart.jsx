import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { CategoryScale } from "chart.js";
ChartJS.register(CategoryScale);

export default function CryptoChart({ symbol, cryptoData }) {
  const currentPrice = cryptoData?.[cryptoData.length - 1]?.price;

  const value = cryptoData?.map((data) => data.price);
  const time = cryptoData?.map((data) => data.timestamp);
  const chartData = {
    labels: time,
    datasets: [
      {
        label: "",
        data: value,
        fill: true,
        backgroundColor: "#2e4659",
        borderColor: "#388680",
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="chart-container">
      {/* <h3>{symbol} - Current Price: {currentPrice}</h3> */}
      <Line
        data={chartData}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
              position: "bottom",
            },
            tooltip: {
              usePointStyle: false,
            },
          },
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
        }}
      />
    </div>
  );
}
