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
  uid: string;
  platform: string | "android" | "apple";
  notificationToken: string;
}

export class NotificationService {
  constructor(private db: Database, private expo: Expo) {}



  // Schedules a batch of notifications to be sent at a later time

  // we need to schedule these ourselves
  // only expo client sdk has the ability to schedule notifications natively
  public async scheduleNotificationBatch(messages: ExpoPushMessage[]) {}
  
  // Retreives the notification tokens for all users for all devices, quite expensive. Use only for scheduled events. Should batch the weeks worth of notifications and send them all at once. Consider batching every sunday instead of sliding window.
  public async getAllUsersNotificationTokens() {}

  // Associates the notification token with firebase user
  public async registerNotificationToken({uid, platform, notificationToken}: TokenRegistrationParams) {
    this.db.ref(`users/${uid}/notificationTokens/${platform}`).set(notificationToken, (e) => {
      if (e) {
        throw e;
      } else {
        console.log("successfully registered notification token");
      }
    });
  }

  // Sends list of messages right now
  public async sendNotifications(messages: ExpoPushMessage[]) {
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

  // Sends a single notification to a user right now
  public async sendNotification(message: ExpoPushMessage) {
    console.log("sending notification");
  }
}

export default new NotificationService(db, expo);
