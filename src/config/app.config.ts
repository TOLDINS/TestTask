export enum AppEnv {
  Dev = 'development',
  Stage = 'stage',
  Prod = 'production',
}

export interface AppConfig {
  env: string;
  port: number;
}

export default (): AppConfig => {
  return {
    env: process.env.NODE_ENV || AppEnv.Dev,
    port: Number(process.env.APP_PORRT) || 3000,
  };
};
