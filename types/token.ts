export type Token = {
    accessToken: string;
    expiry: Date;
} & (
    | {
          type: 'standard';
          refreshToken: string;
      }
    | {
          type: 'implicit' | 'credentials';
      }
);

export type StandardToken = Token & { type: 'standard' };
export type CredentialsToken = Token & { type: 'credentials' };
export type ImplicitToken = Token & { type: 'implicit' };
