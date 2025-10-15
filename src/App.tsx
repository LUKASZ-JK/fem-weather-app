import UnitsSelector from './components/UnitsSelector';
import CurrentWeather from './components/CurrentWeather';
import Search from './components/Search';
import DailyForecast from './components/DailyForecast';
import HourlyForecast from './components/HourlyForecast';
import logo from './assets/logo.svg';
import iconError from './assets/icon-error.svg';
import iconRetry from './assets/icon-retry.svg';
import { useWeatherStore } from './stores/weatherStore';
import { ApiStates } from './types';
import { Button } from './components/ui/button';

function App() {
  const { city, cities, apiState } = useWeatherStore();

  return (
    <div className="bg-neutral-900 text-neutral leading-[1.2] mx-auto min-h-screen min-h-[100dvh] min-w-[343px] pb-4">
      <div className="mx-auto w-[90vw]">
        <div className="flex justify-between items-center py-4">
          <a href="#">
            <img
              src={logo}
              alt="Logo representing stylized Sun with a text 'Weather Now'"
            />
          </a>
          <UnitsSelector />
        </div>
        {apiState === ApiStates.error ? (
          <div className="text-center mt-16 mx-auto">
            <img
              src={iconError}
              alt="Grey circle with diagonal line"
              className="w-auto h-12 mx-auto mb-8"
            />
            <span className="block text-neutral text-6xl font-bold font-bricolage mb-6">
              Something went wrong
            </span>
            <span className="block text-neutral-200 text-xl mb-6">
              We couldn't connect to the server (API error). Please try again in
              a few moments.
            </span>
            <Button
              className="bg-neutral-800 hover:bg-neutral-600 text-base mx-auto p-6 focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-3 focus-visible:ring-offset-neutral-900 "
              onClick={() => location.reload()}>
              <img src={iconRetry} alt="Spinning circle" />
              Retry
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-7xl font-bold font-bricolage text-center mt-8 mb-16">
              How's the sky looking today?
            </h1>
            <div className="flex items-center justify-center">
              <Search />
            </div>
            {apiState === ApiStates.success && cities?.length === 0 && (
              <div className="text-center text-3xl font-bold ">
                <span>No search result found!</span>
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
          </>
        )}
      </div>
    </div>
  );
}

export default App;
