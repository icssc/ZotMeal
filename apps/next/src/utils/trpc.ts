import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@zotmeal/api';

export const trpc = createTRPCReact<AppRouter>();