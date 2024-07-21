import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDeviceName = async (name: string) => {
  try {
    await AsyncStorage.setItem("DeviceName", name);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const getDeviceName = async () => {
    try {
      const value = await AsyncStorage.getItem("DeviceName");
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  
// export const storeNewDevice = async (value: string) => {
//     try {
//       await AsyncStorage.setItem("DeviceName", value);
//     } catch (error) {
//       console.error('Error storing data:', error);
//     }
//   };

// export const getData = async (key) => {
//   try {
//     const value = await AsyncStorage.getItem(key);
//     if (value !== null) {
//       return value;
//     }
//   } catch (error) {
//     console.error('Error retrieving data:', error);
//   }
// };


// storeData('username', 'john_doe');
// getData('username').then((value) => console.log(value));
