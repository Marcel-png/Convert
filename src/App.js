import { useEffect, useState, useCallback } from "react";
import "./CurrencyConverter.css";

const API = "https://open.er-api.com/v6/latest";

const SYMBOLS = {
  USD: "$", EUR: "€", GBP: "£", JPY: "¥", CHF: "Fr", CAD: "C$",
  AUD: "A$", CNY: "¥", INR: "₹", XOF: "CFA", BRL: "R$", MXN: "MX$",
  KRW: "₩", TRY: "₺", SEK: "kr", NOK: "kr", DKK: "kr", PLN: "zł",
  SGD: "S$", HKD: "HK$",
};

const NAMES = {
  USD: "Dollar américain", EUR: "Euro", GBP: "Livre sterling",
  JPY: "Yen japonais", CHF: "Franc suisse", CAD: "Dollar canadien",
  AUD: "Dollar australien", CNY: "Yuan chinois", INR: "Roupie indienne",
  XOF: "Franc CFA", BRL: "Real brésilien", MXN: "Peso mexicain",
  KRW: "Won sud-coréen", TRY: "Livre turque", SEK: "Couronne suédoise",
  NOK: "Couronne norvégienne", DKK: "Couronne danoise", PLN: "Zloty polonais",
  SGD: "Dollar de Singapour", HKD: "Dollar de Hong Kong",
};

const POPULAR_PAIRS = [
  ["USD", "EUR"], ["USD", "GBP"], ["EUR", "GBP"],
  ["USD", "XOF"], ["USD", "JPY"], ["EUR", "XOF"],
];

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("XOF");
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((d) => setCurrencies(Object.keys(d.rates).sort()))
      .catch(() => setError("Impossible de charger les devises."));
  }, []);

  const convert = useCallback(
    async (from = fromCurrency, to = toCurrency, amt = amount) => {
      const parsed = parseFloat(amt);
      if (!parsed || isNaN(parsed) || parsed <= 0) {
        setError("Veuillez entrer un montant valide.");
        return;
      }
      setError("");
      setLoading(true);
      try {
        const r = await fetch(`${API}/${from}`);
        const d = await r.json();
        const exchangeRate = d.rates[to];
        setRate(exchangeRate);
        setResult((parsed * exchangeRate).toFixed(2));
      } catch {
        setError("Erreur lors de la conversion. Réessayez.");
      } finally {
        setLoading(false);
      }
    },
    [fromCurrency, toCurrency, amount]
  );

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    convert(toCurrency, fromCurrency, amount);
  };

  const handlePill = (from, to) => {
    setFromCurrency(from);
    setToCurrency(to);
    convert(from, to, amount);
  };

  const fromSymbol = SYMBOLS[fromCurrency] || fromCurrency.slice(0, 1);
  const toSymbol = SYMBOLS[toCurrency] || "";

  return (
    <div className="cc-page">
      <div className="cc-container">


        <div className="cc-header">
          <p className="cc-subtitle">Taux mis à jour en temps réel</p>
          <h1 className="cc-title">Convertisseur de devises</h1>
        </div>


        <div className="cc-card">


          <div className="cc-field">
            <label className="cc-label">Montant</label>
            <div className="cc-input-wrapper">
              <span className="cc-input-symbol">{fromSymbol}</span>
              <input
                type="number"
                className="cc-amount-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && convert()}
                placeholder="0.00"
              />
            </div>
          </div>

    
          <div className="cc-select-row">
            <div>
              <label className="cc-label">De</label>
              <select
                className="cc-select"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c} — {NAMES[c] || c}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="cc-swap-btn"
              onClick={handleSwap}
              aria-label="Échanger les devises"
            >
              ⇄
            </button>

            <div>
              <label className="cc-label">Vers</label>
              <select
                className="cc-select"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c} — {NAMES[c] || c}
                  </option>
                ))}
              </select>
            </div>
          </div>

    
          <button
            className="cc-convert-btn"
            onClick={() => convert()}
            disabled={loading}
          >
            {loading ? "Conversion..." : "Convertir"}
          </button>
        </div>

   
        {error && <p className="cc-error">{error}</p>}

   
        {result && !error && (
          <div className="cc-result-card">
            <div className="cc-result-row">
              <div>
                <p className="cc-result-from">
                  {parseFloat(amount).toLocaleString("fr-FR")} {fromCurrency}{" "}
                  ({NAMES[fromCurrency] || fromCurrency})
                </p>
                <p className="cc-result-value">
                  {toSymbol}
                  {parseFloat(result).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="cc-result-to-name">{NAMES[toCurrency] || toCurrency}</p>
              </div>
              <div>
                <p className="cc-rate-label">Taux</p>
                <p className="cc-rate-value">
                  1 {fromCurrency} = {rate?.toFixed(4)} {toCurrency}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="cc-popular-section">
          <p className="cc-popular-title">Paires populaires</p>
          <div className="cc-pills-row">
            {POPULAR_PAIRS.map(([a, b]) => (
              <button
                key={`${a}-${b}`}
                className="cc-pill"
                onClick={() => handlePill(a, b)}
              >
                {a} → {b}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
