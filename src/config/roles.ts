const roles = ["user", "admin"];

const roleRights = new Map();

roleRights.set(roles[0], ["logout", "tweet", "bill", "payment", "ticket"]);
roleRights.set(roles[1], ["bill","payment", "ticket"]);

export { roles, roleRights };
