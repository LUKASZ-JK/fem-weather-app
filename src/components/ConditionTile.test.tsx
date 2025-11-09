import { render, screen } from '@testing-library/react';
import * as weatherStore from '@/stores/weatherStore';
import { ApiStates } from '@/types';
import ConditionTile from './ConditionTile';

describe('ConditionTile', () => {
  it('shows placeholder when weather is loading', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.loadingWeather,
    });

    render(<ConditionTile title="Temperature" value={22} units="°C" />);
    expect(screen.getByTestId('condition-tile-Temperature')).toHaveTextContent(
      '-',
    );
  });

  it('renders rounded value and units when not loading', () => {
    vi.spyOn(weatherStore, 'useWeatherStore').mockReturnValue({
      apiState: ApiStates.success,
    });

    render(<ConditionTile title="Temperature" value={22.4} units="°C" />);

    expect(screen.getByTestId('condition-tile-Temperature')).toHaveTextContent(
      /22\s*°C/,
    );
  });
});
