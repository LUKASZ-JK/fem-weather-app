import './App.css';
import UnitsSelector from './components/UnitsSelector';
import CurrentWeather from './components/CurrentWeather';
import Search from './components/Search';
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import logo from './assets/logo.svg';
import { useWeatherStore } from './stores/weatherStore';
import { ApiStates } from './types';

function App() {
  const { city, apiState } = useWeatherStore();

  return (
    <div className="bg-neutral-900 text-neutral leading-[1.2] mx-auto min-h-screen min-h-[100dvh] min-w-[343px] pb-4">
      <div className="mx-auto w-[90vw]">
        <div className="flex justify-between items-center py-4">
          <img
            src={logo}
            alt="Logo representing stylized Sun with a text 'Weather Now'"
          />
          <UnitsSelector />
        </div>
        <h1 className="text-7xl font-bold font-bricolage text-center mt-8 mb-16">
          How's the sky looking today?
        </h1>
        <div className="flex items-center justify-center">
          <Search />
        </div>
        {apiState === ApiStates.error && (
          <div className="text-center">
            <span className="text-neutral text-7xl font-bold font-bricolage">
              Something went wrong
            </span>
            <span className="text-neutral-200 text-xl">
              We couldn't connect to the server (API error). Please try again in
              a few moments.
            </span>
          </div>
        )}
        {city && (
          <div className="flex flex-col tablet:flex-row justify-center tablet:items-start items-center gap-8 w-full">
            <div className="flex flex-col items-center justify-center tablet:h-[650px]">
              <CurrentWeather />
              <DailyForecast />
            </div>
            <div className="w-full max-w-[343px] mobile:max-w-[800px] tablet:w-[400px]">
              <HourlyForecast />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
