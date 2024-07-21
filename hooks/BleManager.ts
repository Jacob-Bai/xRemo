'use strict';

var { NativeModules, NativeEventEmitter } = require('react-native');
import { Alert } from 'react-native';
import { useEffect } from 'react';

import { useAppDispatch } from '@/hooks/appHooks'
import { 
    BleState, 
    setBleState, 
    connect, 
    disconnect,
    block,
    unblock,
    setDeviceName,
} from '@/hooks/appSlice'
import { getDeviceName, storeDeviceName } from '@/hooks/storage';

var buttonState = 0;
var bleState = BleState.poweredOff;
const eventEmitter = new NativeEventEmitter(NativeModules.BLEPeripheral);
const connectedDevices = new Map();

export { connectedDevices };

export const bleInit = () => {
    const dispatch = useAppDispatch();

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
        getDeviceName().then((storedName?: string) => {
            if (storedName) {
                console.log("read stored name:", storedName); 
                NativeModules.BLEPeripheral.setName(storedName);
                dispatch(setDeviceName(storedName));
            }
        });
        console.log("ble init");

        return () => {
            centralSubscribeListener.remove();
            centralUnsubscribeListener.remove();
            bleStatusUpdateListener.remove();
        };
    }, []);
    const handleCentralSubcribe = (id: string) => {
        connectedDevices.set(id, {name: id, blocked: false});
        dispatch(unblock());
        dispatch(connect());
        console.log('Subscribe:', id);
    };
    const handleCentralUnsubcribe = (id: string) => {
        connectedDevices.delete(id);
        dispatch(disconnect());
        console.log('Unsubscribe:', id);
    };
    const handleBleStatusUpdate = (status: string) => {
        console.log('Status update:', status);
        if (status === BleState.poweredOn) {
            NativeModules.BLEPeripheral.hidServiceInit();
        }
        bleState = BleState[status as keyof typeof BleState];
        dispatch(setBleState(bleState));
    };
}

export const bleSetDeviceName = (name: string) => {
    NativeModules.BLEPeripheral.setName(name);
    storeDeviceName(name);
}

export const bleSetConnectedDeviceName = (id: string, device: {name: string, blocked: boolean}) => {
    connectedDevices.set(id, device);
}

export const bleSetConnectedDeviceBlocked = (id: string, device: {name: string, blocked: boolean}) => {
    connectedDevices.set(id, device);
}

export const bleStartAdvertise = () => {
    if (bleState === BleState.unauthorized) {
    Alert.alert('Bluetooth Permission Denied',
    'Please allow access in settings.')
    return;
    } else if (bleState === BleState.poweredOff) {
    Alert.alert('Bluetooth Powered Off',
    'Please turn on bluetooth in settings.')
    return;
    } else if (bleState === BleState.unsupported) {
    Alert.alert('Bluetooth Not Avaliable',
    'Bluetooth is not supported on this device.')
    return;
    } else if (bleState === BleState.resetting) {
    Alert.alert('Bluetooth Resetting',
    'Please wait or restart application.')
    return;
    } else if (bleState === BleState.unknown) {
    Alert.alert('Error',
    'Bluetooth has unknown issue.')
    return;
    } 
    console.log("start advertising");
    NativeModules.BLEPeripheral.start()
        .then((res: string) => { console.log(res)})
        .catch((error: Error) => { console.log(error)});
}

export const bleStopAdvertise = () => {
    console.log("stop advertising");
    NativeModules.BLEPeripheral.stop();
}

export const bleSendMouseMove = (dx: number, dy: number) => {
    console.log("mouse move", dx, " ", dy)
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, dx, dy, 0]));
}

export const bleSendRightPress = () => {
    console.log("right press")
    buttonState |= 2;
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, 0]));
}

export const bleSendLeftPress = () => {
    console.log("left press")
    buttonState |= 1;
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, 0]));
}

export const bleSendRightRelease = () => {
    console.log("right release")
    buttonState &= ~2;
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, 0]));
}

export const bleSendLeftRelease = () => {
    console.log("left releaase")
    buttonState &= ~1;
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, 0]));
}

export const bleSendWheelMove = (dz: number) => {
    NativeModules.BLEPeripheral.sendMouseData(Array.from([buttonState, 0, 0, dz]));
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const bleSendRandom = (sendClick: boolean, sendMove: boolean, sendScroll: boolean) => {
    let button = getRandomInt(0, 3);
    let x = getRandomInt(-178, 178);
    let y = getRandomInt(-178, 178);
    let z = getRandomInt(-178, 178);
    NativeModules.BLEPeripheral.sendMouseData(Array.from([
        sendClick? button : 0,
        sendMove? x : 0, 
        sendMove? y : 0, 
        sendScroll? z : 0
    ]));
}