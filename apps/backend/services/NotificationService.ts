import type { Database } from "firebase-admin/database";
import {Expo } from "expo-server-sdk";
import type { ExpoPushMessage } from 'expo-server-sdk';
import {db} from "../firebase.js";

const expo = new Expo({ accessToken: process.env['EXPO_ACCESS_TOKEN'] });

interface NotificationTokens {
  android: string | null;
  apple: string | null;
}

interface TokenRegistrationParams {
  platform: string | "android" | "apple";
}

export class NotificationService {
  constructor(private db: Database, private expo: Expo) {}



  public async scheduleNotificationBatch(messages: ExpoPushMessage[]) {
  }


  public async updateNotificationTokens(userId: string, notificationTokens: NotificationTokens) {
    // this.db.ref("users").child("notificationTokens").child(userId).set(notificationTokens);
  }
  public async getUserNotificationTokens() {
    // get the user's registered notification token in the lookup table
    this.db.ref("users").child("notificationTokens").once("value");

    return [];
  }


  // Associates the notification token with firebase user
  public async registerNotificationToken({platform, notificationToken}: TokenRegistrationParams) {}

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
