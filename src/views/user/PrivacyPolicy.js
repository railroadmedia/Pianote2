/**
 * PrivacyPolicy
 */
import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-navigation';

export default class PrivacyPolicy extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'} />
        <View style={localStyles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={{ flex: 1 }}
          >
            <EntypoIcon
              name={'chevron-thin-left'}
              size={22.5 * factorRatio}
              color={'black'}
            />
          </TouchableOpacity>
          <Text style={localStyles.title}>Privacy Policy</Text>
          <View style={{ flex: 1 }} />
        </View>
        <ScrollView style={localStyles.scrollContainer}>
          <Text style={[styles.text, localStyles.subtitle]}>
            Indemnification Below is a list of the standard policies we use on
            this website. They are in place to safeguard our users, and to
            ensure we can provide a quality user experience!
          </Text>
          <Text style={[styles.text, localStyles.subtitle]}>
            Standard Website Logs
          </Text>
          <Text style={styles.text}>
            The Pianote.com website logs all website visitors and transactions.
            We collect the standard information most all websites collect such
            as: the type of browser you are using, your IP address, your ISPs
            domain, time of day, date, web pages viewed, and length of time that
            you spend visiting this site. This data is logged on our servers,
            and through Google™ Analytics for internal use only. We won't share
            any of the information outside of our company, and only analyze
            group numbers – never singling out an individuals information.
          </Text>
          <Text style={[styles.text, localStyles.subtitle]}>
            Subscriptions & E-mail Data
          </Text>
          <Text style={styles.text}>
            Our website offers users the option to subscribe for periodical
            updates. This is done with a name and e-mail address for
            registration. As with our server logs – all information that is
            collected will never be shared with any 3rd party.
          </Text>
          <Text style={styles.text}>
            In addition, all outgoing e-mail contains our mailing address and a
            simple unsubscribe link that can be used by the recipient to remove
            themselves from our mailing list. Once removed – you will no longer
            get any e-mail from us. These features are in place to improve our
            user experience.
          </Text>
          <Text style={[styles.text, localStyles.subtitle]}>IP Logging</Text>
          <Text style={styles.text}>
            We use visitor IP information to assist in diagnosing possible
            problems encountered on our web servers. If there is a future
            contention, then at least we have records on hand. In addition, an
            IP address can be used to gather a wide range of demographic
            information; again, this data is kept internal.
          </Text>
          <Text style={[styles.text, localStyles.subtitle]}>Cookies</Text>
          <Text style={styles.text}>
            We use cookies to track basic website information. This data can be
            used to be sure affiliate partners are recognized for visitors they
            send to this website, or for tracking our marketing campaigns. With
            that said, you can rest easy knowing we never single out any
            individual users, and always analyze group numbers.
          </Text>
          <Text style={[styles.text, localStyles.subtitle]}>
            External Links
          </Text>
          <Text style={styles.text}>
            This website contains some links to external websites. We are not
            responsible for the privacy practices or the content of these web
            destinations. You are encouraged to read the individual privacy
            policies of those websites to be sure they match our high standards.
          </Text>
          <Text style={[styles.text, localStyles.subtitle]}>Customers</Text>
          <Text style={styles.text}>
            Those that buy products on this website are asked for additional
            information. This data is used to process each sale, and to mail out
            each order to the correct customer. We keep records of customer data
            including: name, street address, e-mail address, phone number, and
            other contact information. However, we do NOT hold credit card data
            of any kind. Our credit card processing partner Internet Secure™
            manages all of that information. In some cases we have the ability
            to see the last 4-5 digits of a credit card for future client
            verification.
          </Text>
          <Text style={styles.text}>
            Customers that have purchased from us are also added to our
            mailing-list by default. However, as stated above – all outgoing
            e-mail contains a simple unsubscribe link that can be used by the
            recipient at anytime.
          </Text>
          <Text style={[styles.text, localStyles.subtitle]}>
            Changes to this Policy
          </Text>
          <Text style={styles.text}>
            Please note that basic changes to this policy can be done at any
            time.
          </Text>
          <Text style={styles.text}>
            We pride ourselves on taking every precaution necessary to ensure
            our users are safe and secure while browsing our website. This is
            why we have developed a privacy policy that covers how we collect,
            and store your information.
          </Text>
          <Text style={[styles.text, localStyles.contact]}>
            Please contact{' '}
            <Text style={[styles.text, localStyles.subtitle]}>
              {' '}
              support@pianote.com
            </Text>{' '}
            if you have any questions that aren't answered here.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const localStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  title: {
    fontWeight: Platform.OS == 'android' ? 'bold' : '800',
    fontSize:
      (20 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    alignSelf: 'center',
    textAlign: 'center'
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15
  },
  subtitle: {
    paddingBottom:
      (5 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    marginTop:
      (25 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    fontWeight: 'bold',
    marginBottom: 0
  },
  contact: {
    marginTop: 20,
    paddingLeft:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    paddingRight:
      (10 *
        (Dimensions.get('window').height / 812 +
          Dimensions.get('window').width / 375)) /
      2,
    textAlign: 'center'
  }
});
