import { DBObjectId } from "./types/DBObjectId";
import ValidationError from "../errors/validation";
import Repository from "./repository";
import { Avatar, UserAvatar } from "./types/Avatar";
import { User } from "./types/User";
import UserService from "./user";

export default class AvatarService {
  userRepo: Repository<User>;
  userService: UserService;

  constructor(userRepo: Repository<User>, userService: UserService) {
    this.userRepo = userRepo;
    this.userService = userService;
  }

  listAllAvatars(): Avatar[] {
    return require("../config/game/avatars").slice();
  }

  listAllCosmicOdysseyAvatars(): Avatar[] {
    return this.listAllAvatars().filter((a) => !a.isPatronAvatar);
  }

  listAllAliases(): string[] {
    return require("../config/game/aliases").slice();
  }

  async listUserAvatars(userId: DBObjectId): Promise<UserAvatar[]> {
    let avatars = require("../config/game/avatars").slice();

    let userAvatars = await this.userRepo.findById(userId, {
      avatars: 1,
    });

    if (!userAvatars) {
      return [];
    }

    for (let avatar of avatars) {
      avatar.purchased =
        avatar.price == null ||
        (userAvatars.avatars || []).indexOf(avatar.id) > -1;
    }

    return avatars;
  }

  async getUserAvatar(
    userId: DBObjectId,
    avatarId: number
  ): Promise<UserAvatar> {
    return (await this.listUserAvatars(userId)).find((a) => a.id === avatarId)!;
  }

  async purchaseAvatar(userId: DBObjectId, avatarId: number) {
    let userCredits = await this.userService.getCredits(userId);
    let avatar = await this.getUserAvatar(userId, avatarId);

    if (!avatar) {
      throw new ValidationError(`Avatar ${avatarId} does not exist.`);
    }

    if (avatar.purchased) {
      throw new ValidationError(`You have already purchased this avatar.`);
    }

    if (userCredits < avatar.price) {
      throw new ValidationError(
        `You do not have enough credits to purchase this avatar. The cost is ${avatar.price} credits, you have ${userCredits}.`
      );
    }

    await this.userRepo.updateOne(
      {
        _id: userId,
      },
      {
        $inc: {
          credits: -avatar.price,
        },
        $addToSet: {
          avatars: avatarId,
        },
      }
    );
  }
}
