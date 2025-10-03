import './App.css';
import UnitsSelector from './components/UnitsSelector';
import CurrentWeather from './components/CurrentWeather';
import Search from './components/Search';
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';

function App() {
  return (
    <>
      <UnitsSelector />
      <Search />
      <CurrentWeather />
      <DailyForecast />
      <HourlyForecast />
    </>
  );
}

export default App;
