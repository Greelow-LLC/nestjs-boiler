import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;

  constructor(private config: ConfigService) {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: this.config.get('FB_PROJECT_ID'),
        privateKey: this.config.get('FB_PRIVATE_KEY'),
        clientEmail: this.config.get('FB_CLIENT_EMAIL'),
      }),
    });
  }

  getAuth = (): admin.auth.Auth => {
    return this.firebaseApp.auth();
  };
}
