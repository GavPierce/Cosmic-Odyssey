export interface Config {
  port?: string;
  sessionSecret?: string;
  sessionSecureCookies: boolean;
  sameSite?: string;
  connectionString?: string;
  serverUrl?: string;
  clientUrl?: string;
  cacheEnabled: boolean;
  smtp: {
    enabled: boolean;
    mailGunUsername?: string;
    mailGunPassword?: string;
    from?: string;
  };
  google: {
    recaptcha: {
      enabled: boolean;
      siteKey?: string;
      secretKey?: string;
    };
  };
  paypal: {
    environment: string;
    clientId?: string;
    clientSecret?: string;
  };
  discord: {
    serverId?: string;
    clientId?: string;
    clientSecret?: string;
    oauthRedirectUri?: string;
    botToken?: string;
  };
}
