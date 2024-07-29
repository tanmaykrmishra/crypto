import React, { useEffect, useState } from "react";
import Chart from "react-google-charts";

function LineChart({ historicalData }) {
  const [data, setData] = useState([["Date", "Prices"]]);

  useEffect(() => {
    if (historicalData?.prices) {
      // Map over the historicalData.prices array to transform data
      const formattedData = historicalData.prices.map((item) => [
        new Date(item[0]).toLocaleDateString().slice(0, -5), // Format date
        item[1], // Price
      ]);

      // Prepend header row to formattedData
      setData([["Date", "Prices"], ...formattedData]);
    }
  }, [historicalData]);

  return (
    <Chart
      chartType="LineChart"
      data={data}
      legendToggle
    />
  );
}

export default LineChart;
