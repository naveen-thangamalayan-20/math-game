import AsyncStorage from '@react-native-async-storage/async-storage';
import {HighScore} from './redux';

let cachedHighScore: HighScore | null = null;
const get = async (forceUpdate: boolean = false) => {
  try {
    if (!cachedHighScore || forceUpdate) {
      const jsonValue = await AsyncStorage.getItem('@highScore');
      cachedHighScore = jsonValue != null ? JSON.parse(jsonValue) : null;
    }
    return cachedHighScore;
  } catch (e) {
    // error reading value
  }
};

const highScore = {
  get,
  store: async (highscore: HighScore) => {
    try {
      console.log("@@@@@@Store")
      const jsonValue = JSON.stringify(highscore);
      await AsyncStorage.setItem('@highScore', jsonValue);
      return get(true);
      // if (cachedHighScore && cachedHighScore.speed < highscore.speed) {

      // } else {
      //     return cachedHighScore;
      // }
    } catch (e) {
      // saving error
    }
  },
};

export default highScore;
