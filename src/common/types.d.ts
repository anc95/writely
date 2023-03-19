import { EventName } from './event-name';

export type MessagePayload<T extends EventName, D extends any = any> = {
  type: T;
  data?: D;
};
