import { Player } from '../../../stores/socketStore';
import { useStores } from '../../../hooks/useStores';
import React from 'react';
import { observer } from 'mobx-react-lite';

const ListItemPlayer = ({player}:{player: Player}) => {
  const { socketStore } = useStores()

  if (!player || !player.id) {
    return (
      <div className="text-light">unknown</div>
    )
  }

  return (
    <div
      className={`CtrlButton-${player.color} player d-flex align-items-center justify-content-center w-50`}>
      <>
        {player.id === socketStore.connectionState.clientId
          ? <div
            className="text-info fw-bold">{player.client_index}:{player.name ? player.name : player.id.slice(0, 6)}</div>
          : <div>{player.client_index}:{player.name ? player.name : player.id.slice(0, 6)}</div>
        }
      </>
    </div>
  )
}
export default observer(ListItemPlayer)