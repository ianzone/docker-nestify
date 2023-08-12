import { LogLevel } from '@nestjs/common';

import { auth } from './mock';

export default (): Configs => {
  const stage = process.env.STAGE ?? '';

  return {
    baseUrl: `http://localhost:${process.env.DEV_PORT}`,
    token: 'Secure_2023',
    logLevel: stage === 'dev' ? ['debug'] : ['warn'],
  };
};

export interface Configs {
  baseUrl: string;
  token: string;
  logLevel: LogLevel[];
}

export const mock = {
  enable: true,
  auth,
};
