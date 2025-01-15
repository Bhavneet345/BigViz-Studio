import { useEffect, useState } from "react";

interface UseDataFetcherProps {
  endpoint: string;
  xField: string;
  yField: string;
  zField?: string;
  pollingInterval: number;
  maxDataPoints: number;
}

const useDataFetcher = ({
  endpoint,
  xField,
  yField,
  zField,
  pollingInterval,
  maxDataPoints,
}: UseDataFetcherProps) => {
  const [data, setData] = useState<{ x: string[]; y: number[]; z?: number[] }>({
    x: [],
    y: [],
    z: [],
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (endpoint.startsWith("ws://") || endpoint.startsWith("wss://")) {
      const ws = new WebSocket(endpoint);

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);

          if (!parsedData[xField] || !parsedData[yField] || (zField && !parsedData[zField])) {
            setErrorMessage("Incoming data does not match the expected fields.");
            return;
          }

          setData((prevData) => ({
            x: [...prevData.x, parsedData[xField]].slice(-maxDataPoints),
            y: [...prevData.y, parsedData[yField]].slice(-maxDataPoints),
            z: zField
              ? [...(prevData.z || []), parsedData[zField]].slice(-maxDataPoints)
              : prevData.z,
          }));

          setErrorMessage("");
        } catch (err) {
          setErrorMessage("Invalid data format from WebSocket.");
        }
      };

      ws.onerror = () => setErrorMessage("WebSocket connection error.");
      ws.onclose = () => console.log("WebSocket connection closed.");

      return () => {
        ws.close();
      };
    } else if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      const fetchData = async () => {
        try {
          const response = await fetch(endpoint);
          const parsedData = await response.json();

          if (!parsedData[xField] || !parsedData[yField] || (zField && !parsedData[zField])) {
            setErrorMessage("Incoming data does not match the expected fields.");
            return;
          }

          setData((prevData) => ({
            x: [...prevData.x, parsedData[xField]].slice(-maxDataPoints),
            y: [...prevData.y, parsedData[yField]].slice(-maxDataPoints),
            z: zField
              ? [...(prevData.z || []), parsedData[zField]].slice(-maxDataPoints)
              : prevData.z,
          }));

          setErrorMessage("");
        } catch (err) {
          setErrorMessage("Failed to fetch data from HTTP endpoint.");
        }
      };

      const interval = setInterval(fetchData, pollingInterval);
      fetchData();

      return () => {
        clearInterval(interval);
      };
    } else {
      setErrorMessage("Invalid endpoint. Use ws://, wss://, http://, or https://.");
    }
  }, [endpoint, xField, yField, zField, pollingInterval, maxDataPoints]);

  return { data, errorMessage };
};

export default useDataFetcher;
