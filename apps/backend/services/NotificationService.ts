import { Database } from "firebase-admin/lib/database/database";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import db from "../firebase";

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

interface NotificationTokens {
  android: string;
  apple: string;
}

export class NotificationService {
  constructor(private db: Database, private expo: Expo) {}

  public async getUserNotificationTokens() {
    // get the user's registered notification token in the lookup table
    this.db.ref("users").child("notificationTokens").on;

    return [];
  }

  public async registerNotificationToken() {}

  public async sendNotificationBatch(messages: ExpoPushMessage[]) {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async sendNotification() {
    console.log("sending notification");
  }
}

export default new NotificationService(db, expo);
