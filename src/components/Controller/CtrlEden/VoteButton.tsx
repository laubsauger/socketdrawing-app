import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useSocket } from "../../../hooks/useSocket";
import { Button } from 'react-bootstrap';

type Props = {
  label?: string,
  className?: string,
  released?: boolean,
  onClick?: () => void
  selectedResult: any,
  resultInView: any,
};

const VoteButton = (props:Props) => {
  const { released, onClick, selectedResult, resultInView, className} = props;
  const [ pressed, setPressed ] = useState(false);
  const socket = useSocket();

  const handleBtnPress = useCallback(() => {
    console.log(selectedResult, resultInView)
    setPressed(true);
    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'button',
      btnId: `b${resultInView.player_index}`,
      state: 1,
    });
    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'button',
      btnId: `b${resultInView.player_index}`,
      state: 0,
    });

    setPressed(false);
    onClick && onClick()
  }, [ onClick, socket, resultInView, selectedResult ]);
  //
  // useEffect(() => {
  //   console.log('fireMouseUp')
  //   // if (typeof released === 'undefined') {
  //   //   return
  //   // }
  //
  //   if (pressed && released) {
  //     socket.emit('OSC_CTRL_MESSAGE', {
  //       message: 'button',
  //       btnId: `b${resultInView.player_index}`,
  //       state: 0,
  //     });
  //
  //     setPressed(false);
  //   }
  // }, [socket, pressed, released ]);

  return (
    <Button
      className={`w-100 ${className ? className : ''}`}
      onClick={handleBtnPress}
      variant={selectedResult ? (selectedResult.player_index !== resultInView.player_index ? "outline-success" : "success") : "outline-success"}
    >
      {selectedResult ? (selectedResult.player_index !== resultInView.player_index ? "Vote for this" : "Voted!") : "Vote for this"}
    </Button>
  )
};

export default observer(VoteButton);