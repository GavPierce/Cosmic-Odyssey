import EventEmitter from "events";
import { Game } from "./types/Game";
import DiplomacyService from "./diplomacy";
import Repository from "./repository";

import { DBObjectId } from "./types/DBObjectId";
const mongoose = require("mongoose");

export default class TeamService extends EventEmitter {
  diplomacyService: DiplomacyService;
  gameRepo: Repository<Game>;

  constructor(gameRepo: Repository<Game>, diplomacyService: DiplomacyService) {
    super();
    this.diplomacyService = diplomacyService;
    this.gameRepo = gameRepo;
  }

  async createTeam(
    game: Game,
    captainId: DBObjectId,
    teamName: string,
    teamAvatar: string | null
  ) {
    console.log("creating Team", captainId);
    // if this is the first team, add team list to game
    if (!game.galaxy.teams) {
      game.galaxy.teams = [
        {
          _id: mongoose.Types.ObjectId(),
          teamCaptain: captainId,
          teamName: teamName,
          teamAvatar: teamAvatar,
          members: [captainId],
          invited: [],
          isOpen: false,
        },
      ];
    } else {
      // check if team name is already taken
      game.galaxy.teams.forEach((team) => {
        if (team.teamName === teamName) {
          throw new Error("Team name already taken");
        }
      });
      // check if captain is already on a team
      game.galaxy.teams.forEach((team) => {
        if (team.members.includes(captainId)) {
          throw new Error("Captain is already on a team");
        }
      });

      // else add team to game
      game.galaxy.teams.push({
        _id: mongoose.Types.ObjectId(),
        teamCaptain: captainId,
        teamName: teamName,
        teamAvatar: teamAvatar,
        members: [captainId],
        invited: [],
        isOpen: false,
      });
    }

    await game.save();
  }
  async joinTeam(game: Game, teamId: DBObjectId, memberId: DBObjectId) {
    game.galaxy.teams.forEach((team) => {
      // get the team that matches this teamID
      if (team._id == teamId) {
        // Make Sure the Invitee Is Not already invited OR that he's on the team

        team.members.forEach((member) => {
          if (member == memberId) {
            throw new Error("User is already on team");
          }
        });
        if (team.members.includes(memberId)) {
          throw new Error("User is already on a different team");
        }
        team.members.push(memberId);

        // remove him from invitee
        this.removeInviteeFromTeam(game, teamId, memberId);
      }
    });
  }
  async inviteTeamMember(game: Game, teamId: DBObjectId, memberId: DBObjectId) {
    game.galaxy.teams.forEach((team) => {
      // get the team that matches this teamID
      if (team._id == teamId) {
        // Make Sure the Invitee Is Not already invited OR that he's on the team

        team.invited.forEach((invitee) => {
          if (invitee == memberId) {
            throw new Error("User is already on invited");
          }
        });

        team.members.forEach((member) => {
          if (member == memberId) {
            throw new Error("User is already on team");
          }
        });
        team.invited.push(memberId);
      }
    });

    // LETS SEND AN EMAIL!

    await game.save();
  }

  async removeInviteeFromTeam(
    game: Game,
    teamId: DBObjectId,
    memberId: DBObjectId
  ) {
    game.galaxy.teams.forEach((team) => {
      // get the team that matches this teamID
      if (team._id == teamId) {
        team.invited.forEach((invitee, index) => {
          // Make Sure the Invitee Is on the team

          if (invitee == memberId) {
            team.invited.splice(index, 1);
          }
        });
      }
    });

    await game.save();
  }
  getTeamMembersOfPlayer(game: Game, member: DBObjectId) {
    const teams = game.galaxy.teams;

    // Find the team that the player is in
    const playerTeam = teams.find((team) => {
      return team.members.some(
        (memberObj) => memberObj.toString() === member.toString()
      );
    });
    // If player's team is found, return all members of that team
    if (playerTeam) {
      return playerTeam.members.filter((memberObj) => memberObj !== member); // Exclude the player from the team members list
    } else {
      // Player's team not found
      return [];
    }
  }
  async _convertUserIdtoPlayerID(game: Game) {
    const teams = game.galaxy.teams;
    const players = game.galaxy.players;

    teams.forEach((team) => {
      team.members.forEach(async (member, index) => {
        const playerId = member;

        const correspondingPlayer = players.find(
          (player) => player.userId?.toString() === playerId.toString()
        );

        if (correspondingPlayer) {
          // Replace the member with player._id
          await this.gameRepo.updateOne(
            {
              _id: game._id,
              "galaxy.teams.members": playerId,
            },
            {
              $set: {
                "galaxy.teams.$[team].members.$[member]":
                  correspondingPlayer._id,
              },
            },
            {
              arrayFilters: [
                { "team.members": playerId },
                { member: playerId },
              ],
            }
          );
          team.members[index] = correspondingPlayer._id;
        }
      });
    });
    return teams;
  }
  async setMembersToAlly(game: Game) {
    // After much trial and error. We actually want to convert the team.members list from UserId to playerId now that all Players have joined
    let upDatedTeams = await this._convertUserIdtoPlayerID(game);
    game.galaxy.teams = upDatedTeams;

    await game.save();
    console.log("Did it work?", game.galaxy.teams);
    // set all team members of a game to ally themselves.
    const teams = game.galaxy.teams;
    console.log("Settings Members to Allys:", teams);
    teams.forEach((team) => {
      const members = team.members;

      for (let i = 0; i < members.length; i++) {
        const playerId = members[i];
        console.log("Checking Member:", playerId);

        for (let j = 0; j < members.length; j++) {
          const targetPlayerId = members[j];

          // Skip setting an ally to itself
          if (i !== j) {
            // Call the diplomacyService.declareAlly() method
            this.diplomacyService.declareAlly(
              game,
              playerId,
              targetPlayerId,
              true
            );
          }
        }
      }
    });
  }
}
