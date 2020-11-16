/**
 * Settings
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
    Alert,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNIap from 'react-native-iap';
import Modal from 'react-native-modal';
import LogOut from '../../modals/LogOut.js';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import {getUserData} from 'Pianote2/src/services/UserDataAuth.js';
import Loading from '../../components/Loading.js';
import CustomModal from '../../modals/CustomModal.js';
import {logOut, restorePurchase} from '../../services/UserDataAuth.js';
import {NavigationActions, StackActions} from 'react-navigation';
import {NetworkContext} from '../../context/NetworkProvider.js';
import commonService from '../../services/common.service.js';

export default class Settings extends React.Component {
    static navigationOptions = {header: null};
    static contextType = NetworkContext;
    constructor(props) {
        super(props);
        this.state = {
            showLogOut: false,
        };
    }

    manageSubscriptions = async () => {
        if (!this.context.isConnected) {
            return this.context.showNoConnectionAlert();
        }
        const userData = await getUserData();
        let {isAppleAppSubscriber, isGoogleAppSubscriber} = userData;
        if (Platform.OS === 'ios') {
            if (isAppleAppSubscriber) {
                Alert.alert(
                    'Manage Subscription',
                    'You have an Apple App Store subscription that can only be managed through the Apple I.D. used to purchase it.',
                    [{text: 'View Subscriptions'}],
                    {
                        cancelable: false,
                    },
                );
            } else {
                Alert.alert(
                    'Manage Subscription',
                    'Sorry! You can only manage your Apple App Store based subscriptions here.',
                    [{text: 'Got it!'}],
                    {
                        cancelable: false,
                    },
                );
            }
        } else {
            if (isGoogleAppSubscriber) {
                Alert.alert(
                    'Manage Subscription',
                    'You have a Google Play subscription that can only be managed through the Google Account used to purchase it.',
                    [{text: 'View Subscriptions'}],
                    {
                        cancelable: false,
                    },
                );
            } else {
                Alert.alert(
                    'Manage Subscription',
                    'You can only manage Google Play subscriptions here. Please sign in to Pianote on your original subscription platform to manage your settings.',
                    [{text: 'Got it!'}],
                    {
                        cancelable: false,
                    },
                );
            }
        }
    };

    restorePurchase = async () => {
        if (!this.context.isConnected)
            return this.context.showNoConnectionAlert();
        this.loadingRef?.toggleLoading();
        try {
            await RNIap.initConnection();
        } catch (e) {
            this.loadingRef?.toggleLoading();
            return this.customModal.toggle(
                'Connection to app store refused',
                'Please try again later.',
            );
        }
        try {
            let purchases = await RNIap.getPurchaseHistory();
            if (!purchases.length) {
                this.loadingRef?.toggleLoading();
                return this.restoreSuccessfull.toggle(
                    'Restore',
                    'All purchases restored',
                );
            }
            if (Platform.OS === 'android') {
                purchases = purchases.map(m => {
                    return {
                        purchase_token: m.purchaseToken,
                        package_name: 'com.pianote2',
                        product_id: m.productId,
                    };
                });
            }
            let restoreResponse = await restorePurchase(purchases);
            this.loadingRef?.toggleLoading();
            if (restoreResponse.title && restoreResponse.message)
                return this.customModal.toggle(
                    restoreResponse.title,
                    restoreResponse.message,
                );
            if (restoreResponse.email) {
                this.loadingRef?.toggleLoading();
                await logOut();
                this.loadingRef?.toggleLoading();
                this.props.navigation.navigate('LOGINCREDENTIALS', {
                    email: restoreResponse.email,
                });

                return Alert.alert(
                    'Restore',
                    `This ${
                        Platform.OS === 'ios' ? 'Apple' : 'Google'
                    } account is already linked to another Pianote account. Please login with that account.`,
                    [{text: 'OK'}],
                    {cancelable: false},
                );
            } else if (restoreResponse.token) {
                this.props.navigation.dispatch(
                    StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({
                                routeName: 'LESSONS',
                            }),
                        ],
                    }),
                );
            } else if (restoreResponse.shouldCreateAccount)
                this.props.navigation.navigate('CREATEACCOUNT');
        } catch (err) {
            this.loadingRef?.toggleLoading();
            this.customModal.toggle(
                'Something went wrong',
                'Something went wrong.\nPlease try Again later.',
            );
        }
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignSelf: 'stretch',
                    backgroundColor: colors.mainBackground,
                }}
            >
                <View key={'contentContainer'} style={{flex: 1}}>
                    <View
                        key={'buffer'}
                        style={{
                            height: 15 * factorVertical,
                        }}
                    />
                    <View
                        key={'mySettings'}
                        style={[
                            styles.centerContent,
                            {
                                flex: 0.1,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.centerContent,
                                {
                                    position: 'absolute',
                                    left: 0,
                                    bottom: 0 * factorRatio,
                                    height: 50 * factorRatio,
                                    width: 50 * factorRatio,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: '100%',
                                        width: '100%',
                                    },
                                ]}
                            >
                                <EntypoIcon
                                    name={'chevron-thin-left'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 0.66}} />
                        <Text
                            style={{
                                fontSize: 22 * factorRatio,
                                fontWeight: 'bold',
                                fontFamily: 'OpenSans-Regular',
                                color: colors.secondBackground,
                            }}
                        >
                            Settings
                        </Text>
                        <View style={{flex: 0.33}} />
                    </View>
                    <View
                        key={'scrollview'}
                        style={{
                            flex: 0.95,
                        }}
                    >
                        <ScrollView>
                            <TouchableOpacity
                                key={'profileSettings'}
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'PROFILESETTINGS',
                                    );
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: 50 * factorRatio,
                                        width: fullWidth,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        borderTopWidth: 0.5 * factorRatio,
                                        borderTopColor: colors.secondBackground,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth * 0.025,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerContent,
                                        {width: 60 * factorHorizontal},
                                    ]}
                                >
                                    <FeatherIcon
                                        name={'user'}
                                        size={25 * factorRatio}
                                        color={colors.pianoteRed}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 18 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Profile Settings
                                </Text>
                                <View style={{flex: 1}} />
                                <AntIcon
                                    name={'right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                key={'notificationSettings'}
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'NOTIFICATIONSETTINGS',
                                    );
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: 50 * factorRatio,
                                        width: fullWidth,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth * 0.025,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerContent,
                                        {width: 60 * factorHorizontal},
                                    ]}
                                >
                                    <IonIcon
                                        name={'ios-notifications-outline'}
                                        color={colors.pianoteRed}
                                        size={35 * factorRatio}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 18 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Notification Settings
                                </Text>
                                <View style={{flex: 1}} />
                                <AntIcon
                                    name={'right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                key={'manageSubscriptions'}
                                onPress={this.manageSubscriptions}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: 50 * factorRatio,
                                        width: fullWidth,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth * 0.025,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerContent,
                                        {width: 60 * factorHorizontal},
                                    ]}
                                >
                                    <AntIcon
                                        name={'folder1'}
                                        size={25 * factorRatio}
                                        color={colors.pianoteRed}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 18 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Manage Subscriptions
                                </Text>
                                <View style={{flex: 1}} />
                                <AntIcon
                                    name={'right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                key={'restorePurchase'}
                                onPress={this.restorePurchase}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: 50 * factorRatio,
                                        width: fullWidth,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth * 0.025,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerContent,
                                        {width: 60 * factorHorizontal},
                                    ]}
                                >
                                    <AntIcon
                                        name={'folder1'}
                                        size={25 * factorRatio}
                                        color={colors.pianoteRed}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 18 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Restore Purchases
                                </Text>
                                <View style={{flex: 1}} />
                                <AntIcon
                                    name={'right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                key={'support'}
                                onPress={() => {
                                    this.props.navigation.navigate('SUPPORT');
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: 50 * factorRatio,
                                        width: fullWidth,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth * 0.025,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerContent,
                                        {width: 60 * factorHorizontal},
                                    ]}
                                >
                                    <FontIcon
                                        name={'support'}
                                        size={25 * factorRatio}
                                        color={colors.pianoteRed}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 18 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Support
                                </Text>
                                <View style={{flex: 1}} />
                                <AntIcon
                                    name={'right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                key={'termsOfUse'}
                                onPress={() => {
                                    this.props.navigation.navigate('TERMS');
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: 50 * factorRatio,
                                        width: fullWidth,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth * 0.025,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerContent,
                                        {width: 60 * factorHorizontal},
                                    ]}
                                >
                                    <AntIcon
                                        name={'form'}
                                        size={25 * factorRatio}
                                        color={colors.pianoteRed}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 18 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Terms of Use
                                </Text>
                                <View style={{flex: 1}} />
                                <AntIcon
                                    name={'right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                key={'privacyPolicy'}
                                onPress={() => {
                                    this.props.navigation.navigate(
                                        'PRIVACYPOLICY',
                                    );
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: 50 * factorRatio,
                                        width: fullWidth,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth * 0.025,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerContent,
                                        {width: 60 * factorHorizontal},
                                    ]}
                                >
                                    <FontIcon
                                        name={'shield'}
                                        color={colors.pianoteRed}
                                        size={27.5 * factorRatio}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 18 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Privacy Policy
                                </Text>
                                <View style={{flex: 1}} />
                                <AntIcon
                                    name={'right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                key={'logOut'}
                                onPress={() => {
                                    this.setState({showLogOut: true});
                                }}
                                style={[
                                    styles.centerContent,
                                    {
                                        height: 50 * factorRatio,
                                        width: fullWidth,
                                        borderBottomColor:
                                            colors.secondBackground,
                                        borderBottomWidth: 1 * factorRatio,
                                        flexDirection: 'row',
                                        paddingRight: fullWidth * 0.025,
                                    },
                                ]}
                            >
                                <View
                                    style={[
                                        styles.centerContent,
                                        {width: 60 * factorHorizontal},
                                    ]}
                                >
                                    <AntIcon
                                        name={'poweroff'}
                                        color={colors.pianoteRed}
                                        size={23.5 * factorRatio}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        fontSize: 18 * factorRatio,
                                        color: colors.secondBackground,
                                    }}
                                >
                                    Log Out
                                </Text>
                                <View style={{flex: 1}} />
                                <AntIcon
                                    name={'right'}
                                    size={22.5 * factorRatio}
                                    color={colors.secondBackground}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontFamily: 'OpenSans-Regular',
                                    textAlign: 'center',
                                    color: colors.secondBackground,
                                    marginTop: 15 * factorRatio,
                                    fontSize: 12 * factorRatio,
                                }}
                            >
                                APP VERSION {DeviceInfo.getVersion()}
                            </Text>
                            {commonService.rootUrl.includes('staging') && (
                                <Text
                                    style={{
                                        fontFamily: 'OpenSans-Regular',
                                        textAlign: 'center',
                                        color: colors.secondBackground,
                                        marginTop: 15 * factorRatio,
                                        fontSize: 12 * factorRatio,
                                    }}
                                >
                                    BUILD NUMBER {DeviceInfo.getBuildNumber()}
                                </Text>
                            )}
                        </ScrollView>
                    </View>
                </View>
                <Modal
                    key={'logout'}
                    isVisible={this.state.showLogOut}
                    style={[
                        styles.centerContent,
                        {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        },
                    ]}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={true}
                >
                    <LogOut
                        hideLogOut={() => {
                            this.setState({showLogOut: false});
                        }}
                    />
                </Modal>
                <Loading
                    ref={ref => {
                        this.loadingRef = ref;
                    }}
                />
                <CustomModal
                    ref={ref => {
                        this.customModal = ref;
                    }}
                />
                <CustomModal
                    ref={r => (this.restoreSuccessfull = r)}
                    additionalBtn={
                        <TouchableOpacity
                            onPress={() => this.restoreSuccessfull.toggle()}
                            style={{
                                marginTop: 10,
                                borderRadius: 50,
                                backgroundColor: colors.pianoteRed,
                            }}
                        >
                            <Text
                                style={{
                                    padding: 15,
                                    fontSize: 15,
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontFamily: 'OpenSans-Bold',
                                }}
                            >
                                OK
                            </Text>
                        </TouchableOpacity>
                    }
                    onClose={() => {
                        if (this.loadingRef)
                            this.loadingRef.toggleLoading(false);
                    }}
                />
                <NavigationBar currentPage={'PROFILE'} />
            </View>
        );
    }
}
