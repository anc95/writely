import { EventName } from './event-name';

export type MessagePayload<T extends EventName> = {
  type: T;
};
