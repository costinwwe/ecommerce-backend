// Simple admin authentication middleware
// In production, use JWT tokens

export const requireAdmin = (req, res, next) => {
  // For now, we'll check a simple header or token
  // In production, implement proper JWT authentication
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Simple check - in production use JWT
  const token = authHeader.split(' ')[1];
  if (token === 'admin-authenticated' || token === process.env.ADMIN_TOKEN) {
    req.user = { role: 'admin' };
    next();
  } else {
    return res.status(403).json({ message: 'Access denied' });
  }
};

// Role-based access control
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (allowedRoles.includes(req.user.role) || req.user.role === 'super_admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
  };
};

// Log activity middleware
export const logActivity = async (action, entityType, entityId, description, changes = null) => {
  return async (req, res, next) => {
    // Store activity logging function in request
    req.logActivity = async (userId, additionalData = {}) => {
      try {
        const { ActivityLog } = await import('../models/index.js');
        await ActivityLog.create({
          user: userId || req.user?.id,
          action,
          entityType,
          entityId: entityId || req.params.id,
          description: description || `${action} ${entityType}`,
          changes: changes || additionalData,
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get('user-agent')
        });
      } catch (error) {
        console.error('Activity log error:', error);
        // Don't fail the request if logging fails
      }
    };
    next();
  };
};

