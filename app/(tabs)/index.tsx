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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from '@/constants/Colors';
const mouseManager = require('@/components/MouseManager');

export default function MouseScreen() {
  let lastX = 0;
  let lastY = 0;
  
  const panResponder = useRef(
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
      onPanResponderRelease: (evt) => {
        mouseManager.moveMouse(0, 0);
      },
    })
  ).current;
  
  const theme = useColorScheme() ?? 'light';
  const [layout, setLayout] = useState(0);
  const handleLayoutChange = () => {
    if (layout == 2) setLayout(0);
    else setLayout(layout+1);
  }
  const styles = layout==0?styles0:layout==1?styles1:styles2;
  return (
    <ThemedView style={styles.mouseSection}>
      <TouchableOpacity
        style={styles.layoutButton}
        onPress={handleLayoutChange}
        activeOpacity={0.8}>
        <MaterialCommunityIcons
          name={'table-refresh'}
          size={20}
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
        />
        <ThemedText type="default">{layout==0?'Right Scroll Bar':layout==1?'Left Scroll Bar':'Two Finger Scroll'}</ThemedText>
      </TouchableOpacity>
      <View style={styles.container1}>
        <View 
          style={styles.mouseMove} 
          {...panResponder.panHandlers} 
        />
        <View 
          style={styles.wheelMove} 
          {...panResponder.panHandlers} 
        />
      </View> 
      <View style={styles.container2}>
        <TouchableOpacity
          style={styles.button}
          // onPressIn={() => handleMouseMove(1,0,0,0)}
          // onPressOut={() => handleMouseMove(0,0,0,0)}
        >
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          // onPressIn={() => handleMouseMove(2,0,0,0)}
          // onPressOut={() => handleMouseMove(0,0,0,0)}
        >
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}


const styles0 = StyleSheet.create({
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

const styles1 = StyleSheet.create({
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

const styles2 = StyleSheet.create({
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mouseMove: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#bbbbbb',
  },
  wheelMove: {
    width: '0%',
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
