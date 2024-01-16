import React, { useEffect, useState } from 'react'
import CtrlText from '../CtrlText';
import { Container } from 'react-bootstrap';
import { useStores } from '../../../hooks/useStores';

const Lounge = () => {
  const { socketStore } = useStores()
  const [ usersOnline, setUsersOnline ] = useState<any[]>([])

  console.log(socketStore.roomState.numCurrentUsers)

  useEffect(() => {
    setUsersOnline(new Array(socketStore.roomState.numCurrentUsers).fill(`user`))
  }, [socketStore.roomState]);

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
          // onSubmitSuccess={() => setShowOtherControls(true)}
        />
      </div>
      <hr className="m-2"/>
      <div>
        <div className="px-2 mb-2 d-flex justify-content-between">
          <span>Lounge</span><span className="fs-6 text-light">{socketStore.roomState.numCurrentUsers} / {socketStore.roomState.numMaxUsers}</span>
        </div>
        <Container className="m-0 px-3">
          <div className="limited-length-list">
            { usersOnline.map((player, index) =>  <div key={`${player}_${index}`}>{player} - {index}</div> ) }
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Lounge