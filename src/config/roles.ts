const roles = ["user", "admin"];

const roleRights = new Map();

roleRights.set(roles[0], ["logout", "tweet", "bill"]);
roleRights.set(roles[1], ["bill"]);

export { roles, roleRights };
