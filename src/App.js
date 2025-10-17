import { useEffect, useState } from 'react';
import currencyCodes from 'currency-codes';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState('');

  const apiUrl = 'https://open.er-api.com/v6/latest';

  // Charger les devises dans les listes déroulantes
  const loadCurrencies = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const currencyList = Object.keys(data.rates);
      setCurrencies(currencyList);
    } catch (error) {
      alert('Erreur lors du chargement des devises.');
    }
  };

  // Convertir la devise
  const convertCurrency = async () => {
    if (isNaN(amount) || amount <= 0) {
      setResult('Veuillez entrer un montant valide.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${fromCurrency}`);
      const data = await response.json();
      const rate = data.rates[toCurrency];
      const convertedAmount = (amount * rate).toFixed(2);
      const fromCurrencyName = currencyCodes.code(fromCurrency)?.currency || fromCurrency;
      const toCurrencyName = currencyCodes.code(toCurrency)?.currency || toCurrency;
      setResult(`${amount} ${fromCurrencyName} = ${convertedAmount} ${toCurrencyName}`);
    } catch (error) {
      setResult('Erreur lors de la conversion.');
    }
  };

  useEffect(() => {
    loadCurrencies();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen animated-gradient p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full transform transition duration-500 hover:scale-105 hover:shadow-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center ">Convertisseur de Devises</h1>
        <div className="mb-6">
          <label htmlFor="amount" className="block font-medium mb-2 text-gray-700">Montant :</label>
          <input
            type="number"
            id="amount"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 transform hover:scale-105"
            placeholder="Entrez un montant"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="from-currency" className="block font-medium mb-2 text-gray-700">De :</label>
          <select
            id="from-currency"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 transform hover:scale-105"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currencyCodes.code(currency)?.currency || currency}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="to-currency" className="block font-medium mb-2 text-gray-700">À :</label>
          <select
            id="to-currency"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 transform hover:scale-105"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currencyCodes.code(currency)?.currency || currency}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={convertCurrency}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 transform hover:scale-105"
        >
          Convertir
        </button>
        {result && <div className="mt-6 font-bold text-lg text-gray-800 text-center">{result}</div>}
      </div>
    </div>
  );
};

export default CurrencyConverter;
