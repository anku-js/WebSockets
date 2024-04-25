import "./SearchedCrypto.css";
import { MdAddBox } from "react-icons/md";

export default function SearchedCrypto({
  filteredCrypto,
  setCanListbeClosed,
  handleAddCrypto,
}) {
  return (
    <div
      className="popularCrypto-list-wrapper"
      onMouseEnter={() => setCanListbeClosed(false)}
      onMouseLeave={() => setCanListbeClosed(true)}
    >
      {filteredCrypto?.map(({ symbol, lastPrice }) => (
        <div className="popularCrypto-list" key={symbol}>
          <div className="crypto-name">
            <p className="crypto-abbreviation">{symbol}</p>
          </div>
          <div className="crypto-price-wrapper">
            <p className="crypto-price">{lastPrice}</p>
            <div
              onClick={() => {
                handleAddCrypto(symbol);
              }}
            >
              <MdAddBox className="add-icon" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
