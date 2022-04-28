import React from "react";

export default ({ color, size }) => {
  let style = {
    backgroundColor: "#6ca6fd",
    width: 40,
    height: 40,
  };

  if (typeof color !== "undefined") {
    style.color = color;
  }
  if (typeof size !== "undefined") {
    style.width = size;
    style.height = size;
  }
  return <div className="bounder" style={style}></div>;
};
