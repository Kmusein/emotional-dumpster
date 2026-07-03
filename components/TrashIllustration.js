import Svg, { Ellipse, Path } from 'react-native-svg';

const VIEWBOX_WIDTH = 290.195;
const VIEWBOX_HEIGHT = 325.713;
const ASPECT_RATIO = VIEWBOX_WIDTH / VIEWBOX_HEIGHT;

export default function TrashIllustration({ width }) {
  const height = width / ASPECT_RATIO;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} fill="none">
      <Ellipse cx="129.18" cy="83.9254" rx="119" ry="55" transform="rotate(-15 129.18 83.9254)" fill="#6E6E6E" />
      <Path d="M14.235 114.725L244.125 53.126L256.388 234.119L94.1122 277.601L14.235 114.725Z" fill="#D9D9D9" />
      <Ellipse cx="175.121" cy="255.377" rx="84" ry="50.3088" transform="rotate(-15 175.121 255.377)" fill="#D9D9D9" />
    </Svg>
  );
}
