export const iif = <Return>(callBackFn: () => Return) => {
    return callBackFn()
}

export const generateRandomNumber = (
    upperLimit: number,
    startValue: number = 0,
    allowDecimals = false,
  ) =>
    allowDecimals
      ? Math.round((Math.random() * upperLimit + startValue) * 10) / 10
      : Math.floor(Math.random() * upperLimit + startValue);
  
 export  const shuffle = <T>(array: Array<T>) => {
    let currentIndex = array.length,
      randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = generateRandomNumber(currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  
    return array;
  };