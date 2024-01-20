import { Auth } from "firebase-admin/auth";
import { auth } from "../firebase";
import jwt from "jsonwebtoken";
import type { HandlerEvent } from '@netlify/functions';

// Contains validation logic for user authentication
class AuthService {
  constructor(private auth: typeof Auth) {}

  // Guard for checking if a user is authenticated anonymously
  public async authenticateAnonymousUser() {
    // Check if the uid exists in the database
  }

  public async authenticate(event: HandlerEvent) {
  }
}

export default new AuthService(auth);

