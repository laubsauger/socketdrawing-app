import React from 'react';
import { observer } from 'mobx-react-lite';
// import { useStores } from '../../../hooks/useStores';
import './styles.scss';
import LogoBackground from "../../LogoBackground";

type Props = {
  channelNames: string[],
}

const CtrlXY = (props:Props) => {
  // const { userStore } = useStores();

  const { channelNames } = props;

  return (
    <div className="CtrlXY">
      <div className="position-fixed w-100 h-100">Canvas { channelNames }</div>
      <LogoBackground />
    </div>
  )
};

export default observer(CtrlXY);