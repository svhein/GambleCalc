import React from "react";
import Svg, { Defs, G, Path, Rect, Circle } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: style, title */
const SVGComponent = (props) => (
  <Svg
    width="50px"
    height="50px"
    viewBox="0 0 256 256"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      backgroundColor: "#04001f",
      color: 'white'
    }}
    {...props}
  >
    <Defs></Defs>
    <G id="Layer_2" data-name="Layer 2" fill="white">
      <Path className="cls-1" d="M24,89.8a20,20,0,1,0,40,0Z" />
      <Path
        className="cls-2"
        d="M24,89.8c0,7.84,7.59,14.2,17,14.2s17-6.36,17-14.2Z"
      />
      <Path
        className="cls-3"
        d="M44,111.8a22,22,0,0,1-22-22,2,2,0,0,1,2-2H64a2,2,0,0,1,2,2A22,22,0,0,1,44,111.8Zm-17.89-20a18,18,0,0,0,35.78,0Z"
      />
      <Path
        className="cls-3"
        d="M64,91.8a2,2,0,0,1-1.81-1.15L44,51.66l-18.19,39A2,2,0,0,1,22.19,89l20-42.88a2,2,0,0,1,3.63,0L65.81,89A2,2,0,0,1,64,91.8Z"
      />
      <Path className="cls-1" d="M192,123.94a20,20,0,0,0,40,0Z" />
      <Path
        className="cls-2"
        d="M192,123.94c0,7.84,7.59,14.2,17,14.2s17-6.36,17-14.2Z"
      />
      <Path
        className="cls-3"
        d="M212,145.95a22,22,0,0,1-22-22,2,2,0,0,1,2-2h40a2,2,0,0,1,2,2A22,22,0,0,1,212,145.95Zm-17.89-20a18,18,0,0,0,35.78,0Z"
      />
      <Path
        className="cls-3"
        d="M232,125.95a2,2,0,0,1-1.81-1.15L212,85.8l-18.19,39a2,2,0,0,1-3.62-1.69l20-42.88a2,2,0,0,1,3.63,0l20,42.88a2,2,0,0,1-1.81,2.85Z"
      />
      <Path
        className="cls-3"
        d="M212,83.07a2,2,0,0,1-.4,0L43.6,48.89A2,2,0,1,1,44.4,45l168,34.14a2,2,0,0,1-.4,4Z"
      />
      <Rect className="cls-4" x={122} y={64} width={12} height={136} />
      <Rect className="cls-5" x={122} y={89.32} width={6} height={110.68} />
      <Path
        className="cls-3"
        d="M134,202H122a2,2,0,0,1-2-2V64a2,2,0,0,1,2-2h12a2,2,0,0,1,2,2V200A2,2,0,0,1,134,202Zm-10-4h8V66h-8Z"
      />
      <Circle className="cls-6" cx={128} cy={64} r={20} />
      <Circle className="cls-7" cx={124.53} cy={60.53} r={16.53} />
      <Path
        className="cls-3"
        d="M128,86a22,22,0,1,1,22-22A22,22,0,0,1,128,86Zm0-40a18,18,0,1,0,18,18A18,18,0,0,0,128,46Z"
      />
      <Rect className="cls-6" x={44} y={200} width={168} height={12} />
      <Rect className="cls-7" x={44} y={200} width={161.27} height={6} />
      <Path
        className="cls-3"
        d="M212,214H44a2,2,0,0,1-2-2V200a2,2,0,0,1,2-2H212a2,2,0,0,1,2,2v12A2,2,0,0,1,212,214ZM46,210H210v-8H46Z"
      />
    </G>
  </Svg>
);
export default SVGComponent;
