import React, { useEffect, useState } from 'react'
import CtrlText from '../CtrlText';
import { Container } from 'react-bootstrap';
import { useStores } from '../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { Phase2PlayerData } from './index';
import { socket } from '../../../contexts/socketContext';
import { User } from '../../../stores/socketStore';

const Players = ({ data }: { data: Phase2PlayerData}) => {
  const { socketStore } = useStores()

  const [ selectedPlayers, setSelectedPlayers ] = useState<User[]|undefined>(undefined)
  const [ audience, setAudience ] = useState<User[]|undefined>(undefined)

  useEffect(() => {
    if (!data.player_indexes) {
      return
    }
    console.log(data.player_indexes)
    const playerData = data.player_indexes.map(player_index => {
      console.log(player_index, socketStore.roomState.users)
      return socketStore.roomState.users?.filter(user => user.client_index === player_index)[0]
    }) as User[]

    const audienceData = socketStore.roomState.users?.filter(user => !data.player_indexes.includes(user.client_index))

    setSelectedPlayers(playerData)
    setAudience(audienceData)
  }, [data, socketStore.roomState.users]);

  console.log({ selectedPlayers })
  console.log({ audience })

  const buttonColors = [
    'red', 'green', 'blue', 'yellow'
  ]

  return (
    <div>
      {selectedPlayers ?
          <div className="p-2">
            <div className="px-2 mb-2 d-flex justify-content-between">
              <span>Players</span>
            </div>
            <div className="m-0 px-3">
              <div>
                {selectedPlayers?.map((user, index) => (
                  <div key={`${user.id}_${index}`} className={`CtrlButton-${buttonColors[index]} player d-flex align-items-center justify-content-center`}>
                    <>
                      {user.id === socketStore.connectionState.clientId
                        ? <div
                          className="text-info fw-bold">{user.client_index}:{user.name ? user.name : user.id.slice(0, 6)}</div>
                        : <div>{user.client_index}:{user.name ? user.name : user.id.slice(0, 6)}</div>
                      }
                    </>
                  </div>
                ))}
              </div>
            </div>
          </div>
          : null
        }
        { audience ?
            <div className="p-2">
              <div className="px-2 mb-2 d-flex justify-content-between">
                <span>Audience</span>
              </div>
              <div className="m-0 px-3">
                <div className="limited-length-list" style={{ fontSize: '12px' }}>
                  {audience?.map((user, index) => (
                    <div key={`${user.id}_${index}`}>
                      <>
                        {user.id === socketStore.connectionState.clientId
                          ? <div
                            className="text-info fw-bold">{user.client_index}:{user.name ? user.name : user.id.slice(0, 6)}</div>
                          : <div>{user.client_index}:{user.name ? user.name : user.id.slice(0, 6)}</div>
                        }
                      </>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          : null
        }
    </div>
  )
}

export default observer(Players)