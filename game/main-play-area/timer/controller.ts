import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useElapsedTime } from "use-elapsed-time";
import { RootState } from "../../../store";
import { GamePageActions } from "../../redux";

export type TimerProps = {
    // duration: number;
    onTimeOut: () => void;
}

const useTimerController = (props: TimerProps) => {
    const dispatch = useDispatch()
    const totalGameRemainingTime = useSelector((state:RootState) =>state.gamePage.totalGameRemainingTime);
    const currentRoundRemainingTime = useSelector((state:RootState) =>state.gamePage.currentRoundRemainingTime);
    const startTimer = useSelector((state:RootState) =>state.gamePage.startTimer);
    useEffect(() => {
        console.log("Mounted Timer")
        }, [])
    useElapsedTime({
        isPlaying: startTimer,
        duration: totalGameRemainingTime,
        updateInterval: 1,
        onUpdate: (elapsedTime) => {
            dispatch(GamePageActions.updateCurrentRoundRemainingTime(currentRoundRemainingTime - 1))
        },
        onComplete: (elapsedTime) => props.onTimeOut()
      })

   return {
       time: currentRoundRemainingTime,
   }
}

export default useTimerController;