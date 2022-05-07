import Sound from 'react-native-sound';

export const loadSound = (soundName: string) =>
  new Promise<Sound>((resolve, reject) => {
    const sound = new Sound(soundName, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        reject(error);
        return;
      }
    });
    sound.setVolume(1);
    return resolve(sound);
  });

let winningSound: Sound | null = null;
let failureSound: Sound | null = null;

export const getWinningSound = async () => {
  if (winningSound) {
    return winningSound;
  } else {
    winningSound = await loadSound('correct_answer.mp3');
  }
};

export const getFailureSound = async () => {
  if (failureSound) {
    return failureSound;
  } else {
    failureSound = await loadSound('wrong_answer.mp3');
  }
};
