export type PasskeyProfile = {
  display_name: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
};

export type PasskeyUserRecord = {
  userId: string;
  passkeyHash: string;
  passkeySalt: string;
  role: string;
  profile: PasskeyProfile;
};
