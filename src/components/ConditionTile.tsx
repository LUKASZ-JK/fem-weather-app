type ConditionTileProps = {
  title: string;
  value: number | undefined;
  units: string;
};

const ConditionTile = ({ title, value, units }: ConditionTileProps) => {
  return (
    <div className="condition-tile">
      {title}
      {value}
      {units}
    </div>
  );
};

export default ConditionTile;
