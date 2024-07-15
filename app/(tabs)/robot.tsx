
import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/ThemedView';
import { ThemedList } from '@/components/ThemedList';
import { useState } from 'react';

export default function robotScreen() {
  
  const [mouseMove, setMouseMove] = useState<boolean>(true);
  const [mouseClick, setMouseClick] = useState<boolean>(false);
  const [mouseScroll, setMouseScroll] = useState<boolean>(true);
  const [autoMode, setAutoMode] = useState<boolean>(false);
  
  return (
    <ThemedView style={[styles.bleSection]}>
      <View style={[styles.section]}>
        <ThemedList 
          type='Title'
          itemName='AOTUMODE SETTINGS'
        />
        <ThemedList
          type='Switch'
          itemName='Random Move'
          index={1}
          totalItems={3}
          handleSwitch={setMouseMove}
          switchValue={mouseMove}
          disabled={autoMode}
        />
        <ThemedList
          type='Switch'
          itemName='Random Scroll'
          index={2}
          totalItems={3}
          handleSwitch={setMouseScroll}
          switchValue={mouseScroll}
          disabled={autoMode}
        />
        <ThemedList
          type='Switch'
          itemName='Random Click'
          index={3}
          totalItems={3}
          handleSwitch={setMouseClick}
          switchValue={mouseClick}
          disabled={autoMode}
        />
        <ThemedList 
          type='Note'
          itemName='Not recommand enabling random click, it may send an emoji to your manager'
        />
        <ThemedList
          type='Switch'
          itemName='Start Automode'
          index={1}
          totalItems={1}
          handleSwitch={setAutoMode}
          switchValue={autoMode}
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
