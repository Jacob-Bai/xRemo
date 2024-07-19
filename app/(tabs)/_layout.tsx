import { Tabs } from 'expo-router';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
const mouseManager = require('@/components/MouseManager');
import { bleInit } from '@/components/MouseManager';
import { useAppSelector, useAppDispatch } from '@/hooks/appHooks';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const counter = useAppSelector((state) => state.counter.value);
  bleInit();
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
            <TabBarIcon name={'robot'} color={color} /> // 
          ),
        }}
      />
      <Tabs.Screen
        name="bluetooth"
        options={{
          title: counter.toString(),
          tabBarIcon: ({ color }) => (
            <TabBarIcon name={'bluetooth'} color={color} /> // bluetooth-off bluetooth-audio bluetooth-transfer
          ),
        }}
      />
    </Tabs>
  );
}
