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

function getMousePosition(ev:MouseEvent|Touch, ref:any) {
  const x = ev.pageX - ref.current.offsetLeft;
  const y = ev.pageY - ref.current.offsetTop;

  const normalized_x = (x / ref.current.width);
  const normalized_y = (y / ref.current.height);

  return {
    x,
    y,
    normalized_x: normalized_x < 0 ? 0 : (normalized_x > 1 ? 1 : normalized_x),
    normalized_y: normalized_y < 0 ? 0 : (normalized_y > 1 ? 1 : normalized_y),
  }
}

function getTouchPosition(ev:TouchEvent, ref:any) {
  const firstTouch = ev.touches[0];

  const x = firstTouch.pageX - ref.current.offsetLeft;
  const y = firstTouch.pageY - ref.current.offsetLeft;

  const { devicePixelRatio:ratio = 1 } = window;

  const normalized_x = (x / ref.current.width) * ratio;
  const normalized_y = (y / ref.current.height) * ratio;

  return {
    x,
    y,
    normalized_x: normalized_x < 0 ? 0 : (normalized_x > 1 ? 1 : normalized_x),
    normalized_y: normalized_y < 0 ? 0 : (normalized_y > 1 ? 1 : normalized_y),
  }
}

const drawCrossHair = (ctx:CanvasRenderingContext2D, canvasWidth:number, canvasHeight:number, pos:any, alpha:number) => {
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  // paint crosshair
  ctx.beginPath();
  ctx.moveTo(0, pos.y);
  ctx.lineTo(canvasWidth, pos.y);
  ctx.moveTo(pos.x, 0);
  ctx.lineTo(pos.x, canvasHeight);
  ctx.stroke();
  ctx.closePath();
}

const CtrlXY = (props:Props) => {
  const { channelNames, released } = props;
  const socket = useSocket();

  const [ isPainting, setIsPainting ] = useState(false);
  const [ pos, setPos ] = useState<any>({ x: 0.5, y: 0.5 });
  const [ ref, setRef ] = useState<any>({});

  const [ feedbackPositions, setFeedbackPositions ] = useState<any>([]);

  const draw = useCallback((ctx:any, frameCount:any) => {
    if (isPainting && pos && ref.current) {
      console.log('is drawing');
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // if (feedbackPositions) {
      //   for (let i = 0; i < feedbackPositions.length; i++) {
      //     console.log('feedback', i)
      //     drawCrossHair(ctx, ref.current.width, ref.current.height, feedbackPositions[feedbackPositions.length-1-i], 0.5 / feedbackPositions.length-1-i );
      //   }
      // }

      drawCrossHair(ctx, ref.current.width, ref.current.height, pos, 0.7);
      //
      // const newPosSet = [ ...feedbackPositions, pos ];
      // if (newPosSet.length > 100) {
      //   setFeedbackPositions([ ...feedbackPositions.slice(1), pos ]);
      // } else {
      //   setFeedbackPositions([ ...feedbackPositions, pos ]);
      // }
    }
  }, [ isPainting, pos, ref, feedbackPositions]);


  const emitPaintMessage = useCallback((mousePos) => {
    const posObj:any = {};
    posObj[channelNames.x] = mousePos.normalized_x;
    posObj[channelNames.y] = mousePos.normalized_y;

    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'paint',
      ...posObj,
    });
  }, [ socket, channelNames.x, channelNames.y ]);

  const emitMouseDownStateMessage = useCallback((state) => {
    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'mouseDown',
      state,
    });
  }, [ socket ]);

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
  }, [ref, pos, emitPaintMessage, emitMouseDownStateMessage]);

  const handlePaint = useCallback((ev) => {
    if (!isPainting) {
      return;
    }

    const mousePos = ev.type === 'touchmove' ? getTouchPosition(ev, ref) : getMousePosition(ev, ref);
    setPos(mousePos);
    emitPaintMessage(mousePos);
  }, [ ref, isPainting, emitPaintMessage ]);

  useEffect(() => {
    if (released) {
      console.log('painting stop');
      emitMouseDownStateMessage(0);
      setIsPainting(false);
    }
  }, [ released, emitMouseDownStateMessage ]);

  return (
    <div className="CtrlXY">
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