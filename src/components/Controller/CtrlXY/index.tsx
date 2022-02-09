import React from 'react';
import { observer } from 'mobx-react-lite';
// import { useStores } from '../../../hooks/useStores';
import './styles.scss';
import Canvas from "../../Canvas";

type Props = {
  channelNames: string[],
}

const CtrlXY = (props:Props) => {
  // const { userStore } = useStores();

  const { channelNames } = props;

  const draw = (ctx:any, frameCount:any) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = '#000000'
    ctx.beginPath()
    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    ctx.fill()
  }

  return (
    <div className="CtrlXY">
      <Canvas draw={draw} options={{ context: '2d' }} />
    </div>
  )
};

export default observer(CtrlXY);