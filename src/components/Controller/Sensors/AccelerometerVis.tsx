import React from 'react';
import { observer } from 'mobx-react-lite';
import { useSensors } from "../../../contexts/sensorsContext";
import Axis from "./Axis";

const AccelerometerVis = () => {
  const sensorData = useSensors();

  return (
    <div>
      <div>accelerometer</div>

      <div className="d-flex">
        <div className="d-flex me-3">
          <Axis label={'x'} value={sensorData.acceleration.x}  />
          <Axis label={'y'} value={sensorData.acceleration.y}  />
          <Axis label={'z'} value={sensorData.acceleration.z}  />
        </div>

        <div className="d-flex">
          <Axis label={'a/20'} value={sensorData.acceleration.rotation.alpha} multiplier={1/10} />
          <Axis label={'b/20'} value={sensorData.acceleration.rotation.beta}  multiplier={1/10}/>
          <Axis label={'g/20'} value={sensorData.acceleration.rotation.gamma} multiplier={1/10}/>
        </div>
      </div>
    </div>
  )
};

export default observer(AccelerometerVis);