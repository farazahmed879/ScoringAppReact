export const genderOptions = [
  { id: 1, name: 'Female' },
  { id: 2, name: 'Male' },
];
export const battingStyleOptions = [
  { id: 1, name: 'Right-Handed' },
  { id: 2, name: 'Left-Handed' },
];
export const bowlingStyleOptions = [
  { id: 1, name: 'Right-arm fast' },
  { id: 2, name: 'Right-arm fast-medium' },
  { id: 3, name: 'Right-arm medium' },
  { id: 4, name: 'Left-arm fast' },
  { id: 5, name: 'Left-arm fast-medium' },
  { id: 6, name: 'Right-arm off-break' },
  { id: 7, name: 'Right-arm leg-break' },
  { id: 8, name: 'left-arm orthodox' },
  { id: 9, name: 'left-arm china-man' },
];
export const playingRoleOptions = [
  { id: 1, name: 'Batsman' },
  { id: 2, name: 'Bowler' },
  { id: 3, name: 'All-Rounder' },
  { id: 4, name: 'Wicket-Keepr Batsman' },
];
export const teamTypeOptions = [
  { id: 1, name: 'Local' },
  { id: 2, name: 'Club' },
  { id: 3, name: 'Multi-National' },
  { id: 4, name: 'Departmental' },
  { id: 5, name: 'School' },
  { id: 6, name: 'College' },
  { id: 7, name: 'University' },
  { id: 8, name: 'Office' },
];
export const matchTypes = [
  { id: 1, name: 'Tournament' },
  { id: 2, name: 'Series' },
  { id: 3, name: 'Friendly' },
];
export const eventStage = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
];
export const howOutOptions = [
  { id: 1, name: 'Not Out' },
  { id: 2, name: 'Bowled' },
  { id: 3, name: 'Catch' },
  { id: 4, name: 'Stump' },
  { id: 5, name: 'Hit Wicket' },
  { id: 6, name: 'LBW' },
  { id: 7, name: 'Run Out' },
];
export const positions = [
  { id: 1, name: 1 },
  { id: 2, name: 2 },
  { id: 3, name: 3 },
  { id: 4, name: 4 },
  { id: 5, name: 5 },
  { id: 6, name: 6 },
  { id: 7, name: 7 },
  { id: 8, name: 8 },
  { id: 9, name: 9 },
  { id: 10, name: 10 },
  { id: 11, name: 11 },
];
export const eventTypes = [
  { id: 1, name: 'Tournament' },
  { id: 2, name: 'Series' },
];

export const tournamentTypes = [
  { id: 1, name: 'Knock-out' },
  { id: 2, name: 'League Based' },
];

export const wicketOptions = [
  {
    id: 1,
    name: 'Not Out',
  },
  {
    id: 2,
    name: 'Bowled',
  },
  {
    id: 3,
    name: 'Catch',
  },
  {
    id: 4,
    name: 'Stump',
  },
  {
    id: 5,
    name: 'Hit Wicket',
  },
  {
    id: 6,
    name: 'Lbw',
  },
  {
    id: 7,
    name: 'Retired',
  },
  {
    id: 7,
    name: 'Run Out',
  },
];

export const noBallOptions = [
  {
    id: 0,
    name: '0',
  },
  {
    id: 1,
    name: '1',
  },
  {
    id: 2,
    name: '2',
  },
  {
    id: 3,
    name: '3',
  },
  {
    id: 4,
    name: '4',
  },
  {
    id: 5,
    name: '5',
  },
  {
    id: 6,
    name: '6',
  },
  {
    id: 7,
    name: '7',
  },
];
export const wideOptions = [
  {
    id: 0,
    name: '0',
  },
  {
    id: 1,
    name: '1',
  },
  {
    id: 2,
    name: '2',
  },
  {
    id: 3,
    name: '3',
  },
  {
    id: 4,
    name: '4',
  },
  {
    id: 5,
    name: '5',
  },
  {
    id: 6,
    name: '6',
  },
  {
    id: 7,
    name: '7',
  },
];
export const byOptions = [
  {
    id: 1,
    name: '1',
  },
  {
    id: 2,
    name: '2',
  },
  {
    id: 3,
    name: '3',
  },
  {
    id: 4,
    name: '4',
  },
  {
    id: 5,
    name: '5',
  },
  {
    id: 6,
    name: '6',
  },
  {
    id: 7,
    name: '7',
  },
];
export const legByOptions = [
  {
    id: 1,
    name: '1',
  },
  {
    id: 2,
    name: '2',
  },
  {
    id: 3,
    name: '3',
  },
  {
    id: 4,
    name: '4',
  },
  {
    id: 5,
    name: '5',
  },
  {
    id: 6,
    name: '6',
  },
  {
    id: 7,
    name: '7',
  },
];

export const matchSettings = [
  {
    id: 1,
    name: 'Exit Match',
  },
  {
    id: 2,
    name: 'Suspend Inning',
  },
  {
    id: 3,
    name: 'Refresh',
  },
];

const generateEnum = (data = []) => {
  return data.reduce((a, v) => ({ ...a, [v.name.replace(/[^A-Z0-9]/gi, '_')]: v.id }), {});
};


export const WICKETCONST = generateEnum(wicketOptions);
