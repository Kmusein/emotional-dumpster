import Svg, { Path } from 'react-native-svg';
import { colors } from '../constants/theme';

export default function TrashCanShape({
  width = 197,
  height = 189,
  fill = colors.trashCan,
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 196.5 189">
      <Path d="M0 0H196.5L166.5 189H27.5L0 0Z" fill={fill} />
    </Svg>
  );
}
