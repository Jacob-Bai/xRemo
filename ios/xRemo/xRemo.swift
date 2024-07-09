//
//  xRemo.swift
//  xRemo
//
//  Created by Jacob Bai on 9/7/2024.
//

import Foundation
import CoreBluetooth

@objc(BLEPeripheral)
class BLEPeripheral: RCTEventEmitter, CBPeripheralManagerDelegate {
    var advertising: Bool = false
    var hasListeners: Bool = false
    var name: String = "RN_BLE"
    var servicesMap = Dictionary<String, CBMutableService>()
    var manager: CBPeripheralManager!
    var startPromiseResolve: RCTPromiseResolveBlock?
    var startPromiseReject: RCTPromiseRejectBlock?
    
    override init() {
        super.init()
        manager = CBPeripheralManager(delegate: self, queue: nil, options: nil)
        print("BLEPeripheral initialized, advertising: \(advertising)")
    }
    
    //// PUBLIC METHODS

    @objc func setName(_ name: String) {
        self.name = name
        print("name set to \(name)")
    }
    
    @objc func isAdvertising(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(advertising)
        print("called isAdvertising")
    }
    
    @objc(addService:primary:)
    func addService(_ uuid: String, primary: Bool) {
        let serviceUUID = CBUUID(string: uuid)
      let service: CBMutableService = CBMutableService(type: serviceUUID, primary: true)
      service.characteristics = []
        if(servicesMap.keys.contains(uuid) != true){
            servicesMap[uuid] = service
            print("added service \(uuid)")
        }
        else {
            alertJS("service \(uuid) already there")
        }
    }
    
    @objc(addCharacteristicToService:uuid:permissions:properties:data:)
    func addCharacteristicToService(_ serviceUUID: String, uuid: String, permissions: UInt, properties: UInt, data: String) {
        let characteristicUUID = CBUUID(string: uuid)
        let propertyValue = CBCharacteristicProperties(rawValue: properties)
        let permissionValue = CBAttributePermissions(rawValue: permissions)
//        let byteData: Data = data.data(using: .utf8)!
      let characteristic: CBMutableCharacteristic = CBMutableCharacteristic(type: characteristicUUID, properties: propertyValue, value: nil, permissions: [.readable, .writeable])
      servicesMap[serviceUUID]!.characteristics!.append(characteristic)
      print("added characteristic \(String(describing: servicesMap[serviceUUID]?.characteristics?.last?.service)) to service")
    }
  
    @objc func addHIDCharacteristicToService() {
    let serviceUUID = "00001812-0000-1000-8000-00805F9B34FB"
    let hidInformationCharacteristicUUID = CBUUID(string: "00002A4A-0000-1000-8000-00805F9B34FB")
    let hidControlPointCharacteristicUUID = CBUUID(string: "00002A4C-0000-1000-8000-00805F9B34FB")
    let reportMapCharacteristicUUID = CBUUID(string: "00002A4B-0000-1000-8000-00805F9B34FB")
    let reportCharacteristicUUID = CBUUID(string: "00002A4D-0000-1000-8000-00805F9B34FB")
    
    // HID Information Characteristic
    let hidInformation = CBMutableCharacteristic(
        type: hidInformationCharacteristicUUID,
        properties: [.read],
        value: Data([0x01, 0x01, 0x00, 0x03]), // HID Version 1.1, Country Code 0, Flags
        permissions: [.readable]
    )
    
    // HID Control Point Characteristic
    let hidControlPoint = CBMutableCharacteristic(
        type: hidControlPointCharacteristicUUID,
        properties: [.writeWithoutResponse],
        value: nil,
        permissions: [.writeable]
    )
    
    // HID Report Map Characteristic
    let hidReportDescriptor: [UInt8] = [
        0x05, 0x01, // Usage Page (Generic Desktop)
        0x09, 0x02, // Usage (Mouse)
        0xA1, 0x01, // Collection (Application)
        0x85, 0x01, // REPORT_ID (1)
        0x09, 0x01, // Usage (Pointer)
        0xA1, 0x00, // Collection (Physical)
        0x05, 0x09, // Usage Page (Buttons)
        0x19, 0x01, // Usage Minimum (1)
        0x29, 0x03, // Usage Maximum (3)
        0x15, 0x00, // Logical Minimum (0)
        0x25, 0x01, // Logical Maximum (1)
        0x95, 0x03, // Report Count (3)
        0x75, 0x01, // Report Size (1)
        0x81, 0x02, // Input (Data, Variable, Absolute) ;3 button bits
        0x95, 0x01, // Report Count (1)
        0x75, 0x05, // Report Size (5)
        0x81, 0x03, // Input (Constant) ;5 bit padding
        0x05, 0x01, // Usage Page (Generic Desktop)
        0x09, 0x30, // Usage (X)
        0x09, 0x31, // Usage (Y)
        0x09, 0x38, // Usage (Wheel)
        0x15, 0x81, // Logical Minimum (-127)
        0x25, 0x7F, // Logical Maximum (127)
        0x75, 0x08, // Report Size (8)
        0x95, 0x03, // Report Count (3)
        0x81, 0x06, // Input (Data, Variable, Relative) ;2 position bytes (X & Y)
        0xC0,       // End Collection
        0xC0        // End Collection
    ]
    

    let reportMapCharacteristic = CBMutableCharacteristic(
        type: reportMapCharacteristicUUID,
        properties: [.read],
        value: Data(hidReportDescriptor),
        permissions: [.readable]
    )
    
    // Report Characteristic for mouse data
    let reportCharacteristic = CBMutableCharacteristic(
        type: reportCharacteristicUUID,
        properties: [.read, .notify],
        value: nil,
        permissions: [.readable, .writeable]
    )
    // Report Reference Descriptor
    let reportReferenceDescriptor = CBMutableDescriptor(
        type: CBUUID(string: "2908"),
        value: Data([0x01, 0x01]) // Report ID 1, Report Type Input (0x01)
    )
    
    // Add descriptor to characteristic
    reportCharacteristic.descriptors = [reportReferenceDescriptor]
    
    servicesMap[serviceUUID]!.characteristics!.append(hidInformation)
    servicesMap[serviceUUID]!.characteristics!.append(hidControlPoint)
    servicesMap[serviceUUID]!.characteristics!.append(reportMapCharacteristic)
    servicesMap[serviceUUID]!.characteristics!.append(reportCharacteristic)
    print("added characteristic \(String(describing: servicesMap[serviceUUID]?.characteristics?.last?.service)) to service")
  }
  
    
    @objc func start(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        if (manager.state != .poweredOn) {
            alertJS("Bluetooth turned off")
            return;
        }
        
        startPromiseResolve = resolve
        startPromiseReject = reject
        
        for (_, service) in servicesMap {
            manager.add(service)
        }
        let advertisementData = [
            CBAdvertisementDataLocalNameKey: name,
            CBAdvertisementDataServiceUUIDsKey: [CBUUID(string: "1812")]
            ] as [String : Any]
        manager.startAdvertising(advertisementData)
    }
    
    @objc func stop() {
        manager.stopAdvertising()
        advertising = false
        print("called stop")
    }

    @objc(sendNotificationToDevices:characteristicUUID:data:)
    func sendNotificationToDevices(_ serviceUUID: String, characteristicUUID: String, data: [NSNumber]) {
        if(servicesMap.keys.contains(serviceUUID) == true){
            let service = servicesMap[serviceUUID]!
            let characteristic = getCharacteristicForService(service, characteristicUUID)
          if (characteristic == nil) {
            alertJS("service \(serviceUUID) does NOT have characteristic \(characteristicUUID)")
            return;
          }

          let byteData = Data(data.map{$0.uint8Value}) //
//            let char = characteristic as! CBMutableCharacteristic
          let success = manager.updateValue( byteData, for: characteristic! as! CBMutableCharacteristic, onSubscribedCentrals: nil)
            if (success){
                print("changed data for characteristic \(characteristicUUID)")
            } else {
                alertJS("failed to send changed data for characteristic \(characteristicUUID)")
            }

        } else {
            alertJS("service \(serviceUUID) does not exist")
        }
    }
    
    //// EVENTS

    // Respond to Read request
    func peripheralManager(peripheral: CBPeripheralManager, didReceiveReadRequest request: CBATTRequest)
    {
        let characteristic = getCharacteristic(request.characteristic.uuid)
        if (characteristic != nil){
            request.value = characteristic?.value
            manager.respond(to: request, withResult: .success)
        } else {
            alertJS("cannot read, characteristic not found")
        }
    }

    // Respond to Write request
    func peripheralManager(peripheral: CBPeripheralManager, didReceiveWriteRequests requests: [CBATTRequest])
    {
        for request in requests
        {
            let characteristic = getCharacteristic(request.characteristic.uuid)
            if (characteristic == nil) { alertJS("characteristic for writing not found") }
            if request.characteristic.uuid.isEqual(characteristic?.uuid)
            {
                let char = characteristic as! CBMutableCharacteristic
                char.value = request.value
            } else {
                alertJS("characteristic you are trying to access doesn't match")
            }
        }
        manager.respond(to: requests[0], withResult: .success)
    }

    // Respond to Subscription to Notification events
    func peripheralManager(_ peripheral: CBPeripheralManager, central: CBCentral, didSubscribeTo characteristic: CBCharacteristic) {
        let char = characteristic as! CBMutableCharacteristic
        print("subscribed centrals: \(String(describing: char.subscribedCentrals))")
    }

    // Respond to Unsubscribe events
    func peripheralManager(_ peripheral: CBPeripheralManager, central: CBCentral, didUnsubscribeFrom characteristic: CBCharacteristic) {
        let char = characteristic as! CBMutableCharacteristic
        print("unsubscribed centrals: \(String(describing: char.subscribedCentrals))")
    }

    // Service added
    func peripheralManager(_ peripheral: CBPeripheralManager, didAdd service: CBService, error: Error?) {
        if let error = error {
            alertJS("error: \(error)")
            return
        }
        print("service: \(service)")
    }

    // Bluetooth status changed
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        var state: Any
        if #available(iOS 10.0, *) {
            state = peripheral.state.description
        } else {
            state = peripheral.state
        }
        alertJS("BT state change: \(state)")
    }

    // Advertising started
    func peripheralManagerDidStartAdvertising(_ peripheral: CBPeripheralManager, error: Error?) {
        if let error = error {
            alertJS("advertising failed. error: \(error)")
            advertising = false
            startPromiseReject!("AD_ERR", "advertising failed", error)
            return
        }
        advertising = true
        startPromiseResolve!(advertising)
        print("advertising succeeded!")
    }
    
    //// HELPERS

    func getCharacteristic(_ characteristicUUID: CBUUID) -> CBCharacteristic? {
        for (uuid, service) in servicesMap {
            for characteristic in service.characteristics ?? [] {
                if (characteristic.uuid.isEqual(characteristicUUID) ) {
                    print("service \(uuid) does have characteristic \(characteristicUUID)")
                    if (characteristic is CBMutableCharacteristic) {
                        return characteristic
                    }
                    print("but it is not mutable")
                } else {
                    alertJS("characteristic you are trying to access doesn't match")
                }
            }
        }
        return nil
    }

    func getCharacteristicForService(_ service: CBMutableService, _ characteristicUUID: String) -> CBCharacteristic? {
        for characteristic in service.characteristics ?? [] {
            if (characteristic.uuid.isEqual(CBUUID(string: characteristicUUID)) ) {
                print("service \(service.uuid) does have characteristic \(characteristicUUID)")
                if (characteristic is CBMutableCharacteristic) {
                    return characteristic
                }
                print("but it is not mutable")
            } else {
                alertJS("characteristic you are trying to access doesn't match")
            }
        }
        return nil
    }

    func getServiceUUIDArray() -> Array<CBUUID> {
        var serviceArray = [CBUUID]()
        for (_, service) in servicesMap {
            serviceArray.append(service.uuid)
        }
        return serviceArray
    }

    func alertJS(_ message: Any) {
        print(message)
        if(hasListeners) {
            sendEvent(withName: "onWarning", body: message)
        }
    }

    @objc override func supportedEvents() -> [String]! { return ["onWarning"] }
    override func startObserving() { hasListeners = true }
    override func stopObserving() { hasListeners = false }
    @objc override static func requiresMainQueueSetup() -> Bool { return false }
    
}

@available(iOS 10.0, *)
extension CBManagerState: CustomStringConvertible {
    public var description: String {
        switch self {
        case .poweredOff: return ".poweredOff"
        case .poweredOn: return ".poweredOn"
        case .resetting: return ".resetting"
        case .unauthorized: return ".unauthorized"
        case .unsupported: return ".unsupported"
        case .unknown: return ".unknown"
        default: return "unknown"
        }
    }
}

