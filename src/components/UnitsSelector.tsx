import { useUnitsStore } from '../unitsStore';
import { Button } from '@/components/ui/button';
import iconUnits from '../assets/icon-units.svg';
import iconDropdown from '../assets/icon-dropdown.svg';
import iconCheckkmark from '../assets/icon-checkmark.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PrecipitationUnits, TemperatureUnits, WindSpeedUnits } from '@/types';

const Checkmark = () => (
  <img src={iconCheckkmark} alt="Checkmark Icon" className="w-4 h-4 ml-auto" />
);

const UnitsSelector = () => {
  const {
    units,
    setUnitsPreset,
    setTemperature,
    setWindSpeed,
    setPrecipitation,
  } = useUnitsStore();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 
            text-neutral
            bg-neutral-800 
            hover:text-neutral
            hover:bg-neutral-700
            active:bg-neutral-700
            ">
            <img src={iconUnits} alt="Units Icon" className="w-4 h-4" />
            <span>Units</span>
            <img
              src={iconDropdown}
              alt="Dropdown Icon"
              className="w-4 h-4 ml-auto"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem
            onClick={() =>
              setUnitsPreset(
                units.unitsPreset === 'metric' ? 'imperial' : 'metric',
              )
            }>
            Switch to {units.unitsPreset === 'metric' ? 'Imperial' : 'Metric'}
          </DropdownMenuItem>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Temperature</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setTemperature(TemperatureUnits.celsius)}>
              Celsius
              {units.temperature === TemperatureUnits.celsius && <Checkmark />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTemperature(TemperatureUnits.fahrenheit)}>
              Fahrenheit
              {units.temperature === TemperatureUnits.fahrenheit && (
                <Checkmark />
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Wind Speed</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setWindSpeed(WindSpeedUnits.kmh)}>
              km/h {units.windSpeed === WindSpeedUnits.kmh && <Checkmark />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setWindSpeed(WindSpeedUnits.mph)}>
              mph {units.windSpeed === WindSpeedUnits.mph && <Checkmark />}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Precipitation</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setPrecipitation(PrecipitationUnits.mm)}>
              mm
              {units.precipitation === PrecipitationUnits.mm && <Checkmark />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setPrecipitation(PrecipitationUnits.inch)}>
              inch
              {units.precipitation === PrecipitationUnits.inch && <Checkmark />}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UnitsSelector;
