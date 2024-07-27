import { createContext, useCallback, useEffect, useState } from "react";

// Create a context with default value
export const CoinContext = createContext();

// Create a provider component
const CoinContextProvider = ({ children }) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({ name: "usd", symbol: "$" });

  const fetchAllCoin = useCallback(async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-qHkZfCWy9FBTV9GjsX3oxKXf",
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
        options
      );
      const data = await response.json();
      setAllCoin(data);
    } catch (err) {
      console.error(err);
    }
  }, [currency.name]); // Include currency.name in dependencies

  useEffect(() => {
    fetchAllCoin();
  }, [fetchAllCoin]); // Include fetchAllCoin in dependencies

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
  };
  return (
    <CoinContext.Provider value={contextValue}>{children}</CoinContext.Provider>
  );
};

export default CoinContextProvider;
