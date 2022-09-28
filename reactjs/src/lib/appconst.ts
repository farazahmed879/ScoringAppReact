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

export const Extras = {
  NO_EXTRA: 0,
  WIDE: 1,
  NO_BALLS: 2,
  LEG_BYES: 3,
  BYES: 4,
};

export const MatchStatus = {
  STARTED: 1,
  BREAK: 2,
  ENDED: 3,
  SUSPENDED: 4,
};

export const ScoringBy = {
  MANNUAL: 1,
  MOBAPP: 2,
  WEBAPP: 3,
};

export const InningConst = {
  FIRST_INNING: 1,
  SECOND_INNING: 2
};
