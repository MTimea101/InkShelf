export function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.status(403).send('Access denied');
    }
    return next();
  };
}

export function requireAtLeast(role) {
  return (req, res, next) => {
    const roles = ['user', 'curator', 'admin'];
    const userRole = req.session.user?.role;
    if (!userRole || roles.indexOf(userRole) < roles.indexOf(role)) {
      return res.status(403).send('You do not have the permission to access this.');
    }
    return next();
  };
}
