import React, { useEffect, useState } from 'react';
import './App.css';

import { Wheel } from 'react-custom-roulette';

let data = Array.from(Array(37).keys()).map(n => ({option: (n).toString(), style: {backgroundColor: n == 0 ? "green" : undefined}}));

export const RouletteWheel = (props: { winningNumber?: number, spin: boolean, onStopSpinning: () => void}) => {  
 

  const backgroundColors = ['red', 'black'];
  const textColors = ['white'];
  const outerBorderColor = 'black';
  const outerBorderWidth = 10;
  const innerBorderColor = 'black';
  const innerBorderWidth = 5;
  const innerRadius = 10;
  const radiusLineColor = 'gray';
  const radiusLineWidth = 2;
  const fontSize = 17;
  const textDistance = 70;




  return (
    <div style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
        <Wheel
          mustStartSpinning={props.spin}
          prizeNumber={props.winningNumber ? props.winningNumber : 0}
          data={data}
          backgroundColors={backgroundColors}
          textColors={textColors}
          fontSize={fontSize}
          outerBorderColor={outerBorderColor}
          outerBorderWidth={outerBorderWidth}
          innerRadius={innerRadius}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={innerBorderWidth}
          radiusLineColor={radiusLineColor}
          radiusLineWidth={radiusLineWidth}
          perpendicularText
          textDistance={textDistance}

          onStopSpinning={props.onStopSpinning}
        />
    </div>
  );
};

