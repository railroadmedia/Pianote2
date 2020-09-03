/**
 * PrivacyPolicy
 */
import React from 'react';
import {View, ScrollView, Text, TouchableOpacity} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

export default class PrivacyPolicy extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View styles={{flex: 1, alignSelf: 'stretch'}}>
                <View
                    style={{
                        height: fullHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <View key={'contentContainer'} style={{flex: 1}}>
                        <View
                            key={'buffer'}
                            style={{
                                height: isNotch ? 15 * factorVertical : 0,
                            }}
                        />
                        <View
                            key={'header'}
                            style={[
                                styles.centerContent,
                                {
                                    flex: 0.1,
                                    borderBottomColor: '#ececec',
                                    borderBottomWidth: 1 * factorRatio,
                                },
                            ]}
                        >
                            <View
                                key={'goback'}
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
                                    onPress={() =>
                                        this.props.navigation.goBack()
                                    }
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
                                        color={'black'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 0.66}}/>
                            <Text
                                style={{
                                    fontWeight:
                                        Platform.OS == 'android'
                                            ? 'bold'
                                            : '600',
                                    fontSize: 20 * factorRatio,
                                }}
                            >
                                Privacy Policy
                            </Text>
                            <View style={{flex: 0.33}}/>
                        </View>
                        <ScrollView
                            style={{
                                flex: 0.95,
                                marginLeft: 15,
                                paddingRight: 15,
                            }}
                        >
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={[styles.text, {fontWeight: 'bold'}]}>
                                Below is a list of the standard policies we use on this website. They are in place to safeguard our users, and to ensure we can provide a quality user experience!
                            </Text>
                            <View style={{height: 25 * factorRatio}} />
                            <Text
                                style={[
                                    styles.text,
                                    {fontWeight: 'bold', marginBottom: 0},
                                ]}
                            >
                                Standard Website Logs
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                The Pianote.com website logs all website visitors and transactions. We collect the standard information most all websites collect such as: the type of browser you are using, your IP address, your ISPs domain, time of day, date, web pages viewed, and length of time that you spend visiting this site. This data is logged on our servers, and through Google™ Analytics for internal use only. We won't share any of the information outside of our company, and only analyze group numbers – never singling out an individuals information.
                            </Text>
                            <View style={{height: 25 * factorRatio}} />
                            <Text
                                style={[
                                    styles.text,
                                    {fontWeight: 'bold', marginBottom: 0},
                                ]}
                            >
                                Subscriptions & E-mail Data
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                Our website offers users the option to subscribe for periodical updates. This is done with a name and e-mail address for registration. As with our server logs – all information that is collected will never be shared with any 3rd party.
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                In addition, all outgoing e-mail contains our mailing address and a simple unsubscribe link that can be used by the recipient to remove themselves from our mailing list. Once removed – you will no longer get any e-mail from us. These features are in place to improve our user experience.
                            </Text>
                            <View style={{height: 25 * factorRatio}} />
                            <Text
                                style={[
                                    styles.text,
                                    {fontWeight: 'bold', marginBottom: 0},
                                ]}
                            >
                                IP Logging
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                We use visitor IP information to assist in diagnosing possible problems encountered on our web servers. If there is a future contention, then at least we have records on hand. In addition, an IP address can be used to gather a wide range of demographic information; again, this data is kept internal.
                            </Text>
                            <View style={{height: 25 * factorRatio}} />
                            <Text
                                style={[
                                    styles.text,
                                    {fontWeight: 'bold', marginBottom: 0},
                                ]}
                            >
                                Cookies
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                We use cookies to track basic website information. This data can be used to be sure affiliate partners are recognized for visitors they send to this website, or for tracking our marketing campaigns. With that said, you can rest easy knowing we never single out any individual users, and always analyze group numbers.
                            </Text>
                            <View style={{height: 25 * factorRatio}} />
                            <Text
                                style={[
                                    styles.text,
                                    {fontWeight: 'bold', marginBottom: 0},
                                ]}
                            >
                                External Links
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                This website contains some links to external websites. We are not responsible for the privacy practices or the content of these web destinations. You are encouraged to read the individual privacy policies of those websites to be sure they match our high standards.
                            </Text>
                            <View style={{height: 25 * factorRatio}} />
                            <Text
                                style={[
                                    styles.text,
                                    {fontWeight: 'bold', marginBottom: 0},
                                ]}
                            >
                                Customers
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                Those that buy products on this website are asked for additional information. This data is used to process each sale, and to mail out each order to the correct customer. We keep records of customer data including: name, street address, e-mail address, phone number, and other contact information. However, we do NOT hold credit card data of any kind. Our credit card processing partner Internet Secure™ manages all of that information. In some cases we have the ability to see the last 4-5 digits of a credit card for future client verification.
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                Customers that have purchased from us are also added to our mailing-list by default. However, as stated above – all outgoing e-mail contains a simple unsubscribe link that can be used by the recipient at anytime.
                            </Text>
                            <View style={{height: 25 * factorRatio}} />
                            <Text
                                style={[
                                    styles.text,
                                    {fontWeight: 'bold', marginBottom: 0},
                                ]}
                            >
                                Changes to this Policy
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                Please note that basic changes to this policy can be done at any time.
                            </Text>
                            <View style={{height: 5 * factorRatio}} />
                            <Text style={styles.text}>
                                We pride ourselves on taking every precaution necessary to ensure our users are safe and secure while browsing our website. This is why we have developed a privacy policy that covers how we collect, and store your information.
                            </Text>
                            <View style={{height: 25 * factorRatio}} />
                            <Text 
                                style={[
                                    styles.text, 
                                {
                                    paddingLeft: 10*factorRatio, 
                                    paddingRight: 10*factorRatio,
                                    textAlign: 'center'
                                }]}
                            >
                                Please contact <Text
                                style={[
                                    styles.text,
                                    {fontWeight: 'bold', marginBottom: 0},
                                ]}> support@pianote.com</Text> if you have any questions that aren't answered here.
                            </Text>
                            <View style={{height: 25 * factorRatio}} />
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}
