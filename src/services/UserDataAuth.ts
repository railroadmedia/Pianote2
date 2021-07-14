import AsyncStorage from '@react-native-community/async-storage';
import { isiOS } from '../../AppStyle';
import commonService from './common.service';

export async function getToken(
  userEmail?: string,
  userPass?: string,
  purchases?: any
) {
  // let data: any;
  // data = (await AsyncStorage.multiGet(['email', 'password'])).reduce((i, j) => {
  //   i[j[0]] = j[1] === 'true' ? true : j[1] === 'false' ? false : j[1];
  //   i[j[0]] = j[1] === 'undefined' ? undefined : j[1];
  //   return i;
  // }, {});
  let e = await AsyncStorage.getItem('email');
  let p = await AsyncStorage.getItem('password');
  let email = userEmail || e;
  let password = userPass || p;

  const body = purchases ? { email, password, purchases } : { email, password };
  let response: any;
  response = await fetch(`${commonService.rootUrl}/musora-api/login`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (response.status === 500) {
    return 500;
  } else {
    response = await response.json();
    if (response.success) {
      commonService.token = response.token;
    }
    return response;
  }
}

export async function getUserData() {
  return commonService.tryCall({ url: `${commonService.rootUrl}/api/profile` });
}

export async function avatarUpload(data: any) {
  try {
    return await fetch(`${commonService.rootUrl}/musora-api/avatar/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${commonService.token}` },
      body: data
    });
  } catch (error) {}
}

export async function forgotPass(emailAddress: string) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/musora-api/forgot?email=${emailAddress}`,
    method: 'PUT'
  });
}

export async function changePassword(
  email: string,
  pass: string,
  token: string
) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/musora-api/change-password`,
    method: 'PUT',
    body: {
      pass1: pass,
      user_login: email,
      rp_key: token
    }
  });
}

export async function isNameUnique(name: string) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/usora/api/is-display-name-unique?display_name=${name}`
  });
}

export async function isEmailUnique(email: string) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/usora/api/is-email-unique?email=${email}`
  });
}

export async function updateName(name: string) {
  return commonService.tryCall({
    url: `${commonService.rootUrl}/musora-api/profile/update`,
    method: 'POST',
    body: { display_name: name }
  });
}

export async function logOut() {
  // return profile details
  try {
    return commonService.tryCall({
      url: `${commonService.rootUrl}/usora/api/logout`,
      method: 'PUT'
    });
  } catch (error) {
    return new Error(error);
  }
}

export async function signUp(
  email: string,
  password: string,
  purchase: any,
  selectedPlan: any
) {
  let platform = '';
  let receiptType = '';
  let attributes;
  if (isiOS) {
    platform = 'apple';
    receiptType = 'appleReceipt';
    attributes = {
      email,
      password,
      receipt: purchase.transactionReceipt,
      price: selectedPlan?.price,
      currency: selectedPlan?.currency
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
      price: selectedPlan?.price,
      currency: selectedPlan?.currency
    };
  }
  let headers;
  if (commonService.token) {
    headers = {
      Authorization: `Bearer ${commonService.token}`,
      'Content-Type': 'application/json'
    };
  } else {
    headers = { 'Content-Type': 'application/json' };
  }

  try {
    let response: any;
    response = await fetch(
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
    commonService.token = response?.meta?.auth_code;
    return response;
  } catch (error) {
    return new Error(error);
  }
}

export async function restorePurchase(purchases: any) {
  let platform = isiOS ? 'apple' : 'google';
  try {
    let response: any = await fetch(
      `${commonService.rootUrl}/mobile-app/api/${platform}/restore`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${commonService.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          isiOS ? { receipt: purchases[0].transactionReceipt } : { purchases }
        )
      }
    );
    response = await response.json();
    commonService.token = response?.token;
    return response;
  } catch (error) {
    return new Error(error);
  }
}

export async function validateSignUp(purchases: any) {
  let platform = isiOS ? 'apple' : 'google';
  try {
    let response = await fetch(
      `${commonService.rootUrl}/mobile-app/api/${platform}/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          isiOS ? { receipt: purchases[0].transactionReceipt } : { purchases }
        )
      }
    );
    return await response.json();
  } catch (error) {
    return new Error(error);
  }
}
