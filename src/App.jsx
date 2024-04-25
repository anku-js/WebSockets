import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import CryptoChart from "./components/CryptoChart";
import { debounce } from "lodash";
import "./App.css";

const BinanceTradeUpdates = () => {
  const [cryptoList, setCryptoList] = useState([
    "btcusdt",
    "ethusdt",
    "xrpusdt",
    "ltcusdt",
    "bnbusdt",
  ]);

  const [cryptoData, setCryptoData] = useState({
    btcusdt: [],
    ethusdt: [],
    xrpusdt: [],
    ltcusdt: [],
    bnbusdt: [],
  });

  const [searchValue, setSearchValue] = useState("");
  const [filteredCrypto, setFilteredCrypto] = useState([]);

  const handleAddCrypto = (newCrypto) => {
    const newCryptoToBeAdded = newCrypto.toLowerCase();
    setCryptoList((prevList) => {
      const newList = [...prevList];
      if (newList.length >= 5) {
        newList.shift(); 
      }
      newList.push(newCryptoToBeAdded); 
      setCryptoData((prevData) => ({
        ...prevData,
        [newCryptoToBeAdded]: [],
      }));
      return newList;
    });
  };

  const debouncedSearchBinance = debounce(async (query) => {
    try {
      const response = await fetch(
        "https://api.binance.com/api/v3/ticker/24hr"
      );
      const data = await response.json();
      const filteredData = data.filter((item) =>
        item.symbol.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCrypto(filteredData);
    } catch (error) {
      console.error("Error fetching data from Binance API:", error);
    }
  }, 300);

  useEffect(() => {
    debouncedSearchBinance(searchValue);
    return () => debouncedSearchBinance.cancel();
  }, [searchValue, debouncedSearchBinance]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws");

    ws.onopen = () => {
      console.log("WebSocket connected");
      cryptoList.forEach((symbol) => {
        ws.send(
          JSON.stringify({ method: "SUBSCRIBE", params: [`${symbol}@trade`] })
        );
      });
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.e === "trade") {
        const {
          s: symbol,
          p: price,
          q: quantity,
          T: timestamp,
          t: tradeId,
        } = message;
        const trade = {
          symbol: symbol.toLowerCase(),
          price: parseFloat(price),
          quantity: parseFloat(quantity),
          timestamp: new Date(timestamp),
          tradeId,
        };

        setCryptoData((prevData) => {
          const updatedData = { ...prevData };
          updatedData[trade.symbol].push(trade);
          if (updatedData[trade.symbol].length > 50) {
            updatedData[trade.symbol].shift();
          }
          return updatedData;
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [cryptoList]);

  return (
    <div className="app">
      <Navbar
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        filteredCrypto={filteredCrypto}
        handleAddCrypto={handleAddCrypto}
      />
      <div className="cryptos">
        {cryptoList.map((crypto) => (
          <div className="crypto-container" key={crypto}>
            <div className="crypto-info">
              <p className="crypto-type">{crypto.toUpperCase()}</p>
              <div className="crypto-value">
                <h1>
                  {cryptoData[crypto]?.[cryptoData[crypto]?.length - 1]
                    ?.price ||
                    cryptoData[crypto]?.[cryptoData[crypto]?.length - 1]
                      ?.lastPrice}
                </h1>
              </div>
            </div>
            <CryptoChart
              key={crypto}
              symbol={crypto}
              cryptoData={cryptoData[crypto]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinanceTradeUpdates;
