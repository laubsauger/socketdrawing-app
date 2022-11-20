import React, {useCallback, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import {useParams} from 'react-router-dom';

import './styles.scss';
import config from '../../config';
import CtrlButton from './CtrlButton';
import CtrlXY from './CtrlXY';
import SessionInfo from './SessionInfo';
import LogoBackground from '../LogoBackground';
import { useSocket } from '../../hooks/useSocket';
import { useStores } from '../../hooks/useStores';
import CtrlText from "./CtrlText";
import Sensors from "./Sensors";

const CtrlButtons = (numButtons:number, eventHandler:any) => {
  let content = [];
  for (let i = 1; i <= numButtons; i++) {
    content.push(<CtrlButton key={i} channelName={`b${i}`} label={String(i)} variant='black' released={eventHandler}/>);
  }
  return content;
}

const Controller = () => {
  // const { pathname, search } = useLocation();
  const socket = useSocket();
  const { socketStore } = useStores();
  const { instanceId, slotId } = useParams();

  const [ isValid, setIsValid ] = useState(false);
  const [ firedMouseUp, setFiredMouseUp ] = useState(false);
  const [ alreadyConnected, setAlreadyConnected ] = useState(socketStore.connectionState.connected);

  useEffect(() => {
    if (!socketStore.availableInstances.length) {
        fetch(`${config.socketServer}/api/instances.json`)
          .then(response => response.json())
          .then(data => {
            socketStore.setAvailableInstances(data);
          }).catch(() => {
          socketStore.setAvailableInstances([]);
        });
    }
  }, [ socketStore, socketStore.availableInstances ])

  useEffect(() => {
    if (!socketStore.availableInstances.length) {
      return;
    }

    console.log('has instances', instanceId, socketStore.availableInstances)

    // @todo: improve validation to check against instance config from api
    // @todo: add error message and redirect to /join on error
    if (!instanceId || !slotId) {
      setIsValid(false);
      socketStore.setCurrentInstance(undefined);
    } else {
      const selectedInstance = socketStore.availableInstances.filter(item => item.id === Number(instanceId))[0];
      setIsValid(true);
      socketStore.setCurrentInstance(selectedInstance);
      console.log(instanceId, socketStore.availableInstances)
    }
  }, [ instanceId, slotId, socketStore, socketStore.availableInstances ]);

  const sendJoinRequest = useCallback(() => {
    if (!socketStore.currentInstance) {
      return;
    }

    console.log(socketStore.currentInstance)

    socket.emit('USER_JOIN_REQUEST', {
      instanceId: instanceId,
      room: `${config.socketRoomPrefix}:${instanceId}`,
      wantsSlot: slotId,
    });

    socketStore.updateConnectionState({
      joining: true,
    });
  }, [ socket, socketStore, slotId, instanceId, socketStore.currentInstance ]);

  useEffect(() => {
    if (socketStore.currentInstance && socketStore.connectionState.connected) {
      console.log('sending join request')
      sendJoinRequest();
    }
  }, [ alreadyConnected, sendJoinRequest, socketStore.connectionState.connected, socketStore.currentInstance ]);

  const handleConnected = useCallback(() => {
    console.log('socket::connected');
    setAlreadyConnected(false);

    socketStore.updateConnectionState({
      connected: true,
      connecting: false,
      failed: false,
      failReason: '',
    });

    // sendJoinRequest();
  }, [ socketStore, sendJoinRequest ]);

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

    document.body.classList.add('prevent-scroll-drag');

    return () => {
      // socketStore.resetConnectionState();

      socket.off('connect', handleConnected);
      socket.off('disconnect', handleDisconnected);
      socket.off('USER_JOIN_ACCEPTED', handleJoinAccepted);
      socket.off('USER_JOIN_REJECTED', handleJoinRejected);
      socket.off('USER_JOINED', handleUserJoined);
      socket.off('USER_LEFT', handleUserLeft);

      document.body.classList.remove('prevent-scroll-drag');
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

      { socketStore.connectionState.joined &&
        <React.Fragment>
          { socketStore.currentInstance &&
            <>
              { (socketStore.currentInstance.settings.controls.gyroscope || socketStore.currentInstance.settings.controls.accelerometer) &&
                <Sensors gyroscope={socketStore.currentInstance.settings.controls.gyroscope} accelerometer={socketStore.currentInstance.settings.controls.accelerometer}/>
              }
              { socketStore.currentInstance.settings.controls.text &&
                <CtrlText label={'Text Prompt'} />
              }
              { socketStore.currentInstance.settings.controls.xy &&
                <CtrlXY channelNames={{ x: 'x', y: 'y'}} released={firedMouseUp}/>
              }
              { socketStore.currentInstance.settings.controls.buttons > 0 &&
                <div className="d-flex justify-content-between py-2 px-2 bottom-0 position-fixed w-100 bg-black" style={{ zIndex: 10, borderTop: '1px solid black' }}>
                  {CtrlButtons(socketStore.currentInstance.settings.controls.buttons, firedMouseUp)}
                </div>
              }
            </>
          }
        </React.Fragment>
      }

      <SessionInfo />
    </div>
  )
};

export default observer(Controller);