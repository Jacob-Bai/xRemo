
import { StyleSheet, View, ScrollView } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedList } from '@/components/ThemedList';
import {
  getConnectedCentrals,
  bleStartAdvertise,
  bleStopAdvertise,
  bleSetConnectedCentralName,
  bleSetConnectedCentralBlocked,
} from '@/hooks/BleManager'
import {
  useAppSelector,
  useAppDispatch,
} from "@/hooks/appHooks"
import {
  block,
  unblock,
} from "@/hooks/appSlice"
import { getBleName, setBleName } from '@/hooks/storage'

export default function BleScreen() {
  let advertise = false;
  // const bleState = useAppSelector((state) => state.app.bleState);
  const connected = useAppSelector((state) => state.app.connected);
  const storageInit = useAppSelector((state) => state.app.storageReady);

  const dispatch = useAppDispatch();

  const handleAdvertise = (newState: boolean) => {
    if (newState) {
      bleStartAdvertise();
    } else {
      bleStopAdvertise();
    }
  };

  const handleBleName = (newName: string) => {
    setBleName(newName);
    console.log("store new name:", newName);
  }
  
  const devicesList = () => {
    if (connected === 0) {
      return; 
    }
    const connectedCentrals = getConnectedCentrals();
    const devices: JSX.Element[] = [];
    connectedCentrals.forEach((central) => {
      devices.push(
        <View style={styles.eachDevice} key={central.id}>
          <ThemedList
            type='TextInput'
            itemName='Device'
            index={1}
            totalItems={2}
            textValue={central.name}
            id={central.id}
            onChangeIdTextInput={bleSetConnectedCentralName}
          />
          <ThemedList
            type='Switch'
            itemName='Blocked'
            index={2}
            totalItems={2}
            switchValue={central.blocked}
            id={central.id}
            onChangeIdSwitch={(id: string, newBlocked: boolean) => {
              bleSetConnectedCentralBlocked(id, newBlocked);
              dispatch(newBlocked?block():unblock());
            }}
          />
        </View>
      );
    });
    devices.push(
      <ThemedList
        key='Note'
        type='Note'
        itemName='Switch on Blocked to stop controlling a device'
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
          textValue={getBleName()}
          onChangeTextInput={handleBleName}
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
