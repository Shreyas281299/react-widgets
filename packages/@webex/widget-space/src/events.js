// room and call events
export const eventNames = {
  SPACES_READ: 'rooms:read',
  SPACES_UNREAD: 'rooms:unread',
  MESSAGES_CREATED: 'messages:created',
  CALLS_CREATED: 'calls:created',
  CALLS_CONNECTED: 'calls:connected',
  CALLS_DISCONNECTED: 'calls:disconnected',
  CALL_MEMBERSHIPS_NOTIFIED: 'calls:memberships:notified',
  CALL_MEMBERSHIPS_CONNECTED: 'calls:memberships:connected',
  CALL_MEMBERSHIPS_DECLINED: 'calls:memberships:declined',
  CALL_MEMBERSHIPS_DISCONNECTED: 'calls:memberships:disconnected',
  ACTIVITY_CHANGED: 'activity:changed'
};

export default {
  eventNames
};
