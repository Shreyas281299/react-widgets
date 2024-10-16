# Spaces Widget - Events

## Messages

### messages:created

New message is received in a Space

```javascript
{
  resource: 'messages',
  event: 'created',
  actorId: 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS8xZjdkZTVjYi04NTYxLTQ2NzEtYmMwMy1iYzk3NDMxNDQ0MmQ',
  data: {
    id: 'Y2lzY29zcGFyazovL3VzL01FU1NBR0UvOTJkYjNiZTAtNDNiZC0xMWU2LThhZTktZGQ1YjNkZmM1NjVk',
    actorName: 'Julie Someone',
    roomId: 'Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0',
    roomType: 'group',
    toPersonId: 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mMDZkNzFhNS0wODMzLTRmYTUtYTcyYS1jYzg5YjI1ZWVlMmX',
    toPersonEmail: 'julie@example.com',
    text: 'This is a test',
    html: 'This is a <b>test</b>',
    files: [ 'http://www.example.com/images/media.png' ],
    personId: 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mNWIzNjE4Ny1jOGRkLTQ3MjctOGIyZi1mOWM0NDdmMjkwNDY',
    personEmail: 'matt@example.com',
    created: '2015-10-18T14:26:16+00:00',
    mentionedPeople: []
  }
}
```

## Rooms

### rooms:unread

There are unread messages in a Space. This event will not fire if the authenticated user is the one who sent the message.

```javascript
{
  resource: 'rooms',
  event: 'unread',
  data: {
    id: 'Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0',
    actorName: 'Julie Someone',
    title: 'Project Unicorn - Sprint 0',
    type: 'group',
    isLocked: true,
    teamId: 'Y2lzY29zcGFyazovL3VzL1JPT00vNjRlNDVhZTAtYzQ2Yi0xMWU1LTlkZjktMGQ0MWUzNDIxOTcz',
    lastActivity: '2016-04-21T19:12:48.920Z',
    created: '2016-04-21T19:01:55.966Z'
  }
}
```

### rooms:read

A previously unread room is now fully read.

```javascript
  resource: 'rooms',
  event: 'read',
  data: {
    id: 'Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0',
    actorId: 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS8xZjdkZTVjYi04NTYxLTQ2NzEtYmMwMy1iYzk3NDMxNDQ0MmQ',
    actorName: 'Julie Someone',
    title: 'Project Unicorn - Sprint 0',
    type: 'group',
    isLocked: true,
    teamId: 'Y2lzY29zcGFyazovL3VzL1JPT00vNjRlNDVhZTAtYzQ2Yi0xMWU1LTlkZjktMGQ0MWUzNDIxOTcz',
    lastActivity: '2016-04-21T19:12:48.920Z',
    created: '2016-04-21T19:01:55.966Z'
  }
}
```

## Browser Notifications

### notifications:created

A browser notification is created.

```javascript
{
  resource: 'notifications',
  event: 'created',
  data: {
    notification: [Notification Object]
  }
}
```

### notifications:clicked

A browser notification is clicked.

```javascript
{
  resource: 'notifications',
  event: 'clicked',
  data: {
    notification: [Notification Object]
  }
}
```

## User @ Mentions

### mention:clicked

The user has clicked on a person's at mention, in a message.

```javascript
{
  resource: 'mention',
  event: 'clicked',
  data: {
    id: 'Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0',
    type: 'person',
  }
}
```