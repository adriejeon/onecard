import React from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { colors } from "../styles/colors";

const BackgroundSVG = ({ width, height }) => {
  return (
    <Svg width={width} height={height} style={{ position: "absolute" }}>
      <Defs>
        <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.gradientStart} />
          <Stop offset="100%" stopColor={colors.gradientEnd} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#gradient)" />
    </Svg>
  );
};

export default BackgroundSVG;
