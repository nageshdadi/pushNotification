import React, {Component} from 'react';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {Image, Platform, StyleSheet, View} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';

class App extends Component {
  componentDidMount() {
    this.getDeviceToken();
    firebase.messaging().onMessage(response => {
      console.log(JSON.stringify(response));
      if (Platform.OS !== 'ios') {
        this.showNotification(response.notification);
        return;
      }
      PushNotificationIOS.requestPermissions().then(() =>
        this.showNotification(response.notification),
      );
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // Create notification channel for Android
    this.createNotificationChannel();
  }
  getDeviceToken = async () => {
    const token = await messaging().getToken();
    console.log(token);
  };

  createNotificationChannel() {
    PushNotification.createChannel(
      {
        channelId: '1', // Change this ID as needed
        channelName: 'Default Channel',
        channelDescription: 'Default channel for notifications',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created: any) => {
        if (created) {
          console.log('Notification channel created successfully');
        }
      },
    );
  }

  showNotification = (
    notification: FirebaseMessagingTypes.Notification | any,
  ) => {
    PushNotification.localNotification({
      channelId: '1', // Use the same channel ID
      title: notification.title,
      message: notification.body,
    });
  };

  render() {
    return (
      <View style={styles.main}>
        <Image
          style={styles.img}
          source={{
            uri: 'https://pixlok.com/wp-content/uploads/2021/04/Zomato-Logo-PNG.jpg',
          }}
        />
        {/* <Text style={styles.text}>Swiggy</Text> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: 'orange',
    fontSize: 20,
    fontWeight: '900',
  },
  img: {
    height: 250,
    width: 250,
  },
});

export default App;
