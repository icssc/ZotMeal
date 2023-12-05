import { Auth } from "firebase-admin/auth";
import { auth } from "../firebase";

// Contains validation logic for user authentication
class AuthService {
  constructor(private auth: typeof Auth) {}

  // Guard for checking if a user is authenticated
  public async authenticateUser() {}
}

export default new AuthService(auth);

