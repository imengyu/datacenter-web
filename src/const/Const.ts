


let ConstConfig = {
  API_PATH: (typeof process.env.API_PATH === 'string' ? process.env.API_PATH : '') ,
  API_HOST: (typeof process.env.API_HOST === 'string' ? process.env.API_HOST : ''),
  API_KEY: 'de0fd9503c9fc5c66fdaed4a6f79febb',
  API_SECRET: '9200ca2a92694893e1f59c757b24003b',
  AutoFlushAuthInfoTime: 30, //30min
}

export default ConstConfig;