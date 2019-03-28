import { Credentials } from 'google-auth-library';

type GoogleUserOAuthToken = {
    userId: string;
    token: Credentials;
};
