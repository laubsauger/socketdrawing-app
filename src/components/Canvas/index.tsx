import React, { MouseEventHandler, TouchEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import useCanvas from "../../hooks/useCanvas";
import {useStores} from "../../hooks/useStores";
import {observer} from "mobx-react-lite";

type Props = {
  draw: Function,
  options: { context: any },
  setRef?: any,
  onTouchStart?: TouchEventHandler,
  onTouchMove?: TouchEventHandler,
  onTouchEnd?: TouchEventHandler,
  onMouseDown: MouseEventHandler,
  onMouseMove: MouseEventHandler,
  onMouseUp?: MouseEventHandler,
}

const Canvas = (props:Props) => {
  const { socketStore } = useStores();
  const { draw, options, setRef, onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd, ...rest } = props;
  const { context } = options;
  const canvasRef = useCanvas(draw, { context });
  const [ toolbarsHeight, setToolbarsHeight ] = useState<string>('0px');

  const touchStartListener = useCallback((e:any) => {
    // if (e.target === canvasRef.current) {
      e.preventDefault();
      if (onTouchStart) {
        onTouchStart(e);
      }
    // }
  }, [onTouchStart]);

  const touchMoveListener = useCallback((e:any) => {
    e.preventDefault();
    if (e.target === canvasRef.current) {
      if (onTouchMove) {
        onTouchMove(e);
      }
    }
  }, [ onTouchMove ]);

  const touchEndListener = useCallback((e:any) => {
    if (e.target === canvasRef.current) {
      e.preventDefault();
      if (onTouchEnd) {
        onTouchEnd(e);
      }
    }
  }, [ onTouchEnd ]);


  const mouseDownListener = useCallback((e:any) => {
    if (e.target === canvasRef.current) {
      if (onMouseDown) {
        onMouseDown(e);
      }
    }
  }, [onMouseDown]);

  const mouseMoveListener = useCallback((e:any) => {
    if (e.target === canvasRef.current) {
      if (onMouseMove) {
        onMouseMove(e);
      }
    }
  }, [onMouseMove]);

  const mouseUpListener = useCallback((e:any) => {
    if (e.target === canvasRef.current) {
      if (onMouseUp) {
        onMouseUp(e);
      }
    }
  }, [onMouseUp]);

  useEffect(() => {
    if (setRef) {
      setRef(canvasRef);
      if (canvasRef && canvasRef.current) {
        canvasRef.current.addEventListener('touchstart', touchStartListener, { passive: false })
        canvasRef.current.addEventListener('touchmove', touchMoveListener, { passive: false })
        canvasRef.current.addEventListener('touchend', touchEndListener, { passive: false })
        canvasRef.current.addEventListener('mousedown', mouseDownListener);
        canvasRef.current.addEventListener('mousemove', mouseMoveListener);
        canvasRef.current.addEventListener('mouseup', mouseUpListener);
      }
    }
    return () => {
      canvasRef?.current?.removeEventListener('touchstart', touchStartListener);
      canvasRef?.current?.removeEventListener('touchmove', touchMoveListener);
      canvasRef?.current?.removeEventListener('touchend', touchEndListener);
      canvasRef?.current?.removeEventListener('mousedown', mouseDownListener);
      canvasRef?.current?.removeEventListener('mousemove', mouseMoveListener);
      canvasRef?.current?.removeEventListener('mouseup', mouseUpListener);
    }
  }, [ setRef, canvasRef, onTouchMove, mouseDownListener, mouseMoveListener, mouseUpListener ]);

  // useEffect(() => {
  //   let totalHeight = 0;
  //
  //   if (socketStore.currentInstance?.settings.controls.texts && socketStore.currentInstance?.settings.controls.texts?.length > 1) {
  //     totalHeight += 108
  //   }
  //
  //   if (socketStore.currentInstance?.settings.controls.buttons || socketStore.currentInstance?.settings.controls.eden) {
  //     totalHeight += 93
  //   }
  //   setToolbarsHeight(`${totalHeight}px`);
  // }, [ socketStore.currentInstance ]);

  return (
    <canvas
      className="border-bottom border-top border-secondary"
      style={{ width: '100%' }}
      ref={canvasRef}
      {...rest}
    />
  )
}
export default observer(Canvas);