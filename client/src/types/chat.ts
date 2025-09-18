export interface ChatUser {
  _id?: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  gender: string;
  profileId?: string;
}

export interface ChatState {
  user: ChatUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface ChatContextType extends ChatState {
  isOpenChat: boolean;
  setIsOpenChat: React.Dispatch<React.SetStateAction<boolean>>;
  dispatch: (action: ChatAction) => void;
}

export interface ChatResult {
  success: boolean;
  error?: string;
}

export enum ChatActionType {
  LOGIN_START = "LOGIN_START",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
}

export type ChatAction =
  | { type: ChatActionType.LOGIN_START }
  | { type: ChatActionType.LOGIN_SUCCESS; payload: { user: ChatUser } }
  | { type: ChatActionType.LOGIN_FAILURE; payload: string };
