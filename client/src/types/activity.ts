import { ActivityVerb } from "@/utils/activity.enum";

export interface Actor {
  _id: string;
  firstName: string;
  lastName: string;
  profileId: string;
}

export interface Activity {
  _id: string;
  actorId: Actor;
  targetId: string;
  verb: ActivityVerb;
  timestamp: string;
}
