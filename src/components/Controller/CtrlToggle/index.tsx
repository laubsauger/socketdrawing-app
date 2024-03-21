import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import './styles.scss';
import { useSocket } from "../../../hooks/useSocket";
import { PlayerColor } from '../index';
import { ToggleButton } from 'react-bootstrap';

type Props = {
  label?: string,
  type: 'div'|'button',
  variant?: PlayerColor
  channelName: string,
  released?: boolean,
  children?: ReactNode
  onClick?: () => void
  style?: any
  size?: "small"|"medium"|"large",
  className?: string
};

const CtrlToggle = (props:Props) => {
  const { label, variant, channelName, onClick, className, style} = props;
  const socket = useSocket();
  const [checked, setChecked] = useState(false);

  const styles = {
    ...style,
    ...(props.size ? props.size === 'large' ? {"height": "6rem"} : '' : {})
  }

  useEffect(() => {
      socket.emit('OSC_CTRL_MESSAGE', {
        message: 'toggle',
        btnId: channelName,
        state: checked ? 1 : 0,
      });
      onClick && onClick()
  }, [channelName, onClick, checked]);

  return (
    <ToggleButton
      id={channelName}
      type="checkbox"
      variant={variant}
      checked={checked}
      value="1"
      onChange={(e) => setChecked(e.currentTarget.checked)}
      className={`CtrlToggle ${variant ? `CtrlToggle-${variant}` : ''} ${checked ? 'CtrlToggle--checked' : ''} ${className ? className : ''}`}
      style={styles}
    >
      <div>{label}</div> <div className={`fst-italic h-full d-flex ${!checked ? 'text-muted' : 'text-black'}`}>{checked ? 'on' : 'off'}</div>
    </ToggleButton>
  )
};

export default observer(CtrlToggle);