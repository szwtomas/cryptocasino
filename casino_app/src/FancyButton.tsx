import React from "react";

export function FancyButton (props: {onClick: () => void, text: string, disabled?: boolean, customStyle?: React.CSSProperties}) {
  return <button className="button-82-pushable" role="button" onClick={props.onClick} style={props.customStyle} >
  <span className="button-82-shadow"></span>
  <span className="button-82-edge"></span>
  <span className="button-82-front text" style={props.customStyle}>
    {props.text}
  </span>
</button>
}