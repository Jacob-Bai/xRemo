
import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedList } from '@/components/ThemedList';
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/appHooks'
import { robotOn, robotOff } from '@/hooks/appSlice'
import { bleSendRandom } from '@/hooks/BleManager';

var intervalId: NodeJS.Timeout;

export default function robotScreen() {
  const dispatch = useAppDispatch();
  const [startRobot, setStartRobot] = useState(false);
  let enabledMouseMove = true;
  let enabledMouseClick = false;
  let enabledMouseScroll = true;

  const handleStartRobot = (newState: boolean) => {
    if (newState) {
      dispatch(robotOn());
      intervalId = setInterval( () => {
        bleSendRandom(
          enabledMouseClick,
          enabledMouseMove,
          enabledMouseScroll) 
        }, 1000
      );
    } else { 
      dispatch(robotOff());
      clearInterval(intervalId);
    }
    setStartRobot(newState);
  }

  return (
    <ThemedView style={[styles.bleSection]}>
      <View style={[styles.section]}>
        <ThemedList 
          type='Title'
          itemName='AOTUPILOT SETTINGS'
        />
        <ThemedList
          type='Switch'
          itemName='Random Move'
          index={1}
          totalItems={3}
          onChangeSwitch={(newState: boolean) => enabledMouseMove = newState }
          switchValue={enabledMouseMove}
          disabled={startRobot}
        />
        <ThemedList
          type='Switch'
          itemName='Random Scroll'
          index={2}
          totalItems={3}
          onChangeSwitch={(newState: boolean) => enabledMouseScroll = newState }
          switchValue={enabledMouseScroll}
          disabled={startRobot}
        />
        <ThemedList
          type='Switch'
          itemName='Random Click'
          index={3}
          totalItems={3}
          onChangeSwitch={(newState: boolean) => enabledMouseClick = newState }
          switchValue={enabledMouseClick}
          disabled={startRobot}
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
    marginTop: 20,
  },
});
