/* This file will contain the PlaybulbCandle Class that will be used to
 * interact with the PLAYBULB Candle Bluetooth device. */

(function () {
  'use strict';

  const CANDLE_SERVICE_UUID = 0xFF02;
  const CANDLE_COLOR_UUID = 0xFFFC;
  const CANDLE_EFFECT_UUID = 0xFFFB;

  class PlaybulbCandle {
    constructor() {
      this.device = null;
    }

    connect() {
      let options = {
        filters: [{ services: [CANDLE_SERVICE_UUID] }],
        optionalServices: ['battery_service']
      };
      return navigator.bluetooth.requestDevice(options)
        .then(device => {
          this.device = device;
          return device.gatt.connect();
        });
    }

    getDeviceName() {
      return this.device.gatt.getPrimaryService(CANDLE_SERVICE_UUID)
        .then(service => service.getCharacteristic(CANDLE_DEVICE_NAME_UUID))
        .then(characteristic => characteristic.readValue())
        .then(data => {
          let decoder = new TextDecoder('utf-8');
          return decoder.decode(data);
        });
    }

    getBatteryLevel() {
      return this.device.gatt.getPrimaryService('battery_service')
        .then(service => service.getCharacteristic('battery_level'))
        .then(characteristic => characteristic.readValue())
        .then(data => data.getUint8(0));
    }

    setColor(r, g, b) {
      let data = new Uint8Array([0x00, r, g, b]);
      return this.device.gatt.getPrimaryService(CANDLE_SERVICE_UUID)
        .then(service => service.getCharacteristic(CANDLE_COLOR_UUID))
        .then(characteristic => characteristic.writeValue(data))
        .then(() => [r, g, b]);
    }

    setCandleEffectColor(r, g, b) {
      let data = new Uint8Array([0x00, r, g, b, 0x04, 0x00, 0x01, 0x00]);
      return this.device.gatt.getPrimaryService(CANDLE_SERVICE_UUID)
        .then(service => service.getCharacteristic(CANDLE_EFFECT_UUID))
        .then(characteristic => characteristic.writeValue(data))
        .then(() => [r, g, b]);
    }

    setFlashingColor(r, g, b) {
      let data = new Uint8Array([0x00, r, g, b, 0x00, 0x00, 0x1F, 0x00]);
      return this.device.gatt.getPrimaryService(CANDLE_SERVICE_UUID)
        .then(service => service.getCharacteristic(CANDLE_EFFECT_UUID))
        .then(characteristic => characteristic.writeValue(data))
        .then(() => [r, g, b]);
    }
  }
  window.playbulbCandle = new PlaybulbCandle();

})();