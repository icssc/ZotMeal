import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../../packages/api/src';
// TODO: This import ^ makes me wanna barf. Need help shortening it somehow.

export const trpc = createTRPCReact<AppRouter>();