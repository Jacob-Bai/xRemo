
import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedList } from '@/components/ThemedList';
import { useState } from 'react';
const mouseManager = require('@/components/MouseManager');

export default function BleScreen() {
  const [deviceName, setDeviceName] = useState<string>('My mouse');
  const [advertise, setAdvertise] = useState<boolean>(false);
  
  mouseManager.init();

  const handleAdvertise = () => {
    if (!advertise) {
      mouseManager.setDeviceName(deviceName)
      mouseManager.startAdvertise();
    } else {
      mouseManager.stopAdvertise();
    }
    setAdvertise(!advertise);
  }
  
  return (
    <ThemedView style={[styles.bleSection]}>
      <View style={[styles.section]}>
        <ThemedList 
          type='Title'
          itemName='BLUETOOTH SETTINGS'
        />
        <ThemedList
          type='TextInput'
          itemName='Device Name'
          index={1}
          totalItems={2}
          textValue={deviceName}
          handleTextInput={setDeviceName}
          disabled={advertise}
        />
        <ThemedList
          type='Switch'
          itemName='Discoverable'
          index={2}
          totalItems={2}
          handleSwitch={handleAdvertise}
          switchValue={advertise}
        />
        <ThemedList 
          type='Note'
          itemName='Discoverable mode will be off automatically after 60 seconds'
        />
        <ThemedList 
          type='Title'
          itemName='MY DEVICES'
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
    width: '90%',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
});
