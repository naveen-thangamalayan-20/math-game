import { useDispatch, useSelector } from "react-redux"
import { RestartModelProps } from ".";
import { RootState } from "../../store";
import { GameOverReason, GamePageActions } from "../redux";

export const useRestartModalController = (props : RestartModelProps) => {
 const dispatch = useDispatch();
 const gameOverReason = useSelector((root: RootState)=> root.gamePage.gameOverReason);
 const showRestartModal =  useSelector((state:RootState) =>state.gamePage.showRestartModal);

//  dispatch
 return {
    gameOverReason,
    showRestartModal,
    onRestartGame: props.onRestartGame,
    onQuitGame: () => {
        dispatch(GamePageActions.setShowRestartModal(false))
        dispatch(GamePageActions.updateGameOverReason(GameOverReason.NONE))
        props.navigation.navigate("Home")
    }
 }
}