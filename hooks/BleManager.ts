'use strict';

var { NativeModules, NativeEventEmitter } = require('react-native');
import { Alert } from 'react-native';
import { BleState } from '@/hooks/appSlice';
import { 
    Central, 
    getBleName, 
    getKnownCentral, 
    setKnownCentral,
} from './storage';

var buttonState = 0;
var bleState = BleState.poweredOff;
const eventEmitter = new NativeEventEmitter(NativeModules.BLEPeripheral);
let connectedCentrals: Array<Central> = [];
let unblockedCentrals: Array<string> = [];

export const bleInit = (onConnect: () => void, onDisconnect: () => void, onStatusChange: (newState: BleState) => void) => {
    const handleCentralSubcribe = (id: string) => {
        centralConnect(id);
        onConnect();
        console.log('Subscribe:', id);
    };
    const handleCentralUnsubcribe = (id: string) => {
        centralDisconnect(id);
        onDisconnect();
        console.log('Unsubscribe:', id);
    };
    const handleBleStatusUpdate = (status: string) => {
        console.log('Status update:', status);
        if (status === BleState.poweredOn) {
            NativeModules.BLEPeripheral.hidServiceInit();
        }
        bleState = BleState[status as keyof typeof BleState];
        onStatusChange(bleState);
    };
    const handleBleWarning = (msg: string) => {
        console.log('BLE Warning:', msg);
    };

    eventEmitter.addListener(
        'onCentralSubscribed',
        handleCentralSubcribe
    );
    eventEmitter.addListener(
        'onCentralUnsubscribed',
        handleCentralUnsubcribe
    );
    eventEmitter.addListener(
        'onBleStatusUpdate',
        handleBleStatusUpdate
    );
    eventEmitter.addListener(
        'onWarning',
        handleBleWarning
    );
    console.log("ble init");

}

const blockCentral = (id: string) => {
    unblockedCentrals = unblockedCentrals.filter(centralId => centralId !== id);
}

const unblockCentral = (id: string) => {
    unblockedCentrals.push(id);
}

const centralConnect = (id: string) => {
    let knownCentral = getKnownCentral(id);
    connectedCentrals.push(knownCentral);
    if (!knownCentral.blocked) unblockCentral(id);
}

const centralDisconnect = (id: string) => {
    connectedCentrals = connectedCentrals.filter(central => central.id !== id);
    blockCentral(id);
}

export const anyUnblockedCentrals = () => {
    return unblockedCentrals.length > 0;
}

export const getConnectedCentrals = () => {
    return connectedCentrals;
}

export const bleUpdateConnectedKnownCentrals = () => {
    for (const central of connectedCentrals) {
        let knownCentral = getKnownCentral(central.id);
        if (central.blocked != knownCentral.blocked) {
            if (knownCentral.blocked) {
                blockCentral(knownCentral.id);
            } else {
                unblockCentral(knownCentral.id);
            }
            central.blocked = knownCentral.blocked;
        }
        central.name = knownCentral.name;
    }
}

export const bleSetConnectedCentralName = (id: string, name: string) => {
    for (const connectedCentral of connectedCentrals) {
        if (connectedCentral.id === id) {
            connectedCentral.name = name;
            setKnownCentral(connectedCentral);
            return;
        }
    }
}

export const bleSetConnectedCentralBlocked = (id: string, blocked: boolean) => {
    for (const connectedCentral of connectedCentrals) {
        if (connectedCentral.id === id) {
            if (blocked) {
                blockCentral(id);
            } else {
                unblockCentral(id);
            }
            connectedCentral.blocked = blocked;
            setKnownCentral(connectedCentral);
            return;
        }
    }
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
    NativeModules.BLEPeripheral.setName(getBleName());
    NativeModules.BLEPeripheral.start()
        .then((res: string) => { console.log(res)})
        .catch((error: Error) => { console.log(error)});
}

export const bleStopAdvertise = () => {
    console.log("stop advertising");
    NativeModules.BLEPeripheral.stop();
}

const _sendData = (button: number, x: number, y: number, z: number) => {
    if (unblockedCentrals.length === 0) {
        return;
    } else if (unblockedCentrals.length === connectedCentrals.length) {
        // update all device, no need calculation in swift
        NativeModules.BLEPeripheral.sendMouseData(Array.from([button, x, y, z]), [])
    } else {
        NativeModules.BLEPeripheral.sendMouseData(Array.from([button, x, y, z]), unblockedCentrals)
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