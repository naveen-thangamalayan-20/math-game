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
    // useEffect(() => {
    //     dispatch(GamePageActions.updateTotalGameRemainingTime(props.duration))
    // }, [])
    useElapsedTime({
        isPlaying: true,
        duration: 20,
        updateInterval: 1,
        onUpdate: (elapsedTime) => {
            console.log("totalGameRemainingTime---state", totalGameRemainingTime)
            dispatch(GamePageActions.updateTotalGameRemainingTime(totalGameRemainingTime - 1))
        },
        onComplete: (elapsedTime) => props.onTimeOut()
      })

   return {
       time: totalGameRemainingTime,
   }
}

export default useTimerController;