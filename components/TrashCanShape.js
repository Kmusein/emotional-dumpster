import Svg, { Polygon } from 'react-native-svg';

export default function TrashCanShape({ width = 240, height = 190, fill = '#D4D4D4' }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 240 190">
      <Polygon points="24,20 216,20 184,180 56,180" fill={fill} />
    </Svg>
  );
}
