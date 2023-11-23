import axios from "axios";
import BaseApiService from "./base";

class TeamService extends BaseApiService {
  createTeam(gameId, teamName, teamAvatar) {
    return axios.put(
      this.BASE_URL + "game/" + gameId + "/createTeam",
      {
        teamName,
        teamAvatar
      },
      {
        withCredentials: true
      }
    );
  }
  inviteTeamMember(gameId, teamId, memberId) {
    return axios.put(
      this.BASE_URL + "game/" + gameId + "/inviteTeamMember",
      {
        teamId,
        memberId
      },
      {
        withCredentials: true
      }
    );
  }
  joinTeam(gameId, teamId, memberId) {
    return axios.put(
      this.BASE_URL + "game/" + gameId + "/joinTeam",
      {
        teamId,
        memberId
      },
      {
        withCredentials: true
      }
    );
  }
  removeInviteeFromTeam(gameId, teamId, memberId) {
    return axios.patch(
      this.BASE_URL + "game/" + gameId + "/removeInviteeFromTeam",
      {
        teamId,
        memberId
      },
      {
        withCredentials: true
      }
    );
  }
}

export default new TeamService();
