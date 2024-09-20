
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Coincap() {
  const [cryptos, setCryptos] = useState([]);
  const [visibleCryptos, setVisibleCryptos] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCryptos();
  }, []);

  const fetchCryptos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.coincap.io/v2/assets');
      setCryptos(response.data.data);
      setVisibleCryptos(response.data.data.slice(0, pageSize));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cryptocurrencies:', err);
      setError('Failed to fetch cryptocurrency data.');
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    const start = page * pageSize;
    const end = start + pageSize;
    setVisibleCryptos([...visibleCryptos, ...cryptos.slice(start, end)]);
    setPage(nextPage);
  };

  const formatNumber = (number, decimals = 2) => {
    return parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <h1>CoinCap Clone</h1>
      </header>

      {/* Main Content */}
      <main>
        {loading ? (
          <p className="status-message">Loading cryptocurrencies...</p>
        ) : error ? (
          <p className="status-message error">{error}</p>
        ) : (
          <>
            {/* Cryptocurrency Table */}
            <table className="crypto-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Price (USD)</th>
                  <th>Market Cap</th>
                  <th>Change (24h)</th>
                </tr>
              </thead>
              <tbody>
                {visibleCryptos.map((crypto, index) => {
                  const {
                    rank,
                    name,
                    symbol,
                    priceUsd,
                    marketCapUsd,
                    changePercent24Hr,
                  } = crypto;

                  const iconUrl = `https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`;

                  return (
                    <tr key={crypto.id}>
                      <td>{rank}</td>
                      <td>
                        <img
                          src={iconUrl}
                          alt={`${symbol} icon`}
                          width="24"
                          height="24"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/24';
                          }}
                        />
                      </td>
                      <td>{name}</td>
                      <td>{symbol}</td>
                      <td>${formatNumber(priceUsd)}</td>
                      <td>${formatNumber(marketCapUsd, 0)}</td>
                      <td
                        className={
                          parseFloat(changePercent24Hr) >= 0
                            ? 'positive'
                            : 'negative'
                        }
                      >
                        {parseFloat(changePercent24Hr).toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Load More Button */}
            {visibleCryptos.length < cryptos.length && (
              <button className="load-more" onClick={loadMore}>
                Load More
              </button>
            )}
          </>
        )}
      </main>

      {/* Footer (Optional) */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} CoinCap Clone. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Coincap;
