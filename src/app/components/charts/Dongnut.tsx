"use client";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const DoughnutChart = ({ data }: { data: any }) => {
  const lineChartData = {
    labels: ["Fiction", "Self Help", "Business"],
    datasets: [
      {
        data: [data.FICTION, data.SELFHELP, data.BUSINESS],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        cutout: 35,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, index) => {
              const value = data.datasets[0].data[index];
              const color = data.datasets[0].backgroundColor[index];
              return {
                text: `${label}: ${value}`,
                fillStyle: color,
                hidden: false,
                lineWidth: 0,
              };
            });
          },
        },
      },
      datalabels: {
        display: false, // Hide labels inside the chart
      },
    },
  };

  return <Doughnut options={options} data={lineChartData} />;
};

export default DoughnutChart;
