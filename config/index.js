const localhost = '127.0.0.1'
const port = process.env.PORT || 3000
module.exports = {
  memoryLimitation: process.env.MAX_MEMORY_USAGE,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost/davidlevy',
  jwtSecret: process.env.JWT_SECRET || 'a secret phrase!!',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'a secret 2 phrase!!',
  secretsServiceSecret: process.env.SECRETS_SERVICE_SECRET || 'ENCRYPT_INTERNAL_DATA',
  assetsSecretsToken: process.env.ASSETS_SECRETS_TOKEN || 'assets-token-phrase',
  internalServicesSecret: process.env.INTERNAL_SECRET || (Date.now() / Number(Date.now().toString().substring(-5)) * Math.random()).toString(),
  applicationUrl: process.env.APPLICATION_URL,
  mailProvider: {
    service: process.env.MAIL_PROVIDER_SERVICE || 'gmail',
    email: process.env.MAIL_PROVIDER_EMAIL, // TODO: get email from app's configuration
    authType: process.env.MAIL_PROVIDER_AUTH_TYPE || 'basic',
    password: process.env.MAIL_PROVIDER_PW
  },
  authPort: process.env.AUTH_PORT || 9000,
  authIp: process.env.AUTH_IP || localhost,
  contentPort: process.env.CONTENT_PORT || 9001,
  contentIp: process.env.CONTENT_IP || localhost,
  secretsPort: process.env.SECRETS_PORT || 9002,
  secretsIp: process.env.SECRETS_IP || localhost,
  assetsPort: process.env.ASSETS_PORT || 9003,
  assetsIp: process.env.ASSETS_IP || localhost,
  adminPort: process.env.ADMIN_PORT || 3001,
  adminIp: process.env.ADMIN_IP || localhost,
  port,
  roles: {
    all: 'user,editor,admin',
    default: 'user',
    privileged: 'admin',
    editors: 'editor,admin'
  },
  frontTheme: process.env.FRONT_THEME || 'damal',
  redisUrl: process.env.REDIS_URL
}
