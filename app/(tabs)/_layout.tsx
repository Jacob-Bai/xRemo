import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppSelector } from '@/hooks/appHooks';
import { BleState } from '@/hooks/appSlice';
import { connectedDevices } from '@/hooks/BleManager';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const unblocked = useAppSelector((state) => state.app.unblocked);
  const bleState = useAppSelector((state) => state.app.bleState);
  const robotMode = useAppSelector((state) => state.app.robotMode);

  const getRobotIcon = () => {
    if(robotMode) return "robot-outline";
    else return "robot-off-outline";
  }
  const connection = () => {
    for (const device of connectedDevices.values()) {
      if (device.blocked === false) {
        return true;
      }
    }
  }
  const getBluetoothIcon = () => {
    if (bleState === BleState.poweredOn) {
      console.log(unblocked);
      if (unblocked > 0) return "bluetooth-transfer";
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
          title: '',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={getBluetoothIcon()} color={color} /> // bluetooth-off bluetooth-audio bluetooth-transfer
          ),
        }}
      />
    </Tabs>
  );
}
