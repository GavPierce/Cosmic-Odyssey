export interface Config {
  port?: string;
  sessionSecret?: string;
  sessionSecureCookies: boolean;
  connectionString?: string;
  serverUrl?: string;
  clientUrl?: string;
  cacheEnabled: boolean;
  smtp: {
    mailGunApi?: string;
    mailGunDomain?: string;
    enabled: boolean;
    host?: string;
    port?: string;
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
