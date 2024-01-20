import React, { useEffect, useState } from 'react'
import { useStores } from '../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { Phase3RoundData } from '../../../stores/gameStore';
// import PlayerItem from './ListItemPlayer';
// import ListAudience from './ListAudience';
import CtrlText from '../CtrlText';
import { motion, useAnimate } from 'framer-motion';

const Round = () => {
  const [scope, animate] = useAnimate();
  const { gameStore, socketStore } = useStores()

  const [ roundTimer, setRoundTimer ] = useState<number|undefined>(undefined)
  const [ animationCompleted, setAnimationCompleted ] = useState(false)
  const [ titleAnimationCompleted, setTitleAnimationCompleted ] = useState(false)
  const [ firstRender, setFirstRender ] = useState(true)
  const { timer } = gameStore.roundData || {}
  const [ isPlayer, setIsPlayer ] = useState(false)

  useEffect(() => {
    if (gameStore.players && socketStore.connectionState.clientId) {
      const currentPlayer = gameStore.players.filter(player => player.id === socketStore.connectionState.clientId)[0]
      if (currentPlayer) {
        setIsPlayer(true)
      } else {
        setIsPlayer(false)
      }
    }
  }, [gameStore.players, socketStore.connectionState.clientId]);

  useEffect(() => {
    if (!animationCompleted || !timer) {
      return
    }

    setFirstRender(false)

    setRoundTimer(timer)
    const decreaseTimerInterval = setInterval(() => {
      setRoundTimer(prevTimer => prevTimer && prevTimer > 0 ? prevTimer - 0.25 : 0);
    }, 250)

    return () => {
      clearInterval(decreaseTimerInterval)
    }
  }, [timer, animationCompleted]);

  async function myAnimation() {
    await animate(scope.current, { y: '40vh', scale: 1, duration: 0.5 })
    animate(
      scope.current,
      {
        y: 0
      },
      {
        delay: 2,
        ease: 'backOut',
        duration: 0.5
      }
    );
  }

  useEffect(() => {
    myAnimation();
  }, []);

  return (
    <div className="d-flex flex-column flex-grow-1" style={{ height: '100vh', width: '100vw' }}>
      <div className="d-flex flex-column z-index-above mt-4 flex-grow-1">
        <div className="d-flex gap-4 mx-2 align-items-center justify-content-center">
          <div className="position-relative text-center">
            <motion.div
              ref={scope}
              initial={firstRender ? { scale: 0, y: '-100vh' } : false}
              onAnimationStart={() => setTitleAnimationCompleted(false)}
            >
              <div className="fw-semibold fs-5">{gameStore.roundData?.prompt}</div>
              <motion.div
                initial={firstRender ? { scale: 0, y: '-100vh'} : false}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.3, ease: 'backOut' }}
                onAnimationComplete={() => setTitleAnimationCompleted(true)}
              >
                <div className="text-secondary fs-5">{gameStore.roundData?.hint}</div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {titleAnimationCompleted
          ? <motion.div
            initial={firstRender ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5, ease: 'backOut' }}
            onAnimationStart={() => setAnimationCompleted(false)}
            onAnimationComplete={() => setAnimationCompleted(true)}
            className="mt-auto mb-auto"
          >
            <div className="position-relative">
              {isPlayer
                ?
                <CtrlText
                  label={'Text Prompt'}
                  messageField={'textPrompt'}
                  textArea={true}
                  shouldSubmit={roundTimer === 0}
                />
                :
                <>
                {animationCompleted
                  ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5}}>
                    <div className="px-4">
                      <div className="mb-4 fw-bold text-info">You're in the audience!</div>
                      <div className="text-light">After players submitted their prompts, you can vote for your favorite
                      </div>
                    </div>
                  </motion.div>
                  : null
                }
                </>
              }

              {roundTimer && roundTimer > 0
                ? (
                  <>
                    <div
                      className="position-absolute mb-1 bottom-0 d-flex rounded-circle border border-2 border-dark fw-bold align-items-center justify-content-center font-monospace"
                      style={{ fontSize: '12px', width: '44px', height: '44px', right: '0.5rem' }}
                    >
                      <span>{roundTimer?.toFixed(0)}</span>
                      {/*.<span>{roundTimer?.toFixed(1).slice(3, 4)}</span>*/}
                    </div>
                  </>
                )
                : null
              }
            </div>
          </motion.div>
          : null
        }
      </div>

      {animationCompleted
        ? (
          <div className="d-flex gap-2 justify-content-between text-dark mb-2 mx-2">
            <div>Players: {gameStore.players.length}</div>
            <div>Audience: {gameStore.audience.length}</div>
          </div>
          // <>
          //   <hr className="my-1"/>
          //   {gameStore.players ?
          //     <div className="p-2">
          //       <div className="mb-2 d-flex justify-content-between">
          //         <span className="text-dark-emphasis">Players</span>
          //       </div>
          //       <div className="m-0 px-2">
          //         <div>
          //           {gameStore.players?.map((player, index) => (
          //             <div key={`${player.id}_${index}`}>
          //               <PlayerItem player={player}/>
          //               <div>
          //                 Points: {player.points}
          //               </div>
          //             </div>
          //           ))}
          //         </div>
          //       </div>
          //     </div>
          //     : null
          //   }
          //   {gameStore.audience
          //     ? <ListAudience />
          //     : null
          //   }
          // </>
        )
        : null
      }
    </div>
  )
}

export default observer(Round)