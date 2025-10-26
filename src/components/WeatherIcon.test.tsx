import { render, screen } from '@testing-library/react';
import WeatherIcon from './WeatherIcon';

describe('WeatherIcon', () => {
  const weatherCases: Array<[number, string]> = [
    [0, 'sunny'],
    [1, 'partly-cloudy'],
    [3, 'overcast'],
    [45, 'fog'],
    [51, 'drizzle'],
    [61, 'rain'],
    [71, 'snow'],
    [95, 'storm'],
    [999, 'sunny'], // unknown -> default
  ];

  test('renders without crashing', () => {
    render(<WeatherIcon weatherCode={0} size={32} />);
    const img = screen.getByTestId('weather-icon');
    expect(img).toBeInTheDocument();
  });

  test('applies the correct size', () => {
    const size = 32;
    render(<WeatherIcon weatherCode={0} size={size} />);
    const img = screen.getByTestId('weather-icon');
    // inline style width/height set by component
    expect(img).toHaveStyle(
      `width: ${size.toString()}px; height: ${size.toString()}px;`,
    );
  });

  test.each(weatherCases)('maps code %s to icon %s', (code, expected) => {
    render(<WeatherIcon weatherCode={code} size={32} />);
    const img = screen.getByTestId('weather-icon');

    // assert the chosen icon name via alt attribute
    expect(img).toHaveAttribute('alt', expected);

    // src should point to a webp asset and include the icon- prefix
    expect(img.getAttribute('src')).toMatch(
      new RegExp(`icon-${expected}\\.webp$`),
    );
  });
});
