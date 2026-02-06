import dotenv from 'dotenv';
dotenv.config();

interface EnvInterfaces {
  PORT: string;
  NODE_ENV?: 'development' | 'production';
  MONGO_URI?: string;

  
   REQUEST_RATE_LIMIT: number;
   REQUEST_RATE_LIMIT_TIME: number;

   REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_USERNAME: string;
  REDIS_PASSWORD: string;

  JWT_ACCESS_SECRET: string;
  BCRYPT_SALT_ROUND: string;
  JWT_ACCESS_EXPIRATION?: string;
  JWT_REFRESH_SECRET?: string;
  JWT_REFRESH_EXPIRATION?: string;

  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  EMAIL_HOST: string;
  EMAIL_PORT: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME: string;
  OTP_JWT_ACCESS_SECRET: string;
  OTP_JWT_ACCESS_EXPIRATION: string;

  FRONTEND_URL: string;

}

const loadEnvVarbles = (): EnvInterfaces => {
  const requireEnvVariables: string[] = [
    'PORT',
    'NODE_ENV',
    'MONGO_URI',
    
    'REQUEST_RATE_LIMIT',
    'REQUEST_RATE_LIMIT_TIME',

    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_USERNAME',
    'REDIS_PASSWORD',

    'JWT_ACCESS_SECRET',
    'BCRYPT_SALT_ROUND',
    'JWT_ACCESS_EXPIRATION',
    'JWT_REFRESH_SECRET',
    'JWT_REFRESH_EXPIRATION',

    'EMAIL_USER',
    'EMAIL_PASSWORD',
    'EMAIL_HOST',
    'EMAIL_PORT',
    'EMAIL_FROM',
    'EMAIL_FROM_NAME',

    'OTP_JWT_ACCESS_SECRET',
    'OTP_JWT_ACCESS_EXPIRATION',

    'FRONTEND_URL',
    

    
    
  ];

  requireEnvVariables.forEach((KEY) => {
    if (!process.env[KEY]) {
      throw new Error(`Missing required env variable ${KEY}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    MONGO_URI: process.env.MONGO_URI as string,

     REQUEST_RATE_LIMIT_TIME: Number(
      process.env.REQUEST_RATE_LIMIT_TIME
    ) as number,
    REQUEST_RATE_LIMIT: Number(process.env.REQUEST_RATE_LIMIT) as number,

        REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
    REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION as string,
    EMAIL_USER: process.env.EMAIL_USER as string,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD as string,
    EMAIL_HOST: process.env.EMAIL_HOST as string,
    EMAIL_PORT: process.env.EMAIL_PORT as string,
    EMAIL_FROM: process.env.EMAIL_FROM as string,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME as string,
    OTP_JWT_ACCESS_SECRET: process.env.OTP_JWT_ACCESS_SECRET as string,
    OTP_JWT_ACCESS_EXPIRATION: process.env.OTP_JWT_ACCESS_EXPIRATION as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    
  };
};

export default loadEnvVarbles();