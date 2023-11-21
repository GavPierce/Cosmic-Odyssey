import { DBObjectId } from "./DBObjectId";

export interface Team {
  _id: DBObjectId;
  teamCaptain: DBObjectId;
  teamName: string;
  teamAvatar: string | null;
  members: DBObjectId[];
  invited: DBObjectId[];
  isOpen: boolean;
}
