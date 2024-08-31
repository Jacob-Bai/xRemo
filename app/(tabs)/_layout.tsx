import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppSelector, useAppDispatch } from '@/hooks/appHooks';
import { BleState, connect, disconnect, setBleState, storageUpdate } from '@/hooks/appSlice';
import { anyUnblockedCentrals, bleUpdateConnectedKnownCentrals } from '@/hooks/BleManager';
import { storageInit } from '@/hooks/storage';
import { bleInit } from '@/hooks/BleManager';
import { useEffect } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const connected = useAppSelector((state) => state.app.connected);
  const unblocked = useAppSelector((state) => state.app.unblocked);
  const bleState = useAppSelector((state) => state.app.bleState);
  const robotMode = useAppSelector((state) => state.app.robotMode);
  const storageReady = useAppSelector((state) => state.app.storageReady);
  const dispatch = useAppDispatch();

  useEffect(() => {
    storageInit(() => {
      bleUpdateConnectedKnownCentrals();
      dispatch(storageUpdate())
    });
    bleInit(
      () => dispatch(connect()),
      () => dispatch(disconnect()),
      (newState: BleState) => dispatch(setBleState(newState))
    );
  }, []);

  const getRobotIcon = () => {
    if(robotMode) return "robot-outline";
    else return "robot-off-outline";
  }
  
  const getBluetoothIcon = () => {
    if (bleState === BleState.poweredOn) {
      if (anyUnblockedCentrals()) return "bluetooth-transfer";
      return "bluetooth";
    }
    return "bluetooth-off";
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={'mouse'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="robot"
        options={{
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={getRobotIcon()} color={color} /> // 
          ),
        }}
      />
      <Tabs.Screen
        name="bluetooth"
        options={{
          title: connected.toString(),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={getBluetoothIcon()} color={color} /> // bluetooth-off bluetooth-audio bluetooth-transfer
          ),
        }}
      />
    </Tabs>
  );
}
