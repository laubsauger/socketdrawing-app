import React from 'react';
import { observer } from 'mobx-react-lite';

import './styles.scss';
import CtrlButton from "./CtrlButton";
import CtrlXY from "./CtrlXY";
import SessionInfo from "./SessionInfo";
import LogoBackground from "../LogoBackground";
import { useSocket } from "../../hooks/useSocket";

const Controller: React.FC = (props) => {
  // const { userStore } = useStores();
  const socket = useSocket();

  return (
    <div className="Controller">
      <LogoBackground />
      <SessionInfo />

      {/* //@todo: create buttons according to config */}
      <CtrlButton label="1" channelName="b1" variant="black" />
      <CtrlButton label="2" channelName="b2" variant="red" />
      <CtrlButton label="3" channelName="b3" variant="green" />
      <CtrlButton label="4" channelName="b4" variant="blue" />

      {/* //@todo: create xy controller canvas if configured */}
      <CtrlXY channelNames={['x','y']}/>
    </div>
  )
};

export default observer(Controller);