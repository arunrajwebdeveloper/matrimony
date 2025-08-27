import { ActivityVerb } from "@/utils/activity.enum";

type ProfilePicture = {
  profilePicture?: string | null;
};
export interface Actor {
  _id: string;
  firstName: string;
  lastName: string;
  profileId: string;
  profile?: ProfilePicture;
}

export interface Activity {
  _id: string;
  actorId: Actor;
  targetId: string;
  verb: ActivityVerb;
  timestamp: string;
}
