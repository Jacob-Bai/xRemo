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
RCT_EXTERN_METHOD(hidServiceInit)
RCT_EXTERN_METHOD(
    start:
    (RCTPromiseResolveBlock)resolve
    rejecter:   (RCTPromiseRejectBlock)reject
)
RCT_EXTERN_METHOD(stop)
RCT_EXTERN_METHOD(
    sendMouseData: (NSArray<NSNumber *> *)data
    centrals: (NSArray<NSString *> *)centrals
)
RCT_EXTERN_METHOD(requiresMainQueueSetup)

@end
