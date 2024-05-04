const roles = ["user", "admin"];

const roleRights = new Map();

roleRights.set(roles[0], ["logout", "tweet", "bill", "payment", "ticket", "verifyOTP"]);
roleRights.set(roles[1], ["bill", "payment", "ticket", "verifyOTP"]);

export { roles, roleRights };
