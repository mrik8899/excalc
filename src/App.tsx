import React, { useState, useEffect } from 'react';

// --- Type Definitions ---
interface CurrencyIconProps {
  type: 'pkr' | 'php' | 'usd';
  className?: string;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder: string;
  className?: string;
  darkMode: boolean;
}

interface ResultDisplayProps {
  label: string;
  value: number;
  decimals?: number;
  className?: string;
  darkMode: boolean;
}

// --- Helper Functions ---
const formatNumber = (num: number, decimals: number = 2): string => {
  if (isNaN(num) || num === 0) {
    return '0.' + '0'.repeat(decimals);
  }
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

// --- Reusable Components ---

const CurrencyIcon: React.FC<CurrencyIconProps> = ({ type, className = "" }) => {
  const icons = {
    pkr: { symbol: '₨', bg: 'bg-gradient-to-r from-green-500 to-green-600' },
    php: { symbol: '₱', bg: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    usd: { symbol: '$', bg: 'bg-gradient-to-r from-amber-500 to-amber-600' }
  };
  
  const icon = icons[type];
  return (
    <div className={`w-8 h-8 rounded-full ${icon.bg} flex items-center justify-center text-white text-base font-bold shadow-md ${className}`}>
      {icon.symbol}
    </div>
  );
};

// MODIFIED INPUTFIELD COMPONENT
const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, placeholder, className = "", darkMode }) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value === '') {
      setDisplayValue('');
    } else {
      const num = parseFloat(value);
      if (value.endsWith('.') && !isNaN(num)) {
          setDisplayValue(num.toLocaleString('en-US') + '.');
      } else if (!isNaN(num)) {
        setDisplayValue(num.toLocaleString('en-US'));
      } else {
        setDisplayValue(value);
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    let cleanedValue = input.replace(/[^0-9.]/g, ''); 

    const parts = cleanedValue.split('.');
    if (parts.length > 2) {
        cleanedValue = parts[0] + '.' + parts.slice(1).join('');
    }

    setDisplayValue(cleanedValue);
    onChange(cleanedValue);
  };

  const handleBlur = () => {
    if (value !== '') {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setDisplayValue(num.toLocaleString('en-US'));
      } else {
        setDisplayValue(''); 
        onChange(''); 
      }
    } else {
        setDisplayValue('');
    }
  };

  return (
    <div className={`flex items-baseline justify-between 
                     w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1.33rem)]
                     ${className}`}> 
      {/* Increased label text from text-sm to text-base */}
      <label className={`text-base font-semibold uppercase tracking-tight flex-shrink-0 mr-1 transition-colors duration-300 ${ 
        darkMode ? '!text-white' : 'text-gray-600'
      }`}>
        {label}
      </label>
      {/* Increased input text from text-lg to text-xl */}
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        inputMode="decimal"
        className={`w-full text-right px-2 py-1 bg-transparent border-b-2 rounded text-xl font-medium transition-colors duration-200 focus:outline-none focus:shadow-md focus:border-blue-500
          ${darkMode 
            ? 'border-gray-500 text-gray-100 placeholder-gray-400 placeholder:text-sm focus:border-blue-400'
            : 'border-gray-400 text-gray-800 placeholder-gray-400 placeholder:text-sm focus:border-indigo-600'
          }`}
      />
    </div>
  );
};

// MODIFIED RESULTDISPLAY COMPONENT
const ResultDisplay: React.FC<ResultDisplayProps> = ({ label, value, decimals = 2, className = "", darkMode }) => {
    return (
        <div className={`flex items-baseline justify-between 
                         w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.33%-1.33rem)]
                         ${className}`}> 
            {/* Increased label text from text-sm to text-base */}
            <label className={`text-base font-semibold uppercase tracking-tight flex-shrink-0 mr-1 ${darkMode ? '!text-white' : 'text-gray-600'}`}>
                {label}
            </label>
            {/* Increased result text from text-xl to text-2xl */}
            <span className={`text-right font-bold text-2xl select-text py-1 transition-colors duration-300 ${
                darkMode 
                ? 'text-blue-300'
                : 'text-blue-700'
            }`}>
                {formatNumber(value, decimals)}
            </span>
        </div>
    );
};

// --- Main App Component ---

export default function CurrencyConverterApp() {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // State for different conversion sections
  const [pkrAmount1, setPkrAmount1] = useState<string>('');
  const [rate1, setRate1] = useState<string>('');
  const [phpAmount1, setPhpAmount1] = useState<string>(''); 
  const [rate2, setRate2] = useState<string>('');
  const [pkrAmount2, setPkrAmount2] = useState<string>('');
  const [phpAmount2, setPhpAmount2] = useState<string>('');
  const [usdPkrRate, setUsdPkrRate] = useState<string>('');
  const [usdPhpRate, setUsdPhpRate] = useState<string>('');

  // Set initial dark mode based on system preference (optional)
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle Dark Mode and apply/remove 'dark' class to html element
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  // Calculations
  const pkrToPhpResult = rate1 && pkrAmount1 && !isNaN(parseFloat(pkrAmount1)) && !isNaN(parseFloat(rate1)) ? parseFloat(pkrAmount1) / parseFloat(rate1) : 0;
  const phpToPkrResult = rate2 && phpAmount1 && !isNaN(parseFloat(phpAmount1)) && !isNaN(parseFloat(rate2)) ? parseFloat(phpAmount1) * parseFloat(rate2) : 0;
  const directPkrPhpRate = phpAmount2 && pkrAmount2 && !isNaN(parseFloat(pkrAmount2)) && !isNaN(parseFloat(phpAmount2)) ? parseFloat(pkrAmount2) / parseFloat(phpAmount2) : 0;
  const crossUsdRate = usdPhpRate && usdPkrRate && !isNaN(parseFloat(usdPkrRate)) && !isNaN(parseFloat(usdPhpRate)) ? parseFloat(usdPkrRate) / parseFloat(usdPhpRate) : 0;

  return (
    <div className={`min-h-screen p-4 flex flex-col items-center transition-all duration-500 font-inter ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100'
        : 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 text-gray-800'
    }`}>
      {/* GLOBAL CONTAINER FOR ALL CONTENT - adjust max-w-3xl to change overall size */}
      <div className="w-full max-w-3xl mx-auto space-y-4"> 
        
        <header className="flex items-center justify-between py-2 px-1 mb-4">
          <h1 className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            💱 Exchange Calc
          </h1>
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600 active:scale-95' 
                : 'bg-white text-gray-700 hover:bg-gray-100 active:scale-95'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </header>

        {/* --- 1st Box: PKR to PHP Converter Card (Green & White Gradient) --- */}
        <section className={`rounded-2xl p-4 shadow-sm border-2 transition-all duration-300 w-full mx-auto ${ 
            darkMode 
              ? 'bg-gradient-to-br from-green-900 to-green-700 border-green-700'
              : 'bg-gradient-to-br from-green-200 to-white border-green-300'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <CurrencyIcon type="pkr" />
              <span className={`font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                PKR to PHP
              </span>
            </div>
            <div className="flex flex-wrap justify-evenly items-baseline gap-x-8 gap-y-4"> 
        
              <InputField
                label="PKR Amount"
                value={pkrAmount1}
                onChange={setPkrAmount1}
                placeholder=" 50,000"
                darkMode={darkMode}
              />
              <InputField
                label="Rate "
                value={rate1}
                onChange={setRate1}
                placeholder=" 4.80"
                darkMode={darkMode}
              />
              <ResultDisplay label="Result (PHP)" value={pkrToPhpResult} decimals={0} darkMode={darkMode} />
            </div>
        </section>

        {/* --- 2nd Box: PHP to PKR Converter Card (Red, Blue, Yellow, White Gradient) --- */}
        <section className={`rounded-2xl p-4 shadow-sm border-2 transition-all duration-300 w-full mx-auto ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-900 via-yellow-800 to-red-900 border-blue-700'
              : 'bg-gradient-to-br from-blue-100 via-yellow-50 to-red-100 border-blue-200'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <CurrencyIcon type="php" />
              <span className={`font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
                PHP to PKR
              </span>
            </div>
            <div className="flex flex-wrap justify-evenly items-baseline gap-x-8 gap-y-4">
              <InputField
                label="PHP Amount"
                value={phpAmount1}
                onChange={setPhpAmount1}
                placeholder=" 10,000"
                darkMode={darkMode}
              />
              <InputField
                label="Rate "
                value={rate2}
                onChange={setRate2}
                placeholder=" 4.80"
                darkMode={darkMode}
              />
              <ResultDisplay label="Result (PKR)" value={phpToPkrResult} decimals={0} darkMode={darkMode} />
            </div>
        </section>

        {/* --- 3rd Box: Direct PKR/PHP Rate (Green, Red, Blue Gradient) --- */}
        <section className={`rounded-2xl p-4 shadow-sm border-2 transition-all duration-300 w-full mx-auto ${
          darkMode 
            ? 'bg-gradient-to-br from-green-800 via-red-800 to-blue-800 border-gray-700'
            : 'bg-gradient-to-br from-green-100 via-red-100 to-blue-100 border-gray-300'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <CurrencyIcon type="pkr" />
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-700'}`}>↔</span>
            <CurrencyIcon type="php" />
            <span className={`font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
              Direct Rate
            </span>
          </div>
          <div className="flex flex-wrap justify-evenly items-baseline gap-x-8 gap-y-4"> 
            <InputField
              label="PKR Amount"
              value={pkrAmount2}
              onChange={setPkrAmount2}
              placeholder=" 50,000"
              darkMode={darkMode}
            />
            <InputField
              label="PHP Amount"
              value={phpAmount2}
              onChange={setPhpAmount2}
              placeholder=" 10,000"
              darkMode={darkMode}
            />
            <ResultDisplay label="Rate (PKR / PHP)" value={directPkrPhpRate} decimals={2} darkMode={darkMode} />
          </div>
        </section>

        {/* --- 4th Box: USD Cross Rate Section (Red, Blue, White Gradient) --- */}
        <section className={`rounded-2xl p-4 shadow-sm border-2 transition-all duration-300 w-full mx-auto ${
          darkMode 
            ? 'bg-gradient-to-br from-red-900 via-blue-900 to-gray-900 border-gray-700'
            : 'bg-gradient-to-br from-red-100 via-blue-100 to-white border-gray-300'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <CurrencyIcon type="usd" />
            <span className={`font-semibold text-lg ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>
              USD Cross Rates
            </span>
          </div>
          <div className="flex flex-wrap justify-evenly items-baseline gap-x-8 gap-y-4"> 
            <InputField
              label="USD to PKR Rate"
              value={usdPkrRate}
              onChange={setUsdPkrRate}
              placeholder=" 283.10"
              darkMode={darkMode}
            />
            <InputField
              label="USD to PHP Rate"
              value={usdPhpRate}
              onChange={setUsdPhpRate}
              placeholder=" 55.90"
              darkMode={darkMode}
            />
            <ResultDisplay label="Rate (PKR/PHP via USD)" value={crossUsdRate} decimals={2} darkMode={darkMode} />
          </div>
        </section>

        {/* Footer */}
        <footer className={`text-center mt-6 text-sm ${
          darkMode ? 'text-gray-200' : 'text-gray-500'
        }`}>
          Exchange Calc
        </footer>
      </div>
    </div>
  );
}