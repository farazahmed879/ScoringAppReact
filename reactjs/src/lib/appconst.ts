const AppConsts = {
  userManagement: {
    defaultAdminUserName: 'admin',
  },
  localization: {
    defaultLocalizationSourceName: 'ScoringAppReact',
  },
  authorization: {
    encrptedAuthTokenName: 'enc_auth_token',
  },
  appBaseUrl: process.env.REACT_APP_APP_BASE_URL,
  remoteServiceBaseUrl: process.env.REACT_APP_REMOTE_SERVICE_BASE_URL,
  friendly: 3,
  tournament: 1,
  series: 2,
  dummyImage: 'https://i.postimg.cc/MpCw1mds/istockphoto-1223671392-612x612.jpg',
};
export default AppConsts;
