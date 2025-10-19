import NodeGeocoder from 'node-geocoder';

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY, // For some providers
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

export default geocoder;