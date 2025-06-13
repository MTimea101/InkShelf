export function injectUser(req, res, next) {
  res.locals.user = req.session?.user || null;
  next();
}

export function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.redirect('/login');
}
