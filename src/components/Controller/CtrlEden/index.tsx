import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import CtrlText from '../CtrlText';
import { CtrlButtons } from '../index';

type Props = {
  firedMouseUp: boolean
}
const CtrlEden = (props:Props) => {
  const [ showOtherControls, setShowOtherControls ] = useState(false)

  return (
    <div className="d-flex flex-column" style={{ height: '100%'}}>
      <CtrlText
        singleUse={true}
        label={'Name'}
        messageField='userName'
        onSubmitSuccess={() => setShowOtherControls(true)}
      />
      { showOtherControls
        ? (
          <div className="d-flex flex-column z-index-above">
            <div>
              <CtrlText
                label={'Text Prompt'}
                messageField={'textPrompt'}
                textArea={true}
              />
            </div>

            <div
              className="d-flex position-absolute justify-content-between py-2 px-2 w-100 bg-black"
              style={{ zIndex: 10, borderTop: '1px solid black', bottom: '0px' }}
            >
              {CtrlButtons(4, props.firedMouseUp)}
            </div>
          </div>
        )
        : null
      }
    </div>
  )
};

export default observer(CtrlEden);