import React from 'react';
import {Pressable, Text} from 'react-native';
import useHighScoreController from '../controller';

describe('controller', () => {
  const createGameProps = (options: {navigation?: any}) => ({
    navigation: options.navigation ?? jest.fn()
  })

  const SetupDummyComponent = () => {
    const controller = useHighScoreController();
    return (
      <Pressable
        data-testid="restart-btn"
        onPress={controller.onTouchBackButton}>
        <Text>Back</Text>
      </Pressable>
    );
  };

  it('should go back to homeScreen on back button touch', () => {});
});
