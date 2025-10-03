import { useUnitsStore } from '@/unitsStore';
type DailyTileProps = {
  day: string;
  icon: string;
  max: number;
  min: number;
};

const DailyTile = ({ day, icon, max, min }: DailyTileProps) => {
  const { units } = useUnitsStore();

  return (
    <div>
      {day}
      {icon}
      {max}
      {units.temperature}
      {min}
      {units.temperature}
    </div>
  );
};

export default DailyTile;
