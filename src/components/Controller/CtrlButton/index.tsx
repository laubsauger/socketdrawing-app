import React, {
  MouseEvent,
  MutableRefObject,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { observer } from 'mobx-react-lite';

import './styles.scss';
import { useSocket } from "../../../hooks/useSocket";
import { PlayerColor } from '../index';

type Props = {
  label?: string,
  type: 'div'|'button',
  variant?: PlayerColor
  channelName: string,
  released?: boolean,
  children?: ReactNode
  onClick?: () => void
  style?: any
  className?: string
};

const CtrlButton = (props:Props) => {
  console.log(props)
  const { label, variant, channelName, released , type, children, onClick, className, style} = props;
  const [ pressed, setPressed ] = useState(false);
  const socket = useSocket();
  const buttonRef: MutableRefObject<HTMLDivElement|HTMLButtonElement|undefined> = useRef()
  const handleBtnPress = useCallback((e: React.MouseEvent<HTMLButtonElement|HTMLDivElement>) => {
    e.preventDefault()
    setPressed(true);
    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'button',
      btnId: channelName,
      state: 1,
    });
    onClick && onClick()
  }, [ socket, channelName ]);

  useEffect(() => {
    if (!buttonRef?.current) {
      return
    }

    const contextMenuHandler = (e: React.MouseEvent<HTMLButtonElement|HTMLDivElement>) => {
      e.preventDefault();
    }

    // attach contextmenu event listener to button ref
    //@ts-ignore
    buttonRef.current.addEventListener('contextmenu', contextMenuHandler)

    return () => {
      //@ts-ignore
      buttonRef?.current?.removeEventListener('contextmenu', contextMenuHandler)
    }
  }, [buttonRef]);

  useEffect(() => {
    console.log('useEffect', { released, pressed, channelName })
    if (typeof released === 'undefined') {
      return
    }

    console.log('trigger delayed release')
    const delayedReleaseHandler = setTimeout(() => {
      if (pressed && released) {
        console.log('send event')
        socket.emit('OSC_CTRL_MESSAGE', {
          message: 'button',
          btnId: channelName,
          state: 0,
        });

        setPressed(false);
      }
    }, 250)

    return () => {
      clearTimeout(delayedReleaseHandler);
    }
  }, [ socket, pressed, released, channelName ]);

  if (type === 'div') {
    return (
      <div
        ref={buttonRef as MutableRefObject<HTMLDivElement>}
        className={className}
        onMouseDown={handleBtnPress}
        style={style}
      >
        {children ? children : (label || channelName)}
      </div>
    )
  }

  return (
    <button
      ref={buttonRef as MutableRefObject<HTMLButtonElement>}
      className={`CtrlButton ${variant ? `CtrlButton-${variant}` : ''}`}
      onMouseDown={handleBtnPress}
    >
      { label || channelName }
    </button>
  )
};

export default observer(CtrlButton);