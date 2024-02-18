import { createTRPCRouter } from '../trpc';
import { registerPushToken } from './procedures/registerPushToken';


export const notificationRouter = createTRPCRouter({
  register: registerPushToken
})