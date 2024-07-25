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
const unblockedCentrals= new Map();


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
        const bleWarningListener = eventEmitter.addListener(
            'onWarning',
            handleBleWarning
        );
        getDeviceName().then((storedName?: string) => {
            if (storedName) {
                console.log("read stored name: ", storedName); 
                NativeModules.BLEPeripheral.setName(storedName);
                dispatch(setDeviceName(storedName));
            }
        });
        console.log("ble init");

        return () => {
            centralSubscribeListener.remove();
            centralUnsubscribeListener.remove();
            bleStatusUpdateListener.remove();
            bleWarningListener.remove();
        };
    }, []);
    const handleCentralSubcribe = (id: string) => {
        connectedDevices.set(id, {name: id, blocked: false});
        unblockedCentrals.set(id, true);
        dispatch(unblock());
        dispatch(connect());
        console.log('Subscribe:', id);
    };
    const handleCentralUnsubcribe = (id: string) => {
        connectedDevices.delete(id);
        unblockedCentrals.delete(id);
        dispatch(block());
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
    const handleBleWarning = (msg: string) => {
        console.log('BLE Warning:', msg);
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
    if (device.blocked) unblockedCentrals.delete(id);
    else unblockedCentrals.set(id, true);
    console.log("central: ", id, " new-state: ", device.blocked);
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

const _sendData = (button: number, x: number, y: number, z: number) => {
    if (unblockedCentrals.size === 0) {
        return;
    } else if (unblockedCentrals.size === connectedDevices.size) {
        NativeModules.BLEPeripheral.sendMouseData(Array.from([button, x, y, z]), [])
    } else {
        NativeModules.BLEPeripheral.sendMouseData(Array.from([button, x, y, z]), Array.from(unblockedCentrals.keys()))
    }
}

export const bleSendMouseMove = (x: number, y: number) => {
    // console.log("mouse move", x, " ", y)
    _sendData(buttonState, x, y, 0);
}

export const bleSendRightPress = () => {
    console.log("right press")
    buttonState |= 2;
    _sendData(buttonState, 0, 0, 0);
}

export const bleSendLeftPress = () => {
    console.log("left press")
    buttonState |= 1;
    _sendData(buttonState, 0, 0, 0);
}

export const bleSendRightRelease = () => {
    console.log("right release")
    buttonState &= ~2;
    _sendData(buttonState, 0, 0, 0);
}

export const bleSendLeftRelease = () => {
    console.log("left releaase")
    buttonState &= ~1;
    _sendData(buttonState, 0, 0, 0);
}

export const bleSendWheelMove = (z: number) => {
    _sendData(buttonState, 0, 0, z);
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
    _sendData(
        sendClick?  button : 0,
        sendMove?   x : 0, 
        sendMove?   y : 0, 
        sendScroll? z : 0
    );
}