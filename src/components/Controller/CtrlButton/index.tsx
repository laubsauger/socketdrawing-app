import React, {useCallback, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';

import './styles.scss';
import { useSocket } from "../../../hooks/useSocket";

type Props = {
  label: string,
  variant: 'black' | 'red' | 'green' | 'blue',
  channelName: string,
  released: boolean,
};

const CtrlButton = (props:Props) => {
  const { label, variant, channelName, released } = props;
  const [ pressed, setPressed ] = useState(false);
  const socket = useSocket();

  const handleBtnPress = useCallback(() => {
    setPressed(true);
    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'button',
      btnId: channelName,
      state: 1,
    });
  }, [ socket, channelName ]);

  useEffect(() => {
    if (pressed && released) {
      socket.emit('OSC_CTRL_MESSAGE', {
        message: 'button',
        btnId: channelName,
        state: 0,
      });

      setPressed(false);
    }
  }, [ socket, pressed, released, channelName ]);

  return (
    <button className={`CtrlButton CtrlButton-${variant}`}
            onMouseDown={handleBtnPress}
    >
      { label }
    </button>
  )
};

export default observer(CtrlButton);