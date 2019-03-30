type OAuthProviderConfig = {
	CLIENT_ID: string;
	CLIENT_SECRET: string;
	REDIRECT_URI: string;
	TOKEN_PATH: string;
	TOKEN_FILENAME: string;
	SCOPES: string[];
	ACCESS_TYPE: string;
	CLIENT_COOKIE_NAME: string;
	URIS?: any;
};
