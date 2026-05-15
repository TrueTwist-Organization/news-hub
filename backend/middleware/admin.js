/**
 * Admin middleware: Strictly checks if the authenticated user has the 'admin' role
 * Must be used AFTER authMiddleware
 */
const adminMiddleware = (req, res, next) => {
  // We check for both 'admin' and 'Admin' just in case of DB inconsistency
  const userRole = req.user?.role?.trim();
  console.log('[DEBUG ADMIN] Checking role (trimmed):', userRole);

  if (req.user && (userRole?.toLowerCase() === 'admin')) {
    return next();
  }

  console.warn(`[ADMIN DENIED]: User ${req.user?._id} attempted access with role: ${userRole}`);
  
  res.status(403).json({ 
    message: 'Access denied: Admin only',
    debugRole: userRole 
  });
};

module.exports = adminMiddleware;
