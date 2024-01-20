import React, { ReactNode, useCallback, useEffect, useState } from 'react';
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
  const { label, variant, channelName, released , type, children, onClick, className, style} = props;
  const [ pressed, setPressed ] = useState(false);
  const socket = useSocket();

  const handleBtnPress = useCallback(() => {
    setPressed(true);
    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'button',
      btnId: channelName,
      state: 1,
    });
    onClick && onClick()
  }, [ socket, channelName ]);

  useEffect(() => {
    if (typeof released === 'undefined') {
      return
    }

    if (pressed && released) {
      socket.emit('OSC_CTRL_MESSAGE', {
        message: 'button',
        btnId: channelName,
        state: 0,
      });

      setPressed(false);
    }
  }, [ socket, pressed, released, channelName ]);

  if (type === 'div') {
    return (
      <div
        className={className}
        onMouseDown={handleBtnPress}
        style={style}
      >
        {children ? children : label}
      </div>
    )
  }

  return (
    <button
      className={`CtrlButton CtrlButton-${variant}`}
      onMouseDown={handleBtnPress}
    >
      { label }
    </button>
  )
};

export default observer(CtrlButton);