import AsyncStorage from '@react-native-community/async-storage';
import { Platform } from 'react-native';
import commonService from './common.service';

export async function getToken(userEmail, userPass, purchases) {
  const data = (await AsyncStorage.multiGet(['email', 'password'])).reduce(
    (i, j) => {
      i[j[0]] = j[1] === 'true' ? true : j[1] === 'false' ? false : j[1];
      i[j[0]] = j[1] === 'undefined' ? undefined : j[1];
      return i;
    },
    {}
  );

  let email = userEmail || data.email;
  let password = userPass || data.password;
  email = encodeURIComponent(email);
  password = encodeURIComponent(password);

  let response = await fetch(
    `${commonService.rootUrl}/usora/api/login?email=${email}&password=${password}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: purchases ? JSON.stringify(purchases) : {}
    }
  );
  
  if (response.status == 500) {
    return 500;
  } else {
    response = await response.json();
    if (response.success) {
      token = response.token;
      await AsyncStorage.multiSet([['userId', JSON.stringify(response.userId)]]);
    }
    return response;
  }
}

export async function getUserData() {
  // return profile details
  try {
    await getToken();
    let userData = await fetch(`${commonService.rootUrl}/api/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (typeof userData.error == 'undefined') {
      userData = await userData.json();
      // if received data, update data
      await AsyncStorage.multiSet([
        ['totalXP', userData.totalXp.toString()],
        ['rank', userData.xpRank.toString()],
        ['userId', userData.id.toString()],
        ['displayName', userData.display_name.toString()],
        ['profileURI', userData.profile_picture_url.toString()],
        ['joined', userData.created_at.toString()],
        [
          'weeklyCommunityUpdatesClicked',
          userData.notify_weekly_update.toString()
        ],
        [
          'commentRepliesClicked',
          userData.notify_on_lesson_comment_reply.toString()
        ],
        [
          'commentLikesClicked',
          userData.notify_on_lesson_comment_like.toString()
        ],
        [
          'forumPostRepliesClicked',
          userData.notify_on_forum_post_reply.toString()
        ],
        [
          'forumPostLikesClicked',
          userData.notify_on_forum_post_like.toString()
        ],
        [
          'notifications_summary_frequency_minutes',
          userData.notify_weekly_update == null ||
          userData.notify_weekly_update == ''
            ? 'null'
            : userData.notify_weekly_update.toString()
        ]
      ]);
    }

    return userData;
  } catch (error) {
    console.log(error);
  }
}

export async function forgotPass(emailAddress) {
  return commonService.tryCall(
    `${commonService.rootUrl}/api/forgot?email=${emailAddress}`,
    'PUT'
  );
}

export async function changePassword(email, pass, token) {
  console.log(email, pass, token);
  return commonService.tryCall(
    `${commonService.rootUrl}/api/change-password`,
    'PUT',
    {
      pass1: pass,
      user_login: email,
      rp_key: token
    }
  );
}

export async function logOut() {
  // return profile details
  try {
    return commonService.tryCall(
      `${commonService.rootUrl}/usora/api/logout`,
      'PUT'
    );
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

export async function signUp(
  email,
  password,
  purchase,
  oldToken,
  selectedPlan
) {
  console.log('signup', email, password, purchase);
  let platform = '';
  let receiptType = '';
  let attributes;
  if (Platform.OS === 'ios') {
    platform = 'apple';
    receiptType = 'appleReceipt';
    attributes = {
      email,
      password,
      receipt: purchase.transactionReceipt,
      price: selectedPlan.price,
      currency: selectedPlan.currency
    };
  } else {
    platform = 'google';
    receiptType = 'googleReceipt';
    attributes = {
      email,
      password,
      package_name: `com.pianote2`,
      product_id: purchase.productId || purchase.product_id,
      purchase_token: purchase.purchaseToken || purchase.purchase_token,
      price: selectedPlan.price,
      currency: selectedPlan.currency
    };
  }
  let headers;
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  } else {
    headers = { 'Content-Type': 'application/json' };
  }

  try {
    let response = await fetch(
      `${commonService.rootUrl}/mobile-app/${platform}/verify-receipt-and-process-payment`,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          data: {
            type: receiptType,
            attributes: attributes
          }
        })
      }
    );
    response = await response.json();
    token = response?.meta?.auth_code;
    return response;
  } catch (error) {
    console.log('err', error);
    return new Error(error);
  }
}

export async function restorePurchase(purchases) {
  let platform = Platform.OS === 'ios' ? 'apple' : 'google';
  try {
    let response = await fetch(
      `${commonService.rootUrl}/mobile-app/${platform}/restore`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          Platform.OS === 'ios'
            ? { receipt: purchases[0].transactionReceipt }
            : { purchases }
        )
      }
    );
    response = await response.json();
    token = response?.token;
    return response;
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

export async function validateSignUp(purchases) {
  let platform = Platform.OS === 'ios' ? 'apple' : 'google';
  console.log(purchases);
  try {
    let response = await fetch(
      `${commonService.rootUrl}/mobile-app/${platform}/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          Platform.OS === 'ios'
            ? { receipt: purchases[0].transactionReceipt }
            : { purchases }
        )
      }
    );
    return await response.json();
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}
