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
  SECOND_INNING: 2,
  FIRST_INNING_ENDED: 3,
  MATCH_ENDED: 4,
};
export const IsLiveOrMannual = {
  LIVE: 1,
  MANNUAL: 2,
};

export const ERRORMESSAGE = {
  STRIKER_NOT_FOUND: 'Striker Not Found',
  NON_STRIKER_NOT_FOUND: 'Non-Striker Not Found',
};


export const dummyData = {
  currentInning: '',
  playingTeamId: 0,
  bowlingTeamId: 0,
  strikerId: 0,
  nonStrikerId: 0,
  overs: 0,
  currentOvers: 0,
  batsmans: {
    1: {
      runs: 0,
      id: 0,
      name: '',
      sixes: 0,
      fours: 0,
      balls: 0,
      timeline: [],
    },
    2: {
      runs: 0,
      id: 0,
      name: '',
      sixes: 0,
      fours: 0,
      balls: 0,
      timeline: [],
    },
  },
  bowler: {
    runs: 0,
    overs: 0,
    balls: 0,
    totalBalls: 0,
    wickets: 0,
    maidens: 0,
    timeline: [],
    id: 0,
    name: '',
    newOver: false,
  },
  team1: {
    runs: 0,
    teamId: 0,
    overs: 0,
    wickets: 0,
    name: '',
  },
  team2: {
    name: '',
    runs: 0,
    id: 0,
    wickets: 0,
    overs: 0,
  },
  partnership: {
    matchId: 0,
    teamId: 0,
    wicketNo: 0,
    totalRuns: 0,
    startTime: 0,
    endTime: 0,
    extras: 0,
    six: 0,
    four: 0,
    playerOutId: 0,
    //player2
    player1Id: 0,
    player1Name: 0,
    player1Runs: 0,
    player1Balls: 0,
    player1Six: 0,
    player1Four: 0,

    //player2
    player2Id: 0,
    player2Name: 0,
    player2Runs: 0,
    player2Balls: 0,
    player2Six: 0,
    player2Four: 0,
  },
  extras: {
    wides: 0,
    legByes: 0,
    byes: 0,
    NoBalls: 0,
  },
};
