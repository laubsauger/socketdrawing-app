import React, {MouseEventHandler, TouchEventHandler, useCallback, useEffect} from 'react'
import useCanvas from "../../hooks/useCanvas";

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
  const { draw, options, setRef, onMouseDown, onMouseMove, onMouseUp, onTouchStart, onTouchMove, onTouchEnd, ...rest } = props;
  const { context } = options;
  const canvasRef = useCanvas(draw, { context });

  const touchStartListener = useCallback((e:any) => {
      if (e.target === canvasRef.current) {
        e.preventDefault();

        if (onTouchStart) {
          onTouchStart(e);
        }
      }
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

  useEffect(() => {
    if (setRef) {
      setRef(canvasRef);
  //
      if (canvasRef && canvasRef.current) {
        // canvasRef.current.addEventListener('mousemove', onMouseMove, { passive: true })
        document.body.addEventListener('touchstart', touchStartListener, { passive: false })
        document.body.addEventListener('touchmove', touchMoveListener, { passive: false })
        document.body.addEventListener('touchend', touchEndListener, { passive: false })
      }
    }
    //
    return () => {
      document.body.removeEventListener('touchstart', touchStartListener);
      document.body.removeEventListener('touchmove', touchMoveListener);
      document.body.removeEventListener('touchend', touchEndListener);
    }
  }, [ setRef, canvasRef, onTouchMove ]);

  return <canvas className="position-fixed w-100"
                 style={{ minHeight: 'calc(100vh - 163px)' }}
                 ref={canvasRef}
                 onMouseDown={onMouseDown}
                 onMouseUp={onMouseUp}
                 onMouseMove={onMouseMove}
                 {...rest}
  />;
}

export default Canvas;