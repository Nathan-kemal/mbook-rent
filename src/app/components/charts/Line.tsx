"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const lineChartData = {
  labels: ["May", "June", "Jul", "Aug", "Sep", "Oct"],
  datasets: [
    {
      label: "Last 6 Month",
      data: [300000, 20000, 400000, 30000, 2000, 600000],
      borderColor: "rgb(75,192,192)",
      tension: 0.4,
    },

    {
      label: "Same periiod last year",
      data: [70000, 10000, 200000, 30000, 20000, 30000],
      borderColor: "rgb(73,73,225)",
      backgroundColor: "rgb(73,73,225)",
      tension: 0.4,
    },
  ],
};
const LineGraph = () => {
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        align: "end",
        labels: {
          usePointStyle: true,
        },
      },
      datalabels: {
        display: false, // Hide labels inside the chart
      },
    },
  };

  return <Line options={options} data={lineChartData} />;
};

export default LineGraph;
