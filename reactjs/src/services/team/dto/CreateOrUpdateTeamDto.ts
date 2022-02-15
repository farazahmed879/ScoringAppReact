export interface CreateOrUpdateTeamDto {
  id: number,
  name: string;
  contact: string;
  gender?: number;
  address: string;
  cnic: string;
  battingStyleId?: number;
  bowlingStyleId?: number;
  playerRoleId?: number;
  dob?: number;
  isGuestOrRegisterd: string;
  isDeactivated: boolean;
  fileName: string;
  teamId?: number;
}