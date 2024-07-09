import React, { useRef } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  TextInput,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  PanResponder,
  TouchableOpacity
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
var BLEPeripheral = require('./BLEPeripheral');

type SectionProps = PropsWithChildren<{
  title: string;
}>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

export default function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  let value = 1;
  let lastX = 0;
  let lastY = 0;
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  BLEPeripheral.stop();
  BLEPeripheral.setName("JACOBTEST");
  BLEPeripheral.addService('00001812-0000-1000-8000-00805F9B34FB', true); //
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
        // 触摸开始时处理事件
        const { locationX, locationY } = evt.nativeEvent;
        lastX = locationX;
        lastY = locationY;
        console.log('Touch Start:', locationX, locationY);
        // 这里可以添加触发鼠标按下事件的逻辑
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        let dx = locationX - lastX;
        let dy = locationY - lastY;
        lastX = locationX;
        lastY = locationY;
        handleMouseMove(0, Math.round(dx*2), Math.round(dy*2), 0);
      },
      // onPanResponderRelease: (evt) => {
      //   // 触摸结束时处理事件
      //   const { locationX, locationY } = evt.nativeEvent;
      //   console.log('Touch End:', locationX, locationY);
      //   handleMouseMove(0, 0, 0);
      //   // 这里可以添加触发鼠标释放事件的逻辑
      // },
    })
  ).current;
  const handleMouseMove = (button, dx, dy, vWheel) => {
    mouseMove([button, dx, dy, vWheel]);
    // const reportData = createHidReport(button, dx, dy);
    // onReport(reportData);
  };

  // const createHidReport = (button, dx, dy) => {
  //   const report = new Uint8Array(3);
  //   report[0] = button; // 按钮状态
  //   report[1] = dx; // X 轴相对位移
  //   report[2] = dy; // Y 轴相对位移
  //   return report;
  // };
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{backgroundColor: 'rgba(0,0,0,0)'}}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeDevName}
          value={devName}
        />
        <Button
          title="Ready for connect"
          onPress={advertise}
        />
        <Button
          title="left"
          onPress={() => {handleMouseMove(0,0,0,10);handleMouseMove(0,0,0,0)}}
        />
        <Button
          title="right"
          onPress={() => {handleMouseMove(0,0,0,-10);handleMouseMove(0,0,0,0)}}
        />
        <TouchableOpacity
        //style={styles.button}
        onPressIn={() => handleMouseMove(1,0,0,0)}
        onPressOut={() => handleMouseMove(0,0,0,0)}
      >
        <Text>Press Me</Text>
      </TouchableOpacity>
      <TouchableOpacity
        //style={styles.button}
        onPressIn={() => handleMouseMove(2,0,0,0)}
        onPressOut={() => handleMouseMove(0,0,0,0)}
      >
        <Text>Press Me</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.toucharea} {...panResponder.panHandlers}>
        <Text style={styles.text}>滑动以模拟鼠标移</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  toucharea: {
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});
