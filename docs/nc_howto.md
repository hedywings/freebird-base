How to create your netcore
========================

This document introduces things you should know about how to create your own netcore.

## 1. What is netcore?

Netcore is a network controller which equips with freebird-defined methods to accomplish operations of network transportation and management.  

## 2. Provide implementation of cookRawDev() and cookRawGad() for netcore

Since freebird has its own unified **Device** and **Gadget** class, and freebird doesn't know what your raw device and raw gadget data is. Thus, you should implement cookRawDev() and cookRawGad() to transform your raw data into the unified things that freebird can understand.

To implememt these two method. There are something you should know first.
dev.setNetInfo(), dev.setAttrs(), gad.setPanelInfo(), and gad.setAttrs().

## 3. Freebird unified Device class

The freebird unified Device class defines what information a device should have. The most important information about a device is the network info and device attributes.

To set network information for a device, use its method setNetInfo() to do this.

### dev.setNetInfo(info)

| Property     | Type    | Mandatory | Description                                   |
|--------------|---------|-----------|-----------------------------------------------|
| role         | String  | optional  | Server name                                   |
| parent       | String  | optional  | Permanent address                             |
| maySleep     | Boolean | optional  |                                               |
| sleepPeriod  | Number  | optional  |                                               |
| address      | Object  | required  | { permanent, dynamic }                        |

To set attributes for a device, use its method setAttrs() to do this.

### dev.setAttrs(attrs)

| Property     | Type    | Mandatory | Description                                   |
|--------------|---------|-----------|-----------------------------------------------|
| manufacturer | String  | optional  | Server name                                   |
| model        | String  | optional  | Server name                                   |
| serial       | String  | optional  | Server name                                   |
| version      | Object  | optional  | Server name                                   |
| power        | Object  | optional  | Server name                                   |


## 4. Freebird unified Gadget class

The freebird unified Gadget class defines what information a gadget should have. The most important information about a device is the panel info and gadget attributes.

To set panel information for a gadget, use its method setPanelInfo() to do this.

### dev.setPanelInfo(info)

| Property     | Type    | Mandatory | Description                                   |
|--------------|---------|-----------|-----------------------------------------------|
| profile      | String  | optional  | Server name                                   |
| class        | String  | required  | Permanent address                             |


## 5. cookRawDev()

I'll show you an example.

```js
{
    ieeeAddr: '0x12345678ABCD', // mac address
    nwkAddr: '0xABCD',          // ip address
    devType: 1,                 // router for a zigbee device
}
```

```js
var nc = new Netcore();

// cookRawDev = function(dev, rawDev, callback) { callback(err, dev) };

this.cookRawDev = function (dev, rawDev, callback) {

    dev.setNetInfo({
        role: 'router',
        maySleep: false,
        address: {
            permanent: rawDev.ieeeAddr,
            dynamic: rawDev.nwkAddr,
        }
    });

    dev.setAttrs({
        manufacturer: 'xxx',
        model: 'xxxx'
    });

    callback(null, dev);
};
```

## 6. cookRawGad()

```js
{
    ieeeAddr: '0x12345678ABCD', // mac address
    nwkAddr: '0xABCD',          // ip address
    devType: 1,                 // router for a zigbee device
}
```

```js
// cookRawGad = function(dev, rawGad, callback) { callback(err, dev) };

this.cookRawGad = function (gad, rawGad, callback) {

    gad.setPanelInfo({
        profile: 'home',
        class: 'presence',
    });

    gad.setAttrs({
        dInState: 5500,
        counter: 5501,
        counterReset: 5505,
    });

    callback(null, gad);
};
```

## 7. Network Drivers
nc.registerNetDrivers(netDrvs)

## 8. Device Drivers
nc.registerDevDrivers(devDrvs)

## 9. Gadget Drivers
nc.registerDevDrivers(gadDrvs)

## 10. Tell freebird there is something incoming

nc.commitDevIncoming(permAddr, rawDev)
nc.commitGadIncoming(permAddr, auxId, rawGad)

## 11. Tell freebird there is something leaving

nc.commitDevLeaving(permAddr)

## 12. Tell freebird here is a device report
nc.commitDevReporting(permAddr, devAttrs)

## 13. Tell freebird here is a gadget report
nc.commitGadReporting(permAddr, auxId, gadAttrs)


That's all!