import React, { useCallback, useContext, useEffect, useState } from "react";
import "./Coin.css";
import { useParams } from "react-router-dom";
import { CoinContext } from "../../context/CoinContext";
import LineChart from "../../components/LineChart/LineChart";

function Coin() {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null); // Use null to explicitly indicate no data
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const { currency } = useContext(CoinContext);

  // Define fetchCoinData with async/await
  const fetchCoinData = useCallback(async () => {
    setLoading(true); // Set loading to true when starting fetch
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-qHkZfCWy9FBTV9GjsX3oxKXf",
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}`,
        options
      );
      const data = await response.json();
      setCoinData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false when done
    }
  }, [coinId]);

  const fetchHistoricalData = useCallback( async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-qHkZfCWy9FBTV9GjsX3oxKXf",
      },
    };

    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name}&days=10&interval=daily`,
      options
    )
      .then((response) => response.json())
      .then((response) => setHistoricalData(response))
      .catch((err) => console.error(err));
  },[coinId, currency.name])

  useEffect(() => {
    fetchCoinData();
    fetchHistoricalData();
  }, [fetchCoinData, currency,fetchHistoricalData]); // Ensure currency is included if it affects the fetch

  // Show a spinner while loading
  if (loading) {
    return (
      <div className="spinner">
        <div className="spin"></div>
      </div>
    );
  }

  // Render coin data when it's available
  if (coinData && historicalData) {
    return (
      <div className="coin">
        <div className="coin-name">
          <img src={coinData.image.large} alt={coinData.name} />
          <p>
            <b>
              {coinData.name} ({coinData.symbol.toUpperCase()})
            </b>
          </p>
        </div>
        <div className="coin-chart">
          <LineChart historicalData={historicalData} />
        </div>
        <div className="coin-info">
          <ul>
            <li>Crypto Market Rank</li>
            <li>{coinData.market_cap_rank}</li>
          </ul>
          <ul>
            <li>Current Price</li>
            <li>
              {currency.symbol}
              {coinData.market_data.current_price[
                currency.name
              ].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>Market Cap</li>
            <li>
              {currency.symbol}
              {coinData.market_data.market_cap[currency.name].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>24 Hour High</li>
            <li>
              {currency.symbol}
              {coinData.market_data.high_24h[currency.name].toLocaleString()}
            </li>
          </ul>
          <ul>
            <li>24 Hour Low</li>
            <li>
              {currency.symbol}
              {coinData.market_data.low_24h[currency.name].toLocaleString()}
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Handle the case where no data is available (optional)
  return <p>No data available</p>;
}

export default Coin;
