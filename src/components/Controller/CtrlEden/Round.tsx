import React, { useEffect, useState } from 'react'
import { useStores } from '../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { Phase3RoundData } from '../../../stores/gameStore';
import PlayerItem from './ListItemPlayer';
import ListAudience from './ListAudience';
import CtrlText from '../CtrlText';

const Round = ({ data }: { data: Phase3RoundData }) => {
  const { gameStore } = useStores()

  const [ roundTimer, setRoundTimer ] = useState<number|undefined>(undefined)

  const { timer } = gameStore.roundData || {}
  useEffect(() => {
    if (!timer) {
      return
    }

    setRoundTimer(timer)
    const decreaseTimerInterval = setInterval(() => {
      setRoundTimer(prevTimer => prevTimer && prevTimer > 0 ? prevTimer - 0.5 : 0);
    }, 500)

    return () => {
      clearInterval(decreaseTimerInterval)
    }
  }, [timer]);

  return (
    <div>
      <div className="d-flex flex-column z-index-above mt-4">
        <div className="d-flex gap-4 mx-2 align-items-center">
          <div>
            <div className="fw-semibold fs-5">{gameStore.roundData?.prompt}</div>
            <div className="text-secondary fs-5">{gameStore.roundData?.hint}</div>
          </div>
        </div>

        <div>
          <CtrlText
            label={'Text Prompt'}
            messageField={'textPrompt'}
            textArea={true}
            shouldSubmit={roundTimer === 0}
          />
        </div>
      </div>

      {gameStore.players ?
        <div className="p-2">
          <div className="px-2 mb-2 d-flex justify-content-between">
            <span>Players</span>
          </div>
          <div className="m-0 px-3">
            <div>
              {gameStore.players?.map((player, index) => (
                <div key={`${player.id}_${index}`} >
                  <PlayerItem player={player}/>
                  <div>
                    Points: {player.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        : null
      }
      {gameStore.audience
        ? <ListAudience />
        : null
      }
    </div>
  )
}

export default observer(Round)