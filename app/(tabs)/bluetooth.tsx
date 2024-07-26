
import { StyleSheet, View, ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedList } from '@/components/ThemedList';
import {
  connectedDevices,
  bleSetDeviceName,
  bleStartAdvertise,
  bleStopAdvertise,
  bleSetConnectedDeviceName,
  bleSetConnectedDeviceBlocked,
} from '@/hooks/BleManager'
import {
  useAppSelector,
  useAppDispatch,
} from "@/hooks/appHooks"
import {
  BleState,
  block,
  unblock,
} from "@/hooks/appSlice"

export default function BleScreen() {
  let advertise = false;
  const bleState = useAppSelector((state) => state.app.bleState);
  const connected = useAppSelector((state) => state.app.connected);
  const deviceName = useAppSelector((state) => state.app.deviceName);
  const dispatch = useAppDispatch();
  const handleAdvertise = (newState: boolean) => {
    if (newState) {
      bleStartAdvertise();
    } else {
      bleStopAdvertise();
    }
  };
  const handleDeviceName = (newName: string) => {
    bleSetDeviceName(newName);
    console.log("store new name:", newName);
  }
  if (advertise && bleState !== BleState.poweredOn) {
    bleStopAdvertise();
    advertise = false;
  }
  const devicesList = () => {
    if (connected === 0) {
      return; 
    }
    const devices: JSX.Element[] = [];
    connectedDevices.forEach((device, id) => {
      devices.push(
        <View style={styles.eachDevice} key={id}>
          <ThemedList
            type='TextInput'
            itemName='Device'
            index={1}
            totalItems={2}
            textValue={device.name}
            id={id}
            onChangeIdTextInput={(id: string, newName: string) => 
              bleSetConnectedDeviceName(id, {name: newName, blocked: device.blocked})}
          />
          <ThemedList
            type='Switch'
            itemName='Blocked'
            index={2}
            totalItems={2}
            switchValue={device.blocked}
            id={id}
            onChangeIdSwitch={(id: string, newBlocked: boolean) => {
              bleSetConnectedDeviceBlocked(id, {name: device.name, blocked: newBlocked});
              dispatch(newBlocked?block():unblock());}}
          />
        </View>
      );
    });
    devices.push(
      <ThemedList
        key='Note'
        type='Note'
        itemName='Switch on Blocked to stop controlling the device'
      />);
    return devices;
  };
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
          onChangeTextInput={handleDeviceName}
          disabled={advertise}
        />
        <ThemedList
          type='Switch'
          itemName='Discoverable'
          index={2}
          totalItems={2}
          onChangeSwitch={handleAdvertise}
          switchValue={advertise}
        />
        <ThemedList 
          type='Note'
          itemName="Switch on Discoverable and scan from your PC to make new connection"
        />
        <ThemedList 
          type='Title'
          itemName='CONNECTED DEVICES'
        />
        <ScrollView 
          contentContainerStyle={styles.deivcesSection} 
          automaticallyAdjustKeyboardInsets={true}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
        >
          {devicesList()}
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bleSection: {
    height: '75%',
  },
  section: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  deivcesSection: {
    width: '100%',
    alignItems: 'center',
  },
  eachDevice: {
    width: '100%',
    alignItems: 'center',
  },
});
