// eslint-disable-next-line no-undef
db = db.getSiblingDB('bookingTicket');


// eslint-disable-next-line no-undef
db.createUser({
    user: 'user',
    pwd: 'password',
    roles: [
    {
        role: 'dbOwner',
        db: 'bookingTicket',
    },
  ],
});