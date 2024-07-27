import AsyncStorage from '@react-native-async-storage/async-storage';
export interface Central {
  id: string
  name: string;
  blocked: boolean;
}

export interface Setting {
  bleName: string,
  knownCentrals: Central[],
  randomMove: boolean,
  randomScroll: boolean,
  randomClick: boolean,
  backgroundMode: boolean,
  stopTimer: number,
  updateFreq: number,
}

const defaultSettings: Setting = {
  bleName: 'xRemo',
  knownCentrals: [],
  randomMove: true,
  randomScroll: true,
  randomClick: false,
  backgroundMode: false,
  stopTimer: 15,
  updateFreq: 3,
}

let settings = defaultSettings;
let storageLocked = false;
const storageKey = "Settings";

const deepMerge = (target: any, source: any): any => {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && target[key]) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  Object.assign(target || {}, source);
  return target;
}

export const storageInit = async (onReady: () => void) => {
  try {
    const value = await AsyncStorage.getItem(storageKey);
    if (value != null) {
      let stroedSettings = JSON.parse(value);
      settings = deepMerge(defaultSettings, stroedSettings);
      onReady();
      console.log("Use settings: ", settings);
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
  }
}

const safeStoreSettings = async () => {
  while (storageLocked) {
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  storageLocked = true;

  try {
    await AsyncStorage.setItem(storageKey, JSON.stringify(settings));
    console.log('Data safely stored');
  } catch (error) {
    console.error('Error storing data:', error);
  } finally {
    storageLocked = false;
  }
};

export const getBleName = () => {
  return settings.bleName;
}

export const setBleName = async (value: string) => {
  settings.bleName = value;
  await safeStoreSettings();
};

export const getRandomMove = () => {
  return settings.randomMove;
}

export const setRandomMove = async (value: boolean) => {
  settings.randomMove = value;
  await safeStoreSettings();
};

export const getRandomClick = () => {
  return settings.randomClick;
}

export const setRandomClick = async (value: boolean) => {
  settings.randomClick = value;
  await safeStoreSettings();
};

export const getRandomScroll = () => {
  return settings.randomScroll;
}

export const setRandomScroll = async (value: boolean) => {
  settings.randomScroll = value;
  await safeStoreSettings();
};

export const getBackgroundMode = () => {
  return settings.backgroundMode;
}

export const setBackgroundMode = async (value: boolean) => {
  settings.backgroundMode = value;
  await safeStoreSettings();
};

export const getStopTimer = () => {
  return settings.stopTimer;
}

export const setStopTimer = async (value: number) => {
  settings.stopTimer = value;
  await safeStoreSettings();
};

export const getUpdateFreq = () => {
  return settings.updateFreq;
}

export const setUpdateFreq = async (value: number) => {
  settings.updateFreq = value;
  await safeStoreSettings();
};

export const getKnownCentral = (id: string) => {
  let knownCentral = settings.knownCentrals.find((central) => central.id === id);
  return knownCentral? knownCentral : {id: id, name: id, blocked: false} as Central;
}

export const setKnownCentral = async (updateCentral: Central) => {
  for (const central of settings.knownCentrals) {
    if (central.id === updateCentral.id) {
      central.name = updateCentral.name;
      central.blocked = updateCentral.blocked;
      await safeStoreSettings();
      return;
    }
  }
  settings.knownCentrals.push(updateCentral);
  await safeStoreSettings();
}
