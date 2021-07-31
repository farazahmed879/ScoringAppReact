export interface CreateOrUpdatePlayerDto {
    name: string;
    contact: string;
    gender: number;
    address: string;
    cnic: number;
    battingStyleId: number;
    bowlingStyleId: number;
    playerRoleId: number;
    dob: number;
    isGuestOrRegisterd: boolean;
    isDeactivated: boolean;
    fileName: string;
    teamId: number;
  }