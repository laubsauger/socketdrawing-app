import React, { useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import './styles.scss';
import CtrlButton from './CtrlButton';
import CtrlXY from './CtrlXY';
import SessionInfo from './SessionInfo';
import LogoBackground from '../LogoBackground';
import { useSocket } from '../../hooks/useSocket';
import { useStores } from "../../hooks/useStores";
import config from "../../config";

const Controller = () => {
  const { socketStore } = useStores();
  const socket = useSocket();

  const handleConnected = useCallback(() => {
    console.log('socket::connected');
    socketStore.updateConnectionState({
      connected: true,
      connecting: false,
      failed: false,
      failReason: '',
    });

    socket.emit('JOIN_REQUEST', config.socketRoom);

    socketStore.updateConnectionState({
      joining: true,
    });
  }, [ socket, socketStore ]);

  const handleDisconnected = useCallback((data:any) => {
    console.log('socket::disconnected', data);

    socketStore.updateConnectionState({
      joining: false,
      joined: false,
      connected: false,
      connecting: false,
    });
  }, [ socketStore ]);

  const handleJoinAccepted = useCallback((data:any) => {
    console.log('socket::JOIN_ACCEPTED', data);

    socketStore.updateConnectionState({
      joining: false,
      joined: true,
      rejected: false,
      rejectReason: '',
    });
  }, [ socketStore ]);

  const handleJoinRejected = useCallback((data:any) => {
    console.log('socket::JOIN_REJECTED', data);
    socketStore.updateConnectionState({
      joining: false,
      rejected: true,
      rejectReason: data.reason
    });

    // @todo: react to this by showing retry button or something so a user can try again
  }, [ socketStore ]);

  const handleUserJoined = useCallback((data:any) => {
    console.log('socket::USER_JOINED', data);
    socketStore.updateRoomState({
      numCurrentUsers: data.usedSlots,
      numMaxUsers: data.maxClients,
    });

    // @todo: react to this by showing retry button or something so a user can try again
  }, [ socketStore ]);

  useEffect(() => {
    // @todo: move connection state logic to store; pure logic has no place here
    // @todo: useSocket there
    // @todo: BONUS: make sure to not instantiate on homepage but only on Join/Configure
    // @todo: keeps logic clearer, avoids callback memoization, allows access everywhere-ish
    socketStore.updateConnectionState({
      connecting: true,
    });

    socket.on('connect', handleConnected);
    socket.on('disconnect', handleDisconnected);
    socket.on('JOIN_ACCEPTED', handleJoinAccepted);
    socket.on('JOIN_REJECTED', handleJoinRejected);
    socket.on('USER_JOINED', handleUserJoined);

    return () => {
      socketStore.resetConnectionState();

      // @todo: close socket?

      socket.off('connect', handleConnected);
      socket.off('disconnect', handleDisconnected);
      socket.off('JOIN_ACCEPTED', handleJoinAccepted);
      socket.off('JOIN_REJECTED', handleJoinRejected);
      socket.off('USER_JOINED', handleUserJoined);
    };
  }, [socket, socketStore, handleConnected, handleDisconnected, handleJoinAccepted, handleJoinRejected]);

  return (
    <div className='Controller'>
      <LogoBackground />

      <SessionInfo />

      { socketStore.connectionState.joined &&
        <React.Fragment>
          {/* //@todo: create buttons according to config */}
          <CtrlButton channelName='b1' label='1' variant='black' />
          <CtrlButton channelName='b2' label='2' variant='red' />
          <CtrlButton channelName='b3' label='3' variant='green' />
          <CtrlButton channelName='b4' label='4' variant='blue' />

          {/* //@todo: create xy controller canvas if configured */}
          <CtrlXY channelNames={['x','y']}/>
        </React.Fragment>
      }
    </div>
  )
};

export default observer(Controller);