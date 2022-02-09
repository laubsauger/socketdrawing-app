import React from 'react';
import { observer } from 'mobx-react-lite';
// import { useStores } from '../../../hooks/useStores';

import './styles.scss';
import CtrlButton from "./CtrlButton";
import CtrlXY from "./CtrlXY";
import SessionInfo from "./SessionInfo";

const Controller: React.FC = (props) => {
  // const { userStore } = useStores();

  return (
    <div className="Controller">
      {/* //@todo: create buttons according to config */}
      <CtrlButton label="1" channelName="b1" variant="black" />
      <CtrlButton label="2" channelName="b2" variant="red" />
      <CtrlButton label="3" channelName="b3" variant="green" />
      <CtrlButton label="4" channelName="b4" variant="blue" />

      {/* //@todo: create xy controller canvas if configured */}
      <CtrlXY channelNames={['x','y']}/>

      <SessionInfo />
    </div>
  )
};

export default observer(Controller);