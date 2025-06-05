import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import React, { useEffect, useRef } from "react";

// Register required Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const RealTimeChart = ({ data, labels, title }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Initialize or update chart
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels || data.map((_, i) => `Point ${i + 1}`),
        datasets: [
          {
            label: title || "Real-Time Data",
            data: data,
            borderColor: "#4CAF50", // Green line
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            borderWidth: 2,
            tension: 0.1,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: false },
        },
        plugins: {
          legend: { display: !!title }, // Hide if no title
          tooltip: { mode: "index" },
        },
        animation: {
          duration: 0, // Disable animations for real-time
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, labels, title]);

  return (
    <div style={{ position: "relative", height: "400px", width: "100%" }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default RealTimeChart;
