'use strict';

var { NativeModules } = require('react-native');

var buttonState = 0;

module.exports.setDeviceName = (name: string) => {
    NativeModules.BLEPeripheral.setName(name);
}

module.exports.init = () => {
    NativeModules.BLEPeripheral.addService('00001812-0000-1000-8000-00805F9B34FB', true);
    NativeModules.BLEPeripheral.addHIDCharacteristicToService();
}

module.exports.startAdvertise = () => {
    console.log("advertising");
    NativeModules.BLEPeripheral.start()
    .then((res: string)=> {console.log(res)})
    .catch((error: Error) => {console.log(error)});
}

module.exports.stopAdvertise = () => {
    NativeModules.BLEPeripheral.stop();
}

module.exports.moveMouse = (dx: number, dy: number) => {
    NativeModules.BLEPeripheral.sendNotificationToDevices('00001812-0000-1000-8000-00805F9B34FB', 
                                            '00002A4D-0000-1000-8000-00805F9B34FB', 
                                            Array.from([buttonState, dx, dy, 0]));
}

module.exports.rightOnPress = () => {
    buttonState |= 2;
    NativeModules.BLEPeripheral.sendNotificationToDevices('00001812-0000-1000-8000-00805F9B34FB', 
                                            '00002A4D-0000-1000-8000-00805F9B34FB', 
                                            Array.from([buttonState, 0, 0, 0]));
}

module.exports.leftOnPress = () => {
    buttonState |= 1;
    NativeModules.BLEPeripheral.sendNotificationToDevices('00001812-0000-1000-8000-00805F9B34FB', 
                                            '00002A4D-0000-1000-8000-00805F9B34FB', 
                                            Array.from([buttonState, 0, 0, 0]));
}

module.exports.rightOnRelease = () => {
    buttonState &= ~2;
    NativeModules.BLEPeripheral.sendNotificationToDevices('00001812-0000-1000-8000-00805F9B34FB', 
                                            '00002A4D-0000-1000-8000-00805F9B34FB', 
                                            Array.from([buttonState, 0, 0, 0]));
}

module.exports.leftOnRelease = () => {
    buttonState &= ~1;
    NativeModules.BLEPeripheral.sendNotificationToDevices('00001812-0000-1000-8000-00805F9B34FB', 
                                            '00002A4D-0000-1000-8000-00805F9B34FB', 
                                            Array.from([buttonState, 0, 0, 0]));
}

module.exports.moveWheel = (dz) => {
    NativeModules.BLEPeripheral.sendNotificationToDevices('00001812-0000-1000-8000-00805F9B34FB', 
                                            '00002A4D-0000-1000-8000-00805F9B34FB', 
                                            Array.from([buttonState, 0, 0, dz]));
}