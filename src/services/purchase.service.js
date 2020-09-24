import RNIap, {
    purchaseErrorListener,
    purchaseUpdatedListener,
} from 'react-native-iap';
import {Platform} from 'react-native';

let pErrorListener = null;
let pUpdateListener = null;

const purchaseService = {
    purchase: {
        init: async () => {
            try {
                return await RNIap.initConnection();
            } catch (e) {}
        },
        addListeners: (updateCallback, errorCallback) => {
            pErrorListener = pel(errorCallback);
            pUpdateListener = pul(updateCallback, errorCallback);
        },
        removeListener: () => {
            if (pErrorListener) {
                pErrorListener.remove();
                pErrorListener = null;
            }
            if (pUpdateListener) {
                pUpdateListener.remove();
                pUpdateListener = null;
            }
        },
        buy: async (skus, sku, errorCallback) => {
            if (!(await purchaseService.purchase.init()))
                return errorCallback({
                    title: 'Something went wrong!',
                    message: `Connection to ${
                        Platform.OS === 'android' ? 'Play Store' : 'iTunes'
                    } refused.`,
                });
            let availablePurchases = [];
            // try {
            //     availablePurchases = await RNIap.getAvailablePurchases();
            //     console.log(availablePurchases);
            // } catch (e) {
            //     return errorCallback({
            //         title: 'Something went wrong!',
            //         message: e.message,
            //     });
            // }
            // if (
            //     Platform.OS === 'ios' &&
            //     availablePurchases.some(ap => ap.productId === sku)
            // ) {
            //     return errorCallback({
            //         title: 'Item already puchased',
            //         message:
            //             'This iCloud account already has access to this item.',
            //     });
            // }
            try {
                console.log(skus, sku);
                let res = await RNIap.getSubscriptions(skus);
                console.log(res);
            } catch (e) {}
            try {
                let res = await RNIap.requestSubscription(sku, false);
                console.log(res);
            } catch (e) {}
        },
    },
};

export default purchaseService;

const pul = (updateCallback, errorCallback) => {
    return purchaseUpdatedListener(async purchase => {
        let {productId, purchaseToken, transactionReceipt} = purchase;
        if (transactionReceipt) {
            // let formData = new FormData();
            // formData.append('purchase_type', 'product');
            // if (Platform.OS === 'android') {
            //   formData.append('package_name', `com.drumeo`);
            //   formData.append('product_id', productId);
            //   formData.append('purchase_token', purchaseToken);
            // } else {
            //   formData.append('receipt', transactionReceipt);
            // }
            // let response = await callToBE(formData)
            // if (response.success) {
            //   updateCallback();
            //   try {
            //     await RNIap.finishTransaction(purchase, false);
            //   } catch (e) {}
            // } else errorCallback(response);
        }
    });
};

const pel = errorCallback => {
    return purchaseErrorListener(({message}) =>
        errorCallback({title: 'Something went wrong!', message: message}),
    );
};
