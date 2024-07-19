'use strict';

var { NativeModules, NativeEventEmitter } = require('react-native');
import { useEffect } from 'react';

import { useAppDispatch } from '@/hooks/appHooks'
import { decrement, increment } from '@/hooks/counterSlice'

var buttonState = 0;
const eventEmitter = new NativeEventEmitter(NativeModules.BLEPeripheral);

module.exports.setDeviceName = (name: string) => {
    NativeModules.BLEPeripheral.setName(name);
}

export const bleInit = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const centralSubscribeListener = eventEmitter.addListener(
            'onCentralSubscribed',
            handleCentralSubcribe
        );
        const centralUnsubscribeListener = eventEmitter.addListener(
            'onCentralUnsubscribed',
            handleCentralUnsubcribe
        );
        const bleStatusUpdateListener = eventEmitter.addListener(
            'onBleStatusUpdate',
            handleBleStatusUpdate
        );

        return () => {
            centralSubscribeListener.remove();
            centralUnsubscribeListener.remove();
            bleStatusUpdateListener.remove();
        };
    }, []);
    const handleCentralSubcribe = (id: string) => {
        // setDeviceNumber(deviceNumber + 1);
        dispatch(increment());
        console.log('Subscribe:', id);
    };
    const handleCentralUnsubcribe = (id: string) => {
        // setDeviceNumber(deviceNumber - 1);
        dispatch(decrement());
        console.log('Unsubscribe:', id);
    };
    const handleBleStatusUpdate = (status: string) => {
        console.log('Status update:', status);
        if (status === "poweredOn") {
            NativeModules.BLEPeripheral.hidServiceInit();
        }
    };
    console.log("ble init");
}

module.exports.startAdvertise = () => {
    console.log("start advertising");
    NativeModules.BLEPeripheral.start()
        .then((res: string) => { console.log(res) })
        .catch((error: Error) => { console.log(error) });
}

module.exports.stopAdvertise = () => {
    console.log("stop advertising");
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
