import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import React from 'react';
import { observer } from 'mobx-react-lite';

const Timer = ({ currentTime, duration }: { currentTime: number|undefined, duration: number|undefined }) => {
  return (
    <div className="ms-auto me-2 mb-1 overflow-hidden flex-grow-1 d-flex align-items-center"
         style={{ width: '44px', height: '44px' }}>
      <CircularProgressbar
        value={currentTime && duration ? (currentTime / duration * 100) : 0}
        text={`${(currentTime || 0).toFixed(0)}s`}
        counterClockwise={true}
        className="mw-100 mh-100 fw-bold font-monospace"
        strokeWidth={50}
        styles={buildStyles({
          strokeLinecap: "butt",
          textColor: '#fff',
          textSize: '24px',
          backgroundColor: '#222',
          trailColor: '#222',
          pathColor: currentTime ? currentTime < 15 ? '#880000' : currentTime < 30 ? '#a84f17' : currentTime < 60 ? '#0F4796' : '' : ''
        })}/>
    </div>
  )
}

export default observer(Timer)