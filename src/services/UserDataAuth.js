import AsyncStorage from '@react-native-community/async-storage';
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

  const body = purchases ? { email, password, purchases } : { email, password };

  let response = await fetch(`${commonService.rootUrl}/musora-api/login`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (response.status === 500) {
    return 500;
  } else {
    response = await response.json();
    if (response.success) {
      token = response.token;
    }
    return response;
  }
}

export async function getUserData() {
  return commonService.tryCall(`${commonService.rootUrl}/api/profile`);
}

export async function avatarUpload(data) {
  try {
    return await fetch(`${commonService.rootUrl}/musora-api/avatar/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });
  } catch (error) {}
}

export async function forgotPass(emailAddress) {
  return commonService.tryCall(
    `${commonService.rootUrl}/musora-api/forgot?email=${emailAddress}`,
    'PUT'
  );
}

export async function changePassword(email, pass, token) {
  return commonService.tryCall(
    `${commonService.rootUrl}/musora-api/change-password`,
    'PUT',
    {
      pass1: pass,
      user_login: email,
      rp_key: token
    }
  );
}

export async function isNameUnique(name) {
  return commonService.tryCall(
    `${commonService.rootUrl}/usora/api/is-display-name-unique?display_name=${name}`
  );
}

export async function isEmailUnique(email) {
  return commonService.tryCall(
    `${commonService.rootUrl}/usora/api/is-email-unique?email=${email}`
  );
}

export async function updateName(name) {
  return commonService.tryCall(
    `${commonService.rootUrl}/musora-api/profile/update`,
    'POST',
    {
      display_name: name
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
    return new Error(error);
  }
}

export async function restorePurchase(purchases) {
  let platform = isiOS ? 'apple' : 'google';
  try {
    let response = await fetch(
      `${commonService.rootUrl}/mobile-app/api/${platform}/restore`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(
          isiOS ? { receipt: purchases[0].transactionReceipt } : { purchases }
        )
      }
    );
    response = await response.json();
    token = response?.token;
    return response;
  } catch (error) {
    return new Error(error);
  }
}

export async function validateSignUp(purchases) {
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
