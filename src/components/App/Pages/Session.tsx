import React, {useCallback} from 'react';
import { observer } from 'mobx-react-lite';
import Controller from "../../Controller";
import {Button} from "react-bootstrap";

const Session: React.FC = (props) => {

  const handleClick = useCallback((e) => {
    e.preventDefault();
    window.location.reload();
  }, []);

  return (
    <div className="Session">
      <div className="mt-2 p-2 small text-center position-fixed z-index-above">
        <Button variant="outline-warning" className="w-100" size={'sm'} onClick={handleClick}>Click here to join another free slot</Button>
      </div>
      <Controller />
    </div>
  )
};

export default observer(Session);