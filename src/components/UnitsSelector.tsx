import { useUnitsStore } from '../store';
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
            <DropdownMenuItem onClick={() => setTemperature('celsius')}>
              Celsius {units.temperature === 'celsius' && <Checkmark />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTemperature('fahrenheit')}>
              Fahrenheit {units.temperature === 'fahrenheit' && <Checkmark />}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Wind Speed</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setWindSpeed('km/h')}>
              km/h {units.windSpeed === 'km/h' && <Checkmark />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setWindSpeed('mph')}>
              mph {units.windSpeed === 'mph' && <Checkmark />}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Precipitation</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setPrecipitation('mm')}>
              mm {units.precipitation === 'mm' && <Checkmark />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPrecipitation('inch')}>
              inch {units.precipitation === 'inch' && <Checkmark />}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UnitsSelector;
