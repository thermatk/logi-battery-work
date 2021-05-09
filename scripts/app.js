/**
 * Logitech G Battery Reporter for Work PCs
 */

/*const ipc = require('electron').ipcRenderer;
document.getElementById("min-btn").addEventListener("click", function (e) {
    ipc.send('min');
});
document.getElementById("close-btn").addEventListener("click", function (e) {
    ipc.send('close');
});
*/

var HID = require('node-hid');
document.getElementById("devicelog").innerHTML=(JSON.stringify(HID.devices(),null, '  '));

var getHeadsetVoltageTimeout;
function getHeadsetVoltage () {
    var devices = HID.devices();
    console.log("node-hid loaded: devices:", devices);

    var deviceInfo = devices.find( function(d) {
        var isG933 = d.vendorId===0x046D && d.productId===0x0A5B && d.usagePage === 65347;
        return isG933;
    });
    
    if( deviceInfo ) {
        console.log("Selected Headset Device:", deviceInfo);
        var device = new HID.HID( deviceInfo.path );
        device.write( [0x11,0xFF,0x08,0x0A,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00] );
        device.read(function(err, data) {
            if (err) {
                console.log('Error', err);
            } else {
                if (data.length === 20) {
                    console.log('Proper data package received:', data);
                    
                    // Byte 6 is state
                    console.log('State:', data[6]);
                    // 3 charging, 1 on and idle, 0 off
                    if (data[6]===0x01) {
                        console.log('IDLE STATE');
                        // bytes 4 and 5 are voltage
                        document.getElementById("devicestate").innerText = "Headset discharging";
                        var voltage = (data[4] << 8) + (data[5]);
                        document.getElementById("voltage-gauge").setAttribute("data-value", voltage);
                        console.log(voltage);

                        var voltPerc = 0.0000000025955081983333*Math.pow(voltage, 4)-0.0000390779442398669*Math.pow(voltage, 3)+0.220200303302581*Math.pow(voltage, 2)-550.202921127798*voltage+514241.158749987;
                        if (voltPerc > 100) {
                            voltPerc = 100;
                        } else if (voltPerc < 0) {            
                            voltPerc = 0;
                        }
                        document.getElementById("perc-gauge").setAttribute("data-value", voltPerc);
                    } else if (data[6]===0x03) {
                        console.log('CHARGING STATE');
                        document.getElementById("devicestate").innerText = "Headset charging";
                        
                        var voltage = (data[4] << 8) + (data[5]);
                        document.getElementById("voltage-gauge").setAttribute("data-value", voltage);
                        document.getElementById("perc-gauge").setAttribute("data-value", 0);
                    } else if (data[6]===0x00) {
                        document.getElementById("devicestate").innerText = "Headset disconnected";
                        document.getElementById("voltage-gauge").setAttribute("data-value", 0);                        
                        document.getElementById("perc-gauge").setAttribute("data-value", 0);
                        console.log('OFF STATE');
                    } else {
                        console.log('Unexpected state');
                    }
                } else {
                    console.log('Unexpected data package received');
                }
            }
        });
        //device.close();
    }
    getHeadsetVoltageTimeout = setTimeout(getHeadsetVoltage, 90*1000);
}
getHeadsetVoltage();

document.getElementById("updatetoggle").addEventListener("click", function (e) {
    clearTimeout(getHeadsetVoltageTimeout);
    getHeadsetVoltage();
});

document.getElementById("devicelogtoggle").addEventListener("click", function (e) {
    var x = document.getElementById("devicelog");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
});