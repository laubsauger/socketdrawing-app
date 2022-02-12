import React, {useCallback, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import './styles.scss';
import Canvas from "../../Canvas";
import {useSocket} from "../../../hooks/useSocket";

type Props = {
  channelNames: {
    x: string,
    y: string
  },
  released: boolean,
}

function getMousePosition(ev:MouseEvent, ref:any) {
  const x = ev.pageX - ref.current.offsetLeft;
  const y = ev.pageY - ref.current.offsetTop;

  return {
    x,
    y,
    normalized_x: x / ref.current.width,
    normalized_y: y / ref.current.height,
  }
}

function getTouchPosition(ev:TouchEvent, ref:any) {
  const x = ev.touches[0].pageX - ref.current.offsetLeft;
  const y = ev.touches[0].pageY - ref.current.offsetTop;

  return {
    x,
    y,
    normalized_x: x / ref.current.width,
    normalized_y: y / ref.current.height,
  }
}

const CtrlXY = (props:Props) => {
  const { channelNames, released } = props;
  const socket = useSocket();

  const [ isPainting, setIsPainting ] = useState(false);
  const [ pos, setPos ] = useState<any>();
  const [ ref, setRef ] = useState<any>({});

  const draw = useCallback((ctx:any, frameCount:any) => {
    if (isPainting && pos && ref.current) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';

      // paint crosshair
      ctx.beginPath();
      ctx.moveTo(0, pos.y);
      ctx.lineTo(ref.current.width, pos.y);
      ctx.moveTo(pos.x, 0);
      ctx.lineTo(pos.x, ref.current.height);
      ctx.stroke();
      ctx.closePath();
    }
  }, [ isPainting, pos, ref ]);

  const handleDragStart = useCallback((ev) => {
    if (!ref || ev.target !== ref.current) {
      console.log('no ref or ref current is not target, dont draw');
      return;
    }

    emitMouseDownStateMessage(1);

    console.log('painting...');
    setIsPainting(true);
    const mousePos = ev.type === 'touchstart' ? getTouchPosition(ev, ref) : getMousePosition(ev, ref);

    if (pos === mousePos) {
      console.log('equal old and new pos, dont redraw');
    } else {
      setPos(mousePos);
      emitPaintMessage(mousePos);
    }
  }, [ref, pos]);

  const handlePaint = useCallback((ev) => {
    if (!isPainting) {
      return;
    }

    const mousePos = ev.type === 'touchmove' ? getTouchPosition(ev, ref) : getMousePosition(ev, ref);
    setPos(mousePos);
    emitPaintMessage(mousePos);
  }, [ ref, isPainting, socket, channelNames ]);

  const emitPaintMessage = useCallback((mousePos) => {
    const posObj:any = {};
    posObj[channelNames.x] = mousePos.normalized_x;
    posObj[channelNames.y] = mousePos.normalized_y;

    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'paint',
      ...posObj,
    });
  }, [ socket ]);

  const emitMouseDownStateMessage = useCallback((state) => {
    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'mouseDown',
      state,
    });
  }, [ socket ]);

  useEffect(() => {
    if (isPainting && released) {
      console.log('painting stop');
      setIsPainting(false);
    }

    if (released) {
      emitMouseDownStateMessage(0);
    }
  }, [ socket, isPainting, released ]);

  return (
    <div className="CtrlXY"
    >
      <Canvas draw={draw} options={{ context: '2d' }}
              setRef={setRef}
              onMouseDown={handleDragStart}
              onMouseMove={handlePaint}
              onTouchStart={handleDragStart}
              onTouchMove={handlePaint}
      />
    </div>
  )
};

export default observer(CtrlXY);