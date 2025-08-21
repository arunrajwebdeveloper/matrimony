// This file extends the Express Request type to include the user property from Passport.js
// Create this file if it doesn't exist, typically in `src/types` or `src/` root.

import { UserDocument } from '../modules/users/schemas/user.schema';

declare global {
  namespace Express {
    interface User extends UserDocument {
      // Extend with your Mongoose UserDocument type
      profile?: string; // Add profileId if you attach it in JwtStrategy
    }

    interface Request {
      user?: User;
    }
  }
}
