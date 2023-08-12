import { Injectable } from '@nestjs/common';
import { ClsService, ClsStore } from 'nestjs-cls';

// NOTE - ContextService should not be used in providers' constructor to make providers more pure
@Injectable()
export class ContextService {
  constructor(private readonly cls: ClsService<CtxStore>) {}

  get auth(): Auth {
    return this.cls.get<Auth>('auth');
  }

  set auth(val: Auth) {
    this.cls.set<Auth>('auth', val);
  }
}

export interface Auth {
  token: string;
  tenantId: string;
  clientId: string;
  userId: string;
  email: string;
  name: string;
  groups: string[];
}

export interface Aux {
  auth: Auth;
}

export type CtxStore = ClsStore & Aux;
