import React from 'react'
import useCanvas from "../../hooks/useCanvas";

type Props = {
  draw: Function,
  options: { context: any },
}

const Canvas = (props:Props) => {
  const { draw, options, ...rest } = props;
  const { context } = options;
  const canvasRef = useCanvas(draw, { context });

  return <canvas className="position-fixed w-100 h-100" ref={canvasRef} {...rest}/>;
}

export default Canvas