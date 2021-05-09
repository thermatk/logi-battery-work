# logi-battery-work
A simple Electron standalone app to oversee battery on Logitech G933 headset under Windows

## Research

USB IDs for Logitech G933: Vendor `0x046D` Product `0x0A5B`. Strangely, under Windows requires filtering a specific device with usagePage `65347`.

Magic sequence to receive battery state, 20 bytes:
```
0x11,0xFF,0x08,0x0A,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00
```

Answer has charging state as 6th byte (3 charging, 1 idle discharging, 0 headset not connected to receiver). 

Current voltage is in bytes 4 and 5. Voltage distribution for discharging state not linear, approx. from 3300 mV to 4100 mV. Approximated with polynomial regression in Excel :)
```
0.0000000025955081983333*Math.pow(voltage, 4)-0.0000390779442398669*Math.pow(voltage, 3)+0.220200303302581*Math.pow(voltage, 2)-550.202921127798*voltage+514241.158749987
```

Voltage in charging state not yet clear.

## Building

```
npm install
npm run rebuild
npm start
```

## Packaging

```
electron-builder -w portable
```


