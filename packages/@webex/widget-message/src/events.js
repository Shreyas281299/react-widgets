import {constructHydraId, hydraTypes} from '@webex/react-component-utils';

export const eventNames = {
  SPACES_READ: 'rooms:read',
  SPACES_UNREAD: 'rooms:unread',
  MESSAGES_CREATED: 'messages:created'
};

/**
 * Constructs an event detail object for messages:created
 * @export
 * @param {Object} activity from mercury
 * @param {Object} toUser
 * @returns {Object} constructed event
 */
export function constructMessagesEventData(activity, toUser) {
  const roomType = activity.target.tags.includes('ONE_ON_ONE') ? 'direct' : 'group';
  let files, toPersonEmail, toPersonId;

  if (roomType === 'direct' && toUser) {
    toPersonEmail = toUser.emailAddress;
    toPersonId = constructHydraId(hydraTypes.PEOPLE, toUser.id);
  }

  let mentionedPeople = activity.object.mentions;

  if (mentionedPeople && mentionedPeople.items.length) {
    mentionedPeople = mentionedPeople.items.map((people) => ({
      id: constructHydraId(hydraTypes.PEOPLE, people.id)
    }));
  }

  // Files need to be decrypted and converted into a usable URL
  if (activity.object.files && activity.object.files.items.length) {
    files = activity.object.files.items;
  }

  const personId = constructHydraId(hydraTypes.PEOPLE, activity.actor.id);

  return {
    actorId: personId,
    actorName: activity.actor.displayName,
    id: constructHydraId(hydraTypes.MESSAGE, activity.id),
    roomId: constructHydraId(hydraTypes.ROOM, activity.target.id),
    roomType: activity.target.tags.includes('ONE_ON_ONE') ? 'direct' : 'group',
    text: activity.object.displayName,
    html: activity.object.content,
    files,
    personId,
    personEmail: activity.actor.emailAddress,
    created: activity.published,
    mentionedPeople,
    toPersonId,
    toPersonEmail
  };
}


/**
 * Creates an room data object for DOM and event hooks
 *
 * @export
 * @param {Object} space
 * @param {Object} activity
 * @returns {Object}
 */
export function constructRoomsEventData(space, activity) {
  return {
    id: constructHydraId(hydraTypes.ROOM, space.id),
    actorId: constructHydraId(hydraTypes.PEOPLE, activity.actor.id),
    actorName: activity.actor.displayName,
    title: space.name,
    type: space.type,
    isLocked: space.isLocked,
    teamId: constructHydraId(hydraTypes.TEAM, space.teamId),
    lastActivity: activity && activity.published || space.lastActivityTimestamp,
    created: space.published
  };
}