import dotenv from 'dotenv';
dotenv.config();

interface EnvInterfaces {
  DB_URI: string,
  
 

}

const loadEnvVarbles = (): EnvInterfaces => {
  const requireEnvVariables: string[] = [
    'DB_URI',


    

    
    
  ];

  requireEnvVariables.forEach((KEY) => {
    if (!process.env[KEY]) {
      throw new Error(`Missing required env variable ${KEY}`);
    }
  });

  return {
   DB_URI: process.env.DB_URI as string,
    
  };
};

export default loadEnvVarbles();