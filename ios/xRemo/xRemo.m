//
//  xRemo.m
//  xRemo
//
//  Created by Jacob Bai on 9/7/2024.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(BLEPeripheral, RCTEventEmitter)

// Best explanation: https://medium.com/@andrei.pfeiffer/react-natives-rct-extern-method-c61c17bf17b2

RCT_EXTERN_METHOD(
    isAdvertising:
    (RCTPromiseResolveBlock)resolve
    rejecter: (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(
    setName: (NSString *)string
)
RCT_EXTERN_METHOD(
    addService: (NSString *)uuid
    primary:    (BOOL)primary
)
RCT_EXTERN_METHOD(
    addCharacteristicToService: (NSString *)serviceUUID
    uuid: (NSString *)uuid
    permissions: (NSInteger *)permissions
    properties: (NSInteger *)properties
    data: (NSString *)data
)
RCT_EXTERN_METHOD(
    start:
    (RCTPromiseResolveBlock)resolve
    rejecter:   (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(stop)
RCT_EXTERN_METHOD(addHIDCharacteristicToService)
RCT_EXTERN_METHOD(
    sendNotificationToDevices: (NSString *)serviceUUID
    characteristicUUID: (NSString *)characteristicUUID
    data: (NSArray<NSNumber *> *)data
)
RCT_EXTERN_METHOD(requiresMainQueueSetup)

@end
