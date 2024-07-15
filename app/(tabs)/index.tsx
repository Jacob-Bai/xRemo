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
var BLEPeripheral = require('@/components/BLEPeripheral');

export default function MouseScreen() {
  let value = 1;
  let lastX = 0;
  let lastY = 0;
  // BLEPeripheral.stop();
  // BLEPeripheral.setName("JACOBTEST");
  // BLEPeripheral.addService('00001812-0000-1000-8000-00805F9B34FB', true); //
  // BLEPeripheral.addCharacteristicToService("00001812-0000-1000-8000-00805F9B34FB", "00002A33-0000-1000-8000-00805F9B34FB", 1 | 16, 2 | 16, "1"); //
  const advertise = () => {
    console.log("Advertising")
    BLEPeripheral.addHIDCharacteristicToService();
    BLEPeripheral.start()
    .then(res => {console.log(res)})
    .catch(error => {console.log(error)});
  }
  const mouseMove = (data) => {
    console.log("move:", data);
    BLEPeripheral.sendNotificationToDevices('00001812-0000-1000-8000-00805F9B34FB', '00002A4D-0000-1000-8000-00805F9B34FB', Array.from(data));
  }
  
  const [devName, onChangeDevName] = React.useState('Bluetooth device name');

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
        handleMouseMove(locationX - lastX, locationY - lastY);
        lastX = locationX;
        lastY = locationY;
      },
      onPanResponderRelease: (evt) => {
        handleMouseMove(0, 0);
      },
    })
  ).current;
  const handleMouseMove = (button, dx, dy, vWheel) => {
    mouseMove([button, dx, dy, vWheel]);
    // const reportData = createHidReport(button, dx, dy);
    // onReport(reportData);
  };
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
          // {...panResponder.panHandlers} 
        />
        <View 
          style={styles.wheelMove} 
          // {...panResponder.panHandlers} 
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
