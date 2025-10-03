import DailyTile from './DailyTile';

const DailyForecast = () => {
  return (
    <div>
      Daily forecast
      <DailyTile day={'Mon'} icon={'icon-overcast'} max={25} min={15} />
    </div>
  );
};

export default DailyForecast;
