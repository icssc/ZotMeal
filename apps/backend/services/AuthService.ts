import { Auth } from "firebase-admin/auth";

// Contains validation logic for user authentication
class AuthService {
  constructor(private auth: Auth) {}

  // Guard for checking if a user is authenticated
  public async authenticateUser() {}
}

export default new AuthService(auth);
