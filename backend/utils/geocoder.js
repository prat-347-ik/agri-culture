import NodeGeocoder from 'node-geocoder';

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  // OpenStreetMap Nominatim requires a user-agent header
  // It can be any string that identifies your app.
  userAgent: 'AgriCultureApp/1.0',
  formatter: null,
};

const geocoder = NodeGeocoder(options);

export default geocoder;