export enum ActivityVerb {
  // Profile and Discovery Actions
  VIEWED_PROFILE = 'viewed_profile',
  VIEWED_CONTACT = 'viewed_contact',
  SHORTLISTED_PROFILE = 'shortlisted_profile',
  UNSHORTLISTED_PROFILE = 'unshortlisted_profile',
  BLOCKED_USER = 'blocked_user',
  REPORTED_USER = 'reported_user',
  SENT_PHOTO_REQUEST = 'sent_photo_request',
  ACCEPTED_PHOTO_REQUEST = 'accepted_photo_request',
  SENT_HOROSCOPE_REQUEST = 'sent_horoscope_request',
  ACCEPTED_HOROSCOPE_REQUEST = 'accepted_horoscope_request',

  // Communication and Interaction Actions
  SENT_INTEREST = 'sent_interest',
  ACCEPTED_INTEREST = 'accepted_interest',
  DECLINED_INTEREST = 'declined_interest',
  SENT_MESSAGE = 'sent_message',
  SENT_VIDEO_CALL_REQUEST = 'sent_video_call_request',
  ACCEPTED_VIDEO_CALL_REQUEST = 'accepted_video_call_request',
  CONNECTED_WITH_USER = 'connected_with_user',

  // Account and Membership Actions
  UPDATED_PROFILE = 'updated_profile',
  UPLOADED_PHOTO = 'uploaded_photo',
  SET_PROFILE_PHOTO = 'set_profile_photo',
  DELETED_PROFILE = 'deleted_profile',
  PURCHASED_MEMBERSHIP = 'purchased_membership',
  RENEWED_MEMBERSHIP = 'renewed_membership',
  LOGGED_IN = 'logged_in',

  // Search and Recommendation Actions
  PERFORMED_SEARCH = 'performed_search',
  VIEWED_RECOMMENDED_MATCH = 'viewed_recommended_match',
  USED_MATCH_FILTER = 'used_match_filter',
}
