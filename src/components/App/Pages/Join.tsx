import React from 'react';
import { observer } from 'mobx-react-lite';
import Controller from "../../Controller";

const Join: React.FC = (props) => {
  return (
    <div>
      <Controller />
    </div>
  )
};

export default observer(Join);