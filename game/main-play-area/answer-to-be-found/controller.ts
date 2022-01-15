import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { GamePageActions } from "../../redux";

const useAnswerToBeFoundController = () => {
    const [remainingTime, setRemainingTime ] = useState(0);
    // const isGameRoundCompleted = true;
    // const isGameRoundCompleted = useSelector((state:RootState) =>state.gamePage.isRoundAnswered);
    const dispatch = useDispatch();
    // if(isGameRoundCompleted){
       
    // }
    return {
        updateRemainingTime: (remainingTime: number) => setRemainingTime(remainingTime)
    }

}

export default useAnswerToBeFoundController;