package com.pianote2;

import io.invertase.firebase.messaging.*;
import android.content.Intent;
import android.content.Context;
import io.invertase.firebase.messaging.RNFirebaseMessagingService;

import com.google.firebase.messaging.RemoteMessage;
import android.util.Log;
import java.util.Map;

public class MainMessagingService extends RNFirebaseMessagingService {
    private static final String TAG = "MainMessagingService";

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
    }
}