import { useUnitsStore } from '../stores/unitsStore';
import { Button } from '@/components/ui/button';
import iconUnits from '../assets/icon-units.svg';
import iconDropdown from '../assets/icon-dropdown.svg';
import iconCheckkmark from '../assets/icon-checkmark.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PrecipitationUnits, TemperatureUnits, WindSpeedUnits } from '@/types';
import StyledDropdownMenuItem from './ui/styled-dropdown-menu-item';

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
            variant="default"
            className="flex items-center gap-2 
            text-neutral
            text-base
            bg-neutral-800 
            hover:text-neutral
            hover:bg-neutral-800
            focus-visible:ring-0
            ">
            <img src={iconUnits} alt="Units Icon" className="w-4 h-4" />
            <span>Units</span>
            <img src={iconDropdown} alt="Dropdown Icon" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="bg-neutral-800 text-neutral border-0 w-48 p-2"
          align="end">
          <StyledDropdownMenuItem
            className="mb-2"
            onClick={() => {
              setUnitsPreset(
                units.unitsPreset === 'metric' ? 'imperial' : 'metric',
              );
            }}>
            Switch to {units.unitsPreset === 'metric' ? 'Imperial' : 'Metric'}
          </StyledDropdownMenuItem>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-neutral-300 text-sm">
              Temperature
            </DropdownMenuLabel>
            <StyledDropdownMenuItem
              onClick={() => {
                setTemperature(TemperatureUnits.celsius);
              }}>
              Celsius °C
              {units.temperature === TemperatureUnits.celsius && <Checkmark />}
            </StyledDropdownMenuItem>
            <StyledDropdownMenuItem
              onClick={() => {
                setTemperature(TemperatureUnits.fahrenheit);
              }}>
              Fahrenheit °F
              {units.temperature === TemperatureUnits.fahrenheit && (
                <Checkmark />
              )}
            </StyledDropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-neutral-600 mx-2" />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-neutral-300 text-sm">
              Wind Speed
            </DropdownMenuLabel>
            <StyledDropdownMenuItem
              onClick={() => {
                setWindSpeed(WindSpeedUnits.kmh);
              }}>
              km/h {units.windSpeed === WindSpeedUnits.kmh && <Checkmark />}
            </StyledDropdownMenuItem>
            <StyledDropdownMenuItem
              onClick={() => {
                setWindSpeed(WindSpeedUnits.mph);
              }}>
              mph {units.windSpeed === WindSpeedUnits.mph && <Checkmark />}
            </StyledDropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="bg-neutral-600 mx-2" />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-neutral-300 text-sm">
              Precipitation
            </DropdownMenuLabel>
            <StyledDropdownMenuItem
              onClick={() => {
                setPrecipitation(PrecipitationUnits.mm);
              }}>
              Milimeters (mm)
              {units.precipitation === PrecipitationUnits.mm && <Checkmark />}
            </StyledDropdownMenuItem>
            <StyledDropdownMenuItem
              onClick={() => {
                setPrecipitation(PrecipitationUnits.inch);
              }}>
              Inches (in)
              {units.precipitation === PrecipitationUnits.inch && <Checkmark />}
            </StyledDropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UnitsSelector;
