export interface ISocialUser {
  email?: string;
  name?: string;
  social_provider: string;
  social_id: string;
}

// Google Profile interface
export interface IGoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: Array<{
    value: string;
    verified: boolean;
  }>;
  photos: Array<{
    value: string;
  }>;
}
