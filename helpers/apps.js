const config = require('../config')

const DEV = 'development'
const PROD = 'production'

const node_args = config.memoryLimitation ?
  [
    '--optimize_for_size',
    '--max_old_space_size=' + parseInt(Number(config.memoryLimitation) * 0.8)
  ] :
  ''

const basicHttpServiceOpts = {
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: config.memoryLimitation ? `${config.memoryLimitation}M` : '1G',
  node_args
}

const authServiceRef = {
  AUTH_SERVICE_PORT: config.authPort,
  AUTH_SERVICE_IP: config.authIp
}

const authServiceVariables = {
  MONGO_URI: config.mongoUri,
  JWT_SECRET: config.jwtSecret,
  REFRESH_TOKEN_SECRET: config.refreshTokenSecret,
  PORT: config.authPort,
  IP: config.authIp,
  ROLES: config.roles.all,
  DEFAULT_ROLE: config.roles.default,
  PRIVILEGED_ROLES: config.roles.privileged,
  MAIL_PROVIDER_SERVICE: config.mailProvider.service,
  MAIL_PROVIDER_EMAIL: config.mailProvider.email,
  MAIL_PROVIDER_AUTH_TYPE: config.mailProvider.authType,
  MAIL_PROVIDER_PW: config.mailProvider.password,
  APPLICATION_URL: config.applicationUrl,
  REDIS_URL: config.redisUrl
}

const db = process.env.npm_config_noDocker ?
  {
    name: 'db',
    script: 'mongod',
    args: '--dbpath ./db-data',
    instances: 1,
  } : {
    name: 'db',
    script: 'docker',
    args: `run -p 27017-27019:27017-27019 -v ${process.cwd()}/db-data:/data/db mongo`,
    instances: 1
  }

module.exports = {
  db,
  secrets: {
    name: 'secrets',
    script: './secrets/index.js',
    ...basicHttpServiceOpts,
    env: {
      NODE_ENV: DEV,
      MONGO_URI: config.mongoUri,
      PORT: config.secretsPort,
      SECRET: config.secretsServiceSecret,
      INTERNAL_SECRET: config.internalServicesSecret,
      IP: config.secretsIp,
    },
    env_production: {
      NODE_ENV: PROD,
      MONGO_URI: config.mongoUri,
      PORT: config.secretsPort,
      IP: config.secretsIp,
      SECRET: config.secretsServiceSecret,
      INTERNAL_SECRET: config.internalServicesSecret,
    }
  },
  auth: {
    name: 'auth',
    script: './auth/index.js',
    ...basicHttpServiceOpts,
    env: {
      NODE_ENV: DEV,
      ...authServiceVariables,
    },
    env_production: {
      NODE_ENV: PROD,
      ...authServiceVariables
    }
  },
  content: {
    name: 'content',
    script: './content/index.js',
    ...basicHttpServiceOpts,
    env: {
      NODE_ENV: DEV,
      MONGO_URI: config.mongoUri,
      PORT: config.contentPort,
      IP: config.contentIp,
      ...authServiceRef,
      EDITORS_ROLES: config.roles.editors,
      REDIS_URL: config.redisUrl
    },
    env_production: {
      MONGO_URI: config.mongoUri,
      PORT: config.contentPort,
      IP: config.contentIp,
      ...authServiceRef,
      EDITORS_ROLES: config.roles.editors,
      NODE_ENV: PROD,
      REDIS_URL: config.redisUrl
    }
  },
  assets: {
    name: 'assets',
    script: './assets/index.js',
    ...basicHttpServiceOpts,
    env: {
      NODE_ENV: DEV,
      MONGO_URI: config.mongoUri,
      PORT: config.assetsPort,
      IP: config.assetsIp,
      SECRETS_TOKEN: config.secretsServiceSecret,
      INTERNAL_SECRET: config.internalServicesSecret,
      ...authServiceRef
    },
    env_production: {
      NODE_ENV: PROD,
      MONGO_URI: config.mongoUri,
      PORT: config.assetsPort,
      IP: config.assetsIp,
      SECRETS_TOKEN: config.assetsSecretsToken,
      INTERNAL_SECRET: config.internalServicesSecret,
      ...authServiceRef
    }
  },
  front: {
    name: 'front',
    script: 'cd blog-front && npm start',
    ...basicHttpServiceOpts,
    env: {
      PORT: config.port,
      THEME: config.frontTheme,
      NODE_ENV: DEV,
      TENANT: config.tenant,
      APPLICATION_URL: config.applicationUrl
    },
    env_production: {
      PORT: config.port,
      THEME: config.frontTheme,
      NODE_ENV: PROD,
      TENANT: config.tenant,
      APPLICATION_URL: config.applicationUrl
    }
  },
  admin: {
    name: 'admin',
    script: './admin/server.js',
    ...basicHttpServiceOpts,
    env: {
      PORT: config.adminPort,
      NODE_ENV: DEV,
      BASE_URL: '/gp-admin',
      VUE_APP_MAIN_APP_URL: 'http://localhost:' + config.port,
    },
    env_production: {
      PORT: config.adminPort,
      NODE_ENV: PROD,
      BASE_URL: '/gp-admin',
    }
  }
}
