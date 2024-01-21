import React, { useState } from 'react'
import CtrlText from '../../CtrlText';
import { useStores } from '../../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { Button } from 'react-bootstrap';
import ConfirmStartModal from './ConfirmStartModal';

const Lounge = () => {
  const [ showConfirmModal, setShowConfirmModal ] = useState(false)
  const { socketStore, gameStore } = useStores()
  return (
    <div>
      <div className="text-center fw-bold py-2 bg-dark">Waiting Room</div>
      <div className="p-2">
        <div>
          Who are you?
        </div>
        <CtrlText
          singleUse={true}
          label={'Name'}
          messageField='userName'
          onSubmitSuccess={(name: string|null) => {
            gameStore.setUserName(name)
            // setShowWelcome(true)
          }}
        />
      </div>
      <div className="d-flex justify-content-end px-2">
        <ConfirmStartModal />
      </div>
      <hr className="m-2"/>
      <div>
        <div className="px-2 mb-2 d-flex justify-content-between">
          <span>Users</span>
          <span className="fs-6 text-light">{socketStore.roomState.users?.length} / {socketStore.roomState.numMaxUsers}</span>
        </div>
        <div className="m-0 px-3">
          <div className="limited-length-list" style={{ fontSize: '12px' }}>
            { socketStore.roomState.users?.map((user, index) =>(
              <div key={`${user.id}_${index}`}>
                <>
                  {user.id === socketStore.connectionState.clientId
                    ? <div className="text-info fw-bold">{user.client_index}:{user.name ? user.name : user.id.slice(0, 6)}</div>
                    : <div>{user.client_index}:{user.name ? user.name : user.id.slice(0, 6)}</div>
                  }
                </>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/*<Toasty title={`Hi, ${gameStore.userName}!`} text={"Take a seat, we'll get going soon"} visible={showWelcome} onHide={() => setShowWelcome(false)} />*/}
    </div>
  )
}

export default observer(Lounge)