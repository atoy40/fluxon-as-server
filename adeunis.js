// express middleware to decode Adeunis payload
module.exports = function(req, res, next) {

  var payload = req.body.frmPayload;

  var ret = {};
  var shift = 0;
  var status = payload[0];
  var temp_is_present = status & 0x80;
  var acc_is_present = status & 0x40;
  var btn1_is_present = status & 0x20;
  var gps_is_present = status & 0x10;
  var up_is_present = status & 0x08;
  var down_is_present = status & 0x04;
  var batt_is_present = status & 0x02;
  var rssi_is_present = status & 0x01;

  ret.temp = payload[1];
  ret.btn1 = btn1_is_present;

  if (gps_is_present) {
    shift = 8
    ret.gps = true
    ret.lat = ((payload[2] & 0xF0 ) >> 4)*10 + (payload[2] & 0x0F)
    ret.lat += ((((payload[3] & 0xF0 ) >> 4)*10 + (payload[3] & 0x0F) +
               (((payload[4] & 0xF0) >> 4) / 10) +
               ((payload[4] & 0x0F) / 100 ) +
               ((payload[5] & 0xF0) >> 4) /1000)) /60

    ret.lon = ((payload[6] & 0xF0 ) >> 4)*100 + (payload[6] & 0x0F )*10 + ((payload[7] & 0xF0) >> 4) // degree
    ret.lon += (((payload[7] & 0x0F )* 10 + ((payload[8] & 0xF0) >> 4) +
               ((payload[8] & 0x0F) / 10) + ((payload[9] & 0xF0) >> 4) / 100)) /60

    ret.lat = ret.lat.toFixed(6)
    ret.lon = ret.lon.toFixed(6)
  } else {
    ret.gps=false
  }

  ret.uplink = payload[2+shift];
  ret.down = payload[3+shift];
  ret.vbat = ((payload[4+shift] << 8) + payload[5+shift]) / 1000;

  if (rssi_is_present) {
    ret.rssi = payload[6+shift] * -1
    ret.snr =  payload[7+shift]
  }

  req.body.decodedPayload = ret;

  next();
}
