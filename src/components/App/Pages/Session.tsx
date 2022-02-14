import React from 'react';
import { observer } from 'mobx-react-lite';
import Controller from "../../Controller";

const Session: React.FC = (props) => {
  return (
    <div>
      <Controller />
    </div>
  )
};

export default observer(Session);