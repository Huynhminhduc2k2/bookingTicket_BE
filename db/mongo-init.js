db = db.getSiblingDB('bookingTicket')


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