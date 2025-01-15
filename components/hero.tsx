import { useState, ChangeEvent } from "react";
import * as Papa from "papaparse";
import Plot from "react-plotly.js";
import RealTimeChart from "./RealTimeChart";

export default function Hero() {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [chartType, setChartType] = useState("2D Line");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [enableRealTime, setEnableRealTime] = useState(false);
  const [webSocketUrl, setWebSocketUrl] = useState("ws://localhost:8080");
  const [xField, setXField] = useState("timestamp");
  const [yField, setYField] = useState("value");
  const [zField, setZField] = useState("");

  // Handle CSV file upload and parsing
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
          setFilteredData(results.data);
        },
        error: (err) => {
          console.error("Error parsing file:", err);
        },
      });
    }
  };

  // Handle column selection
  const handleColumnSelection = (col: string) => {
    setSelectedColumns((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  // Handle column-based filtering
  const handleFilterChange = (column: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));

    const newFilteredData = csvData.filter((row) =>
      Object.entries({ ...filters, [column]: value }).every(
        ([key, val]) =>
          !val || row[key]?.toString().toLowerCase().includes(val.toLowerCase())
      )
    );

    setFilteredData(newFilteredData);
  };

  // Render filters for CSV data
  const renderFilters = () => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {Object.keys(csvData[0] || {}).map((col) => (
          <div key={col} className="flex flex-col items-center">
            <label htmlFor={col} className="text-sm font-medium text-gray-700">
              {col}
            </label>
            <input
              id={col}
              type="text"
              placeholder={`Filter ${col}`}
              value={filters[col] || ""}
              onChange={(e) => handleFilterChange(col, e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        ))}
      </div>
    );
  };

  // Render Plotly charts for CSV data
  const renderPlot = () => {
    if (filteredData.length === 0 || selectedColumns.length === 0) {
      return <p>Please select columns to visualize the data.</p>;
    }

    const data = selectedColumns.map((col) =>
      filteredData.map((row) => parseFloat(row[col]))
    );

    switch (chartType) {
      case "2D Line":
        if (selectedColumns.length !== 2) {
          return <p>Please select exactly 2 columns for a 2D Line Chart.</p>;
        }
        return (
          <Plot
            data={[
              {
                x: data[0],
                y: data[1],
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#E07A5F" },
              },
            ]}
            layout={{
              title: "2D Line Chart",
              xaxis: { title: selectedColumns[0] },
              yaxis: { title: selectedColumns[1] },
            }}
          />
        );
      case "2D Bar":
        if (selectedColumns.length !== 2) {
          return <p>Please select exactly 2 columns for a 2D Bar Chart.</p>;
        }
        return (
          <Plot
            data={[
              {
                x: data[0],
                y: data[1],
                type: "bar",
                marker: { color: "#81B29A" },
              },
            ]}
            layout={{
              title: "2D Bar Chart",
              xaxis: { title: selectedColumns[0] },
              yaxis: { title: selectedColumns[1] },
            }}
          />
        );
      case "3D Scatter":
        if (selectedColumns.length < 3) {
          return <p>Please select at least 3 columns for a 3D Scatter Plot.</p>;
        }
        return (
          <Plot
            data={[
              {
                x: data[0],
                y: data[1],
                z: data[2],
                type: "scatter3d",
                mode: "markers",
                marker: { size: 5, color: "#4ECDC4" },
              },
            ]}
            layout={{
              title: "3D Scatter Plot",
              scene: {
                xaxis: { title: selectedColumns[0] },
                yaxis: { title: selectedColumns[1] },
                zaxis: { title: selectedColumns[2] },
              },
            }}
          />
        );
      case "Heatmap":
        return (
          <Plot
            data={[
              {
                z: selectedColumns.map((col) =>
                  filteredData.map((row) => parseFloat(row[col]))
                ),
                x: selectedColumns,
                y: selectedColumns,
                type: "heatmap",
                colorscale: "Viridis",
              },
            ]}
            layout={{
              title: "Heatmap",
              xaxis: { title: "Columns" },
              yaxis: { title: "Columns" },
            }}
          />
        );
      default:
        return <p>Invalid chart type selected.</p>;
    }
  };

  return (
    <section className="bg-gradient-to-b from-primary/10 to-background py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4 text-foreground">
          Visualize Big Data with Ease
        </h1>
        <p className="text-xl mb-8 text-muted-foreground">
          Transform complex datasets into stunning, interactive visualizations
        </p>
        <div className="mb-4">
          <button
            onClick={() => setEnableRealTime(false)}
            className={`px-4 py-2 rounded ${
              !enableRealTime
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            File-Based Visualization
          </button>
          <button
            onClick={() => setEnableRealTime(true)}
            className={`ml-2 px-4 py-2 rounded ${
              enableRealTime
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            Real-Time Visualization
          </button>
        </div>
        {!enableRealTime ? (
          <>
            <input
              type="file"
              onChange={handleFileChange}
              className="ml-5 mb-4 border px-4 py-2 rounded"
            />
            <button
              onClick={handleFileUpload}
              className="ml-10 bg-primary text-primary-foreground px-6 py-3 rounded hover:bg-primary/90 mb-4"
            >
              Upload and Parse File
            </button>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="block mx-auto border px-4 py-2 rounded mb-4"
            >
              <option value="2D Line">2D Line Chart</option>
              <option value="2D Bar">2D Bar Chart</option>
              <option value="3D Scatter">3D Scatter Plot</option>
              <option value="Heatmap">Heatmap</option>
            </select>
            {csvData.length > 0 && renderFilters()}
            {csvData.length > 0 && (
              <div className="mb-4">
                <h2 className="mb-0 text-sm">Select Dimensions:</h2>
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.keys(csvData[0]).map((col) => (
                    <button
                      key={col}
                      onClick={() => handleColumnSelection(col)}
                      className={`px-4 py-2 rounded border ${
                        selectedColumns.includes(col)
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="h-auto w-full mx-auto">{csvData.length > 0 && renderPlot()}</div>
          </>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Enter WebSocket URL"
              value={webSocketUrl}
              onChange={(e) => setWebSocketUrl(e.target.value)}
              className="block border px-4 py-2 rounded mb-4 mx-auto"
            />
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="block border px-4 py-2 rounded mb-4 mx-auto"
            >
              <option value="2D Line">2D Line Chart</option>
              <option value="2D Bar">2D Bar Chart</option>
              <option value="3D Scatter">3D Scatter Plot</option>
              <option value="Heatmap">Heatmap</option>
            </select>
            <RealTimeChart
              endpoint={webSocketUrl}
              chartType={chartType}
              xField={xField}
              yField={yField}
              zField={chartType === "3D Scatter" ? zField : undefined}
            />
          </div>
        )}
      </div>
    </section>
  );
}
