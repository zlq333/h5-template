import { Router } from 'vue-router';
declare module 'vue-router' {
  export interface Router {
    customRouterData?: {
      transitionName: string;
      history: any[];
    };
  }
}
