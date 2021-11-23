import React, { useState } from 'react';
import './App.css';

import { Wheel } from 'react-custom-roulette';
import { FancyButton } from './FancyButton';

export const RouletteWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  
  const data = Array.from(Array(34).keys()).map(n => ({option: n.toString()}));

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

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * data.length)
    setPrizeNumber(newPrizeNumber)
    setMustSpin(true)
  }



  return (
    <div >
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
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

          onStopSpinning={() => {
            setMustSpin(false)
          }}
        />
        <FancyButton text={"SPIN"} onClick={handleSpinClick}/>
    </div>
  );
};

