import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  useColorScheme,
  View,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedList } from '@/components/ThemedList';
const mouseManager = require('@/components/MouseManager');

export default function MouseScreen() {
  let lastX = 0;
  let lastY = 0;
  let lastZ = 0;

  const mouseElementColor = useThemeColor({}, 'listItem');
  const [leftHandMode, setLeftHandMode] = useState(false);
  const styles = leftHandMode? leftHandStyle : rightHandStyle; 
  
  const mouseMoveHandler = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        lastX = locationX;
        lastY = locationY;
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        mouseManager.moveMouse(locationX - lastX, locationY - lastY);
        lastX = locationX;
        lastY = locationY;
      },
      onPanResponderRelease: () => {
        mouseManager.moveMouse(0, 0);
      },
    })
  ).current;
  
  const mouseWheelHandler = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        lastZ = locationY;
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        mouseManager.moveWheel(lastZ - locationY);
        lastZ = locationY;
      },
      onPanResponderRelease: () => {
        mouseManager.moveWheel(0);
      },
    })
  ).current;

  return (
    <ThemedView style={styles.mouseSection}>
      <View style={styles.container1}>
        <View 
          style={[styles.mouseMove, {backgroundColor: mouseElementColor}]} 
          {...mouseMoveHandler.panHandlers} 
        />
        <View 
          style={[styles.wheelMove, {backgroundColor: mouseElementColor}]} 
          {...mouseWheelHandler.panHandlers} 
        />
      </View> 
      <View style={styles.container2}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: mouseElementColor}]}
          onPressIn={mouseManager.rightOnPress}
          onPressOut={mouseManager.rightOnRelease}
        >
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: mouseElementColor}]}
          onPressIn={mouseManager.leftOnPress}
          onPressOut={mouseManager.leftOnRelease}
        >
        </TouchableOpacity>
      </View>
      <ThemedList
        type='Switch'
        itemName='Left Hand Mode'
        index={1}
        totalItems={1}
        handleSwitch={() => setLeftHandMode(!leftHandMode)}
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
