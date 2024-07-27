import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedList } from '@/components/ThemedList';
import {
  bleSendLeftPress,
  bleSendRightPress,
  bleSendLeftRelease,
  bleSendRightRelease,
  bleSendMouseMove,
  bleSendWheelMove,
} from '@/hooks/BleManager';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';

export default function MouseScreen() {
  const mouseElementColor = useThemeColor({}, 'listItem');
  const leftButtonGesture = Gesture.Pan();
  const rightButtonGesture = Gesture.Pan();
  const moveGesture = Gesture.Pan();
  const scrollGesture = Gesture.Pan();

  leftButtonGesture.onTouchesDown(bleSendLeftPress);
  leftButtonGesture.onTouchesUp(bleSendLeftRelease);  
  rightButtonGesture.onTouchesDown(bleSendRightPress);
  rightButtonGesture.onTouchesUp(bleSendRightRelease);

  moveGesture.onUpdate((event) => {
    bleSendMouseMove(event.velocityX, event.velocityY);
  })

  scrollGesture.onUpdate((event) => {
    bleSendWheelMove(event.velocityY);
  })

  const [leftHandMode, setLeftHandMode] = useState(false);
  const styles = leftHandMode ? leftHandStyle : rightHandStyle;

  return (
    <ThemedView style={styles.mouseSection}>
      <GestureHandlerRootView style={styles.container1}>
        <GestureDetector gesture={moveGesture}>
          <View style={[styles.mouseMove, { backgroundColor: mouseElementColor }]}/>
        </GestureDetector>
        <GestureDetector gesture={scrollGesture}>
          <View style={[styles.wheelMove, { backgroundColor: mouseElementColor }]} />
        </GestureDetector>
      </GestureHandlerRootView>
      <GestureHandlerRootView style={styles.container2}>
        <GestureDetector gesture={leftButtonGesture}>
          <View style={[styles.button, { backgroundColor: mouseElementColor }]} />
        </GestureDetector>
        <GestureDetector gesture={rightButtonGesture}>
          <View style={[styles.button, { backgroundColor: mouseElementColor }]} />
        </GestureDetector>
      </GestureHandlerRootView>
      <ThemedList
        type='Switch'
        itemName='Left Hand Mode'
        index={1}
        totalItems={1}
        onChangeSwitch={setLeftHandMode}
        switchValue={leftHandMode}
      />
    </ThemedView>
  );
}


const rightHandStyle = StyleSheet.create({
  mouseSection: {
    height: '100%',
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  layoutText: {
    borderColor: '#000000',
    borderStyle: 'solid',
  },
  container1: {
    width: '90%',
    height: '60%',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouseMove: {
    width: '82%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#bbbbbb',
  },
  wheelMove: {
    width: '18%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#999999',
  },
  container2: {
    width: '90%',
    height: '15%',
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    height: '90%',
    borderRadius: 10,
    backgroundColor: '#777777',
  },
});

const leftHandStyle = StyleSheet.create({
  mouseSection: {
    height: '100%',
    flexDirection: 'column',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  layoutButton: {
    flexDirection: 'row',
    gap: 5,
    width: '100%',
    height: '5%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    width: '90%',
    height: '60%',
    flexDirection: 'row-reverse',
    gap: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouseMove: {
    width: '82%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#bbbbbb',
  },
  wheelMove: {
    width: '18%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#999999',
  },
  container2: {
    width: '90%',
    height: '15%',
    gap: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '50%',
    height: '90%',
    borderRadius: 10,
    backgroundColor: '#777777',
  },
});
