import React from "react";
import Plot from "react-plotly.js";
import useDataFetcher from "./useDataFetcher";

interface RealTimeChartProps {
  endpoint: string; // WebSocket or HTTP endpoint
  chartType: string; // Chart type: "2D Line", "2D Bar", etc.
  xField: string; // Field for x-axis
  yField: string; // Field for y-axis
  zField?: string; // Optional field for z-axis (3D)
  pollingInterval?: number; // Optional: for HTTP polling (ms)
  maxDataPoints?: number; // Optional: limit for max data points
}

const RealTimeChart: React.FC<RealTimeChartProps> = ({
  endpoint,
  chartType,
  xField,
  yField,
  zField,
  pollingInterval = 5000, // Default polling interval (for HTTP)
  maxDataPoints = 1000, // Default limit for data points
}) => {
  const { data, errorMessage } = useDataFetcher({
    endpoint,
    xField,
    yField,
    zField,
    pollingInterval,
    maxDataPoints,
  });

  const renderPlot = () => {
    switch (chartType) {
      case "2D Line":
        return (
          <Plot
            data={[
              {
                x: data.x,
                y: data.y,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#E07A5F" },
              },
            ]}
            layout={{
              title: "2D Line Chart",
              xaxis: { title: xField },
              yaxis: { title: yField },
            }}
          />
        );

      case "2D Bar":
        return (
          <Plot
            data={[
              {
                x: data.x,
                y: data.y,
                type: "bar",
                marker: { color: "#81B29A" },
              },
            ]}
            layout={{
              title: "2D Bar Chart",
              xaxis: { title: xField },
              yaxis: { title: yField },
            }}
          />
        );

      case "3D Scatter":
        return (
          <Plot
            data={[
              {
                x: data.x,
                y: data.y,
                z: data.z,
                type: "scatter3d",
                mode: "markers",
                marker: { size: 5, color: "#4ECDC4" },
              },
            ]}
            layout={{
              title: "3D Scatter Plot",
              scene: {
                xaxis: { title: xField },
                yaxis: { title: yField },
                zaxis: { title: zField },
              },
            }}
          />
        );

      case "Heatmap":
        return (
          <Plot
            data={[
              {
                z: [data.y],
                x: data.x,
                type: "heatmap",
                colorscale: "Viridis",
              },
            ]}
            layout={{
              title: "Heatmap",
              xaxis: { title: xField },
              yaxis: { title: yField },
            }}
          />
        );

      default:
        return <p>Invalid chart type selected.</p>;
    }
  };

  return (
    <div>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {renderPlot()}
    </div>
  );
};

export default RealTimeChart;
