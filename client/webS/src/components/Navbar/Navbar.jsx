import "./Navbar.css";
import { useState } from "react";
import { BsSearch } from "react-icons/bs";
import SearchedCrypto from "../SearchedCrypto/SearchedCrypto";

export default function Navbar({
  setSearchValue,
  filteredCrypto,
  handleAddCrypto,
}) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [canListbeClosed, setCanListbeClosed] = useState(true);

  const handleOnFocus = () => {
    setIsInputFocused(true);
  };

  function handleBlur() {
    if (canListbeClosed) {
      setIsInputFocused(false);
    }
  }

  const handleChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
  };

  return (
    <nav className="navbar-container">
      <p className="navbar-text">Crypto Watch</p>
      <div className="navbar-right">
        <div className="search-wrapper">
          <label
            className="search-bar-label"
            style={{
              border: isInputFocused ? "transparent 1px solid" : "",
              borderRadius: isInputFocused ? "30px 30px 0px 0px" : "30px",
            }}
          >
            <BsSearch className="search-icon" />
            <input
              type="search"
              className="search-bar-input"
              name="searchStocks"
              placeholder="Search Your Crypto"
              onBlur={handleBlur}
              onFocus={handleOnFocus}
              onChange={handleChange}
            />
          </label>
          {isInputFocused && (
            <SearchedCrypto
              filteredCrypto={filteredCrypto}
              handleAddCrypto={handleAddCrypto}
              setCanListbeClosed={setCanListbeClosed}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
