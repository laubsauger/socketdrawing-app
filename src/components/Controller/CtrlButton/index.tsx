import React from 'react';
import { observer } from 'mobx-react-lite';

import './styles.scss';

type Props = {
  label: string,
  variant: 'black' | 'red' | 'green' | 'blue',
  channelName: string,
};

const CtrlButton = (props:Props) => {
  const { label, variant, channelName } = props;

  return (
    <button className={`btn btn-${variant}`}
            onClick={() => console.log('btn:onClick', channelName) }
    >
      { label }
    </button>
  )
};

export default observer(CtrlButton);