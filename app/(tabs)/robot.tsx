
import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedList } from '@/components/ThemedList';
import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/appHooks'
import { robotOn, robotOff } from '@/hooks/appSlice'
import { bleSendRandom } from '@/hooks/BleManager';
import BackgroundTimer from 'react-native-background-timer';
import { 
  getRandomClick, 
  setRandomClick,
  getRandomMove,
  setRandomMove,
  getRandomScroll,
  setRandomScroll,
  getBackgroundMode,
  setBackgroundMode,
  getStopTimer,
  setStopTimer,
  getUpdateFreq,
  setUpdateFreq,
 } from '@/hooks/storage'

var updateIntervalId: NodeJS.Timeout;
var stopIntervalId: NodeJS.Timeout;

export default function robotScreen() {
  const dispatch = useAppDispatch();
  const [startRobot, setStartRobot] = useState(false);
  const storageInit = useAppSelector((state) => state.app.storageReady);
  
  const handleStartRobot = (newState: boolean) => {
    const freq = getUpdateFreq() === 0? 250 : getUpdateFreq()*1000; //seconds
    const stop = getStopTimer() * 60 * 1000; //mins
    if (newState) {
      dispatch(robotOn());
      if (getBackgroundMode()) {
        updateIntervalId = BackgroundTimer.runBackgroundTimer(() => {
          bleSendRandom(
            getRandomClick(),
            getRandomMove(),
            getRandomScroll())
        }, freq);
        if (stop > 0)
          stopIntervalId = BackgroundTimer.runBackgroundTimer(() => {
            handleStartRobot(false);
          }, stop);
      } else {
        updateIntervalId = setInterval(() => {
          bleSendRandom(
            getRandomClick(),
            getRandomMove(),
            getRandomScroll())
        }, freq);
        if (stop > 0) {
          stopIntervalId = setInterval(() => {
            handleStartRobot(false);
          }, stop);
        }
      }
    } else {
      // BackgroundTimer.stopBackgroundTimer();
      clearInterval(updateIntervalId);
      clearInterval(stopIntervalId);
      dispatch(robotOff());
      console.log("robot off");
    }
    setStartRobot(newState);
  }

  return (
    <ThemedView style={[styles.bleSection]}>
      <View style={[styles.section]}>
        <ThemedList 
          type='Title'
          itemName='BASIC SETTINGS'
        />
        <ThemedList
          type='Switch'
          itemName='Random Move'
          index={1}
          totalItems={3}
          onChangeSwitch={setRandomMove}
          switchValue={getRandomMove()}
          disabled={startRobot}
        />
        <ThemedList
          type='Switch'
          itemName='Random Scroll'
          index={2}
          totalItems={3}
          onChangeSwitch={setRandomScroll}
          switchValue={getRandomScroll()}
          disabled={startRobot}
        />
        <ThemedList
          type='Switch'
          itemName='Random Click'
          index={3}
          totalItems={3}
          onChangeSwitch={setRandomClick}
          switchValue={getRandomClick()}
          disabled={startRobot}
        />
        <ThemedList 
          type='Title'
          itemName='ADVANCED SETTINGS'
        />
        <ThemedList
          type='Switch'
          itemName='Background Mode'
          index={1}
          totalItems={1}
          onChangeSwitch={setBackgroundMode}
          switchValue={getBackgroundMode()}
          disabled={startRobot}
        />
        <ThemedList 
          type='Note'
          itemName='Allow autopilot running when App in background'
        />
        <ThemedList
          type='NumberInput'
          itemName='Timer'
          index={1}
          totalItems={1}
          onChangeNumber={setStopTimer}
          numValue={getStopTimer()}
          disabled={startRobot}
        />
        <ThemedList 
          type='Note'
          itemName='Stop autopilot after X minutes, 0 for non-stop'
        />
        <ThemedList
          type='NumberInput'
          itemName='Frequency'
          index={1}
          totalItems={1}
          onChangeNumber={setUpdateFreq}
          numValue={getUpdateFreq()}
          disabled={startRobot}
        />
        <ThemedList 
          type='Note'
          itemName='Send random actions every X seconds'
        />
        <ThemedList 
          type='Title'
          itemName='AUTOPILOT'
        />
        <ThemedList
          type='Switch'
          itemName='Start Autopilot'
          index={1}
          totalItems={1}
          onChangeSwitch={handleStartRobot}
          switchValue={startRobot}
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bleSection: {
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  section: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
  },
});
