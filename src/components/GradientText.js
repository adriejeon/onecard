import React from "react";
import { Text } from "react-native";

const GradientText = ({ style, children }) => {
  return (
    <Text
      style={[
        style,
        {
          color: "#612CC9",
          textShadowColor: "#C53D93",
          textShadowOffset: { width: 1, height: 0 },
          textShadowRadius: 2,
        },
      ]}
    >
      {children}
    </Text>
  );
};

export default GradientText;
