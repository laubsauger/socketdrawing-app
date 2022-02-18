import React, {useCallback, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';

import './styles.scss';
import config from '../../config';
import CtrlButton from './CtrlButton';
import CtrlXY from './CtrlXY';
import SessionInfo from './SessionInfo';
import LogoBackground from '../LogoBackground';
import { useSocket } from '../../hooks/useSocket';
import { useStores } from '../../hooks/useStores';

const Controller = () => {
  const { socketStore } = useStores();
  const { pathname, search } = useLocation();
  const socket = useSocket();

  const [ wantsSlot, setWantsSlot ] = useState(0);
  const [ firedMouseUp, setFiredMouseUp ] = useState(false);

  useEffect(() => {
    const query = queryString.parse(search);
    if (query.slot) {
      setWantsSlot(Number(query.slot));
    }
  }, [ pathname, search ]);

  const handleConnected = useCallback(() => {
    console.log('socket::connected');

    socketStore.updateConnectionState({
      connected: true,
      connecting: false,
      failed: false,
      failReason: '',
    });

    socket.emit('USER_JOIN_REQUEST', {
      room: config.socketRoom,
      wantsSlot: wantsSlot,
    });

    socketStore.updateConnectionState({
      joining: true,
    });
  }, [ socket, socketStore, wantsSlot ]);

  const handleDisconnected = useCallback((data:any) => {
    console.log('socket::disconnected', data);
    socketStore.resetConnectionState();
  }, [ socketStore ]);

  const handleJoinAccepted = useCallback((data:any) => {
    console.log('socket::USER_JOIN_ACCEPTED', data);

    socketStore.updateConnectionState({
      joining: false,
      joined: true,
      rejected: false,
      rejectReason: '',
    });

    socketStore.updateRoomState({
      currentSlot: data.userSlot,
    });
  }, [ socketStore ]);

  const handleJoinRejected = useCallback((data:any) => {
    console.log('socket::USER_JOIN_REJECTED', data);

    socketStore.updateConnectionState({
      joining: false,
      rejected: true,
      rejectReason: data.reason
    });
  }, [ socketStore ]);

  const handleUserJoined = useCallback((data:any) => {
    console.log('socket::USER_JOINED', data);

    socketStore.updateRoomState({
      numCurrentUsers: data.usedSlots,
      numMaxUsers: data.maxSlots,
    });
  }, [ socketStore ]);

  const handleUserLeft = useCallback((data:any) => {
    console.log('socket::USER_LEFT', data);

    socketStore.updateRoomState({
      numCurrentUsers: data.usedSlots,
      numMaxUsers: data.maxSlots,
    });
  }, [ socketStore ]);

  useEffect(() => {
    socket.on('connect', handleConnected);
    socket.on('disconnect', handleDisconnected);
    socket.on('USER_JOIN_ACCEPTED', handleJoinAccepted);
    socket.on('USER_JOIN_REJECTED', handleJoinRejected);
    socket.on('USER_JOINED', handleUserJoined);
    socket.on('USER_LEFT', handleUserLeft);

    return () => {
      // socketStore.resetConnectionState();

      socket.off('connect', handleConnected);
      socket.off('disconnect', handleDisconnected);
      socket.off('USER_JOIN_ACCEPTED', handleJoinAccepted);
      socket.off('USER_JOIN_REJECTED', handleJoinRejected);
      socket.off('USER_JOINED', handleUserJoined);
      socket.off('USER_LEFT', handleUserLeft);
    };
  }, [socket, socketStore, handleConnected, handleDisconnected, handleJoinAccepted, handleJoinRejected, handleUserJoined, handleUserLeft]);

  const handleMouseUp = useCallback((data:any) => {
    console.log('UI::mouseUp', data);
    setFiredMouseUp(true);
    setFiredMouseUp(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchend', handleMouseUp)
    };
  }, [ handleMouseUp ])

  return (
    <div className='Controller'>
      <LogoBackground />
      <SessionInfo />

      { socketStore.connectionState.joined &&
        <React.Fragment>
          {/* //@todo: create xy controller canvas if configured */}
          <CtrlXY channelNames={{ x: 'x', y: 'y'}} released={firedMouseUp}/>
          {/* //@todo: create buttons according to config */}
          <div className="d-flex justify-content-between pb-3 px-3 bottom-0 position-fixed w-100" style={{ zIndex: 10 }}>
            <CtrlButton channelName='b1' label='1' variant='black' released={firedMouseUp}/>
            <CtrlButton channelName='b2' label='2' variant='red' released={firedMouseUp}/>
            <CtrlButton channelName='b3' label='3' variant='green' released={firedMouseUp}/>
            <CtrlButton channelName='b4' label='4' variant='blue' released={firedMouseUp}/>
          </div>
        </React.Fragment>
      }
    </div>
  )
};

export default observer(Controller);