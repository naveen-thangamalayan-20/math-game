export const SPEED_UNIT = "problems/secs";
export const getFormattedTime = (totalTime: number) => {
  if (totalTime < 60) {
    return {
      value: totalTime.toString(),
      unit:"secs"
    }
  } else {
    return {
      value: (totalTime / 60).toFixed(1),
      unit:"minutes"
    }
  }
};

export const getFormattedSpeed = (speed: number) => {
  return {value:`${speed.toFixed(2)}`, unit:SPEED_UNIT};
};
