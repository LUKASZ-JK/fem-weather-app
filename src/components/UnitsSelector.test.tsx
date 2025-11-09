import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import UnitsSelector from './UnitsSelector';
import { TemperatureUnits, WindSpeedUnits, PrecipitationUnits } from '@/types';
import * as unitsStore from '@/stores/unitsStore';
import { mockUseUnitsStore } from '../../testSetup';

describe('UnitsSelector', () => {
  it('renders the UnitsSelector button', () => {
    render(<UnitsSelector />);

    const button = screen.getByTestId('units-selector-button');
    expect(button).toBeInTheDocument();
    expect(screen.getByAltText('Units Icon')).toBeInTheDocument();
    expect(screen.getByAltText('Dropdown Icon')).toBeInTheDocument();
  });

  it('renders options correctly when clicked and displays a checkmark next to the default option)', async () => {
    const user = userEvent.setup();
    render(<UnitsSelector />);

    const button = screen.getByTestId('units-selector-button');
    await user.click(button);

    const celsiusOption = screen.getByText(/celsius °c/i);
    const kmhOption = screen.getByText(/km\/h/i);
    const mmOption = screen.getByText(/milimeters \(mm\)/i);
    const fahrenheitOption = screen.getByText(/fahrenheit °f/i);
    const mphOption = screen.getByText(/mph/i);
    const inchOption = screen.getByText(/inches \(in\)/i);

    expect(
      celsiusOption.querySelector('img[alt="Checkmark Icon"]'),
    ).toBeInTheDocument();
    expect(
      kmhOption.querySelector('img[alt="Checkmark Icon"]'),
    ).toBeInTheDocument();
    expect(
      mmOption.querySelector('img[alt="Checkmark Icon"]'),
    ).toBeInTheDocument();
    expect(fahrenheitOption).toBeInTheDocument();
    expect(mphOption).toBeInTheDocument();
    expect(inchOption).toBeInTheDocument();
  });

  it('displays a checkmark next to the imperial option', async () => {
    const user = userEvent.setup();
    vi.spyOn(unitsStore, 'useUnitsStore').mockReturnValue({
      units: {
        temperature: TemperatureUnits.fahrenheit,
        windSpeed: WindSpeedUnits.mph,
        precipitation: PrecipitationUnits.inch,
      },
    });

    render(<UnitsSelector />);

    const button = screen.getByTestId('units-selector-button');
    await user.click(button);

    const fahrenheitOption = screen.getByText(/fahrenheit °f/i);
    const mphOption = screen.getByText(/mph/i);
    const inchOption = screen.getByText(/inches \(in\)/i);

    expect(
      fahrenheitOption.querySelector('img[alt="Checkmark Icon"]'),
    ).toBeInTheDocument();
    expect(
      mphOption.querySelector('img[alt="Checkmark Icon"]'),
    ).toBeInTheDocument();
    expect(
      inchOption.querySelector('img[alt="Checkmark Icon"]'),
    ).toBeInTheDocument();
  });

  it('switches to imperial units', async () => {
    const user = userEvent.setup();
    const setUnitsPreset = vi.fn();
    mockUseUnitsStore({ setUnitsPreset });

    render(<UnitsSelector />);

    const button = screen.getByTestId('units-selector-button');

    await user.click(button);
    const toggleButton = screen.getByText(/switch to imperial/i);
    await user.click(toggleButton);

    expect(setUnitsPreset).toHaveBeenCalledWith('imperial');
  });

  it('switches to metric units', async () => {
    const user = userEvent.setup();
    const setUnitsPreset = vi.fn();
    mockUseUnitsStore({
      units: {
        unitsPreset: 'imperial',
        temperature: TemperatureUnits.fahrenheit,
        windSpeed: WindSpeedUnits.mph,
        precipitation: PrecipitationUnits.inch,
      },
      setUnitsPreset,
    });

    render(<UnitsSelector />);

    const button = screen.getByTestId('units-selector-button');

    await user.click(button);
    const toggleButton = screen.getByText(/switch to metric/i);
    await user.click(toggleButton);

    expect(setUnitsPreset).toHaveBeenCalledWith('metric');
  });

  it('changes temperature units', async () => {
    const user = userEvent.setup();
    const setTemperature = vi.fn();
    mockUseUnitsStore({ setTemperature });

    render(<UnitsSelector />);

    const button = screen.getByTestId('units-selector-button');

    await user.click(button);
    const celsiusOption = screen.getByText(/celsius °c/i);
    await user.click(celsiusOption);
    expect(setTemperature).toHaveBeenCalledWith(TemperatureUnits.celsius);

    await user.click(button);
    const fahrenheitOption = screen.getByText(/fahrenheit °f/i);
    await user.click(fahrenheitOption);
    expect(setTemperature).toHaveBeenCalledWith(TemperatureUnits.fahrenheit);
  });

  it('changes wind speed units', async () => {
    const user = userEvent.setup();
    const setWindSpeed = vi.fn();
    mockUseUnitsStore({ setWindSpeed });

    render(<UnitsSelector />);

    const button = screen.getByTestId('units-selector-button');

    await user.click(button);
    const kmhOption = screen.getByText(/km\/h/i);
    await user.click(kmhOption);
    expect(setWindSpeed).toHaveBeenCalledWith(WindSpeedUnits.kmh);

    await user.click(button);
    const mphOption = screen.getByText(/mph/i);
    await user.click(mphOption);
    expect(setWindSpeed).toHaveBeenCalledWith(WindSpeedUnits.mph);
  });

  it('changes precipitation units', async () => {
    const user = userEvent.setup();
    const setPrecipitation = vi.fn();
    mockUseUnitsStore({ setPrecipitation });

    render(<UnitsSelector />);

    const button = screen.getByTestId('units-selector-button');

    await user.click(button);
    const mmOption = screen.getByText(/milimeters \(mm\)/i);
    await user.click(mmOption);
    expect(setPrecipitation).toHaveBeenCalledWith(PrecipitationUnits.mm);

    await user.click(button);
    const inchOption = screen.getByText(/inches \(in\)/i);
    await user.click(inchOption);
    expect(setPrecipitation).toHaveBeenCalledWith(PrecipitationUnits.inch);
  });
});
