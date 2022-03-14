import {remote} from 'webdriverio';

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const operations: Record<string, (value1: number, value2: number) => number> = {
  '+': (value1: number, value2: number) => value1 + value2,
  '-': (value1: number, value2: number) => value1 - value2,
  '*': (value1: number, value2: number) => value1 * value2,
};

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
describe('Create Android session', function () {
  let client: WebdriverIO.Browser;

  beforeEach(async function () {
    client = await remote({
      path: '/wd/hub',
      port: 4723,
      capabilities: {
        platformName: 'Android',
        automationName: 'UiAutomator2',
        deviceName: 'Android Emulator',
        app: '/Users/naveent/personal/MathGame//android/app/build/outputs/apk/debug/app-debug.apk', // Will be added in tests
      },
    });
  });

  it('should create new round when answer is correct', async function () {
    try {
      await sleep(5000);
      const current_package = await client.getCurrentPackage();
      expect(current_package).toEqual('com.mathgame');
      const answer = await client.$('~answer-cell').getText();
      const [
        numberOptionOne,
        operatorOptionOne,
        operatorOptionTwo,
        numberOptionTwo,
      ]: string[] = await Promise.all([
        client.$('~option-0').getText(),
        client.$('~option-1').getText(),
        client.$('~option-2').getText(),
        client.$('~option-3').getText(),
      ]);
      const possibleAnswerOne = operations[operatorOptionOne](
        parseInt(numberOptionOne),
        parseInt(numberOptionTwo),
      );
      const possibleAnswerTwo = operations[operatorOptionTwo](
        parseInt(numberOptionOne),
        parseInt(numberOptionTwo),
      );
      if (possibleAnswerOne === parseInt(answer)) {
        await client.touchAction([
          {action: 'press', element: await client.$('~option-0')},
          {action: 'moveTo', x: 835, y: 1500},
          {action: 'moveTo', x: 835, y: 1750},
          'release',
        ]);
      } else if (possibleAnswerTwo === parseInt(answer)) {
        await client.touchAction([
          {action: 'press', element: await client.$('~option-0')},
          {action: 'moveTo', x: 635, y: 1750},
          {action: 'moveTo', x: 835, y: 1750},
          'release',
        ]);
      } else {
        throw new Error('Anwer not found');
      }
      await sleep(3000);
      const newAnswer = await client.$('~answer-cell').getText();
      const [
        newNumberOptionOne,
        newOperatorOptionOne,
        newOperatorOptionTwo,
        newNumberOptionTwo,
      ]: string[] = await Promise.all([
        client.$('~option-0').getText(),
        client.$('~option-1').getText(),
        client.$('~option-2').getText(),
        client.$('~option-3').getText(),
      ]);
      expect(answer).not.toBe(newAnswer);
      expect(`${newNumberOptionOne}-${newOperatorOptionOne}-${newOperatorOptionTwo}-${newNumberOptionTwo}`)
      .not
      .toBe(`${numberOptionOne}-${operatorOptionOne}-${operatorOptionTwo}-${numberOptionTwo}`);
    } finally {
      const delete_session = await client.deleteSession();
      expect(delete_session).toEqual(null);
    }
  });

  it.only('should not create new round and show restart popup when answer is not correct', async function () {
    try {
      await sleep(5000);
      const current_package = await client.getCurrentPackage();
      expect(current_package).toEqual('com.mathgame');
      const answer = await client.$('~answer-cell').getText();
      const [
        numberOptionOne,
        operatorOptionOne,
        operatorOptionTwo,
        numberOptionTwo,
      ]: string[] = await Promise.all([
        client.$('~option-0').getText(),
        client.$('~option-1').getText(),
        client.$('~option-2').getText(),
        client.$('~option-3').getText(),
      ]);
      console.log('Answers', answer);
      const possibleAnswerOne = operations[operatorOptionOne](
        parseInt(numberOptionOne),
        parseInt(numberOptionTwo),
      );
      if (possibleAnswerOne !== parseInt(answer)) {
        await client.touchAction([
          {action: 'press', element: await client.$('~option-0')},
          {action: 'moveTo', x: 835, y: 1500},
          {action: 'moveTo', x: 835, y: 1750},
          'release',
        ]);
      }  else {
        await client.touchAction([
          {action: 'press', element: await client.$('~option-0')},
          {action: 'moveTo', x: 635, y: 1750},
          {action: 'moveTo', x: 835, y: 1750},
          'release',
        ]);
      }
      await sleep(3000);
      const restartModal = await client.$('~restart-modal')
      const isRestartModalDisplayed = await restartModal.isEnabled()
      expect(isRestartModalDisplayed).toBeTruthy()
    } finally {
      const delete_session = await client.deleteSession();
      expect(delete_session).toEqual(null);
    }
  });

  it("should restart game when restart button is clicked on restart popup", () => {

  })

  it("should quit and go back to home screen  when quit is clicked on restart popup", () => {
    
  })

  it("should show the current score and best score with the reason in the popup", () => {
    
  })

  it("should show the time up popup when game round times up", () => {
    
  })

  it("should show the best and current score in the popup", () => {
    
  })

  it("on back button select should pause the game", () => {
    
  })
});
