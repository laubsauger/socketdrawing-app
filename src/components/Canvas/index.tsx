import React, {MouseEventHandler, TouchEventHandler, useCallback, useEffect, useState} from 'react'
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
  //
  // const handleTouchMove = (ev:any) => {
  //   ev.preventDefault();
  //
  //   if (!canvasRef.current) {
  //     //@ts-ignore
  //     canvasRef.current = setTimeout(() => {
  //       // if (ev.target === canvasRef.current) {
  //         if (onTouchMove) {
  //           onTouchMove(ev);
  //         }
  //       // }
  //       //@ts-ignore
  //       clearTimeout(canvasRef.current);
  //       canvasRef.current = null;
  //     }, 500)
  //   }
  // }

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

      if (canvasRef && canvasRef.current) {
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

  useEffect(() => {
    let totalHeight = 0;

    if (socketStore.currentInstance?.settings.controls.text) {
      totalHeight += 70
    }

    if (socketStore.currentInstance?.settings.controls.buttons) {
      totalHeight += 93
    }

    setToolbarsHeight(`${totalHeight}px`);
  }, [ socketStore.currentInstance ])

  return <canvas className="position-fixed w-100"
                 style={{ height: `calc(100vh - ${toolbarsHeight})` }}
                 ref={canvasRef}
                 onMouseDown={onMouseDown}
                 onMouseUp={onMouseUp}
                 onMouseMove={onMouseMove}
                 {...rest}
  />;
}

export default observer(Canvas);