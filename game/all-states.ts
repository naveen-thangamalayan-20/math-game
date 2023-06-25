import { useSelector } from "react-redux"
import { RootState } from "../store"

export const useGetAllReduxStates = () => {
    return {
     currentScore: useSelector((state: RootState) => state.gamePage.currentScore),
     highScorePEV: useSelector((state: RootState) => state.gamePage.highScorePEV),
     resourcePE: useSelector((state: RootState) => state.homePage.resourcePE),
     gameOverReason: useSelector((state: RootState) => state.gamePage.gameOverReason),
     difficultyLevel: useSelector((state: RootState) => state.gamePage.difficultyLevel),
     isSoundOn: useSelector((state: RootState) => state.homePage.isSoundOn),
    }
  }