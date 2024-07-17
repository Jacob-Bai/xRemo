'use strict';

var { NativeModules } = require('react-native');

var buttonState = 0;

module.exports.setDeviceName = (name: string) => {
    NativeModules.BLEPeripheral.setName(name);
}

module.exports.init = () => {
    NativeModules.BLEPeripheral.hidServiceInit();
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
    console.log("mouse move", dx, " ", dy)
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, dx, dy, 0]));
}

module.exports.rightOnPress = () => {
    console.log("right press")
    buttonState |= 2;
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, 0]));
}

module.exports.leftOnPress = () => {
    console.log("left press")
    buttonState |= 1;
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, 0]));
}

module.exports.rightOnRelease = () => {
    console.log("right release")
    buttonState &= ~2;
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, 0]));
}

module.exports.leftOnRelease = () => {
    console.log("left releaase")
    buttonState &= ~1;
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, 0]));
}

module.exports.moveWheel = (dz: number) => {
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, dz]));
}