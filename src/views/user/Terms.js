/**
 * Terms
 */
import React from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-navigation';

export default class Terms extends React.Component {
  static navigationOptions = { header: null };
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor={'#ffffff'} barStyle={'dark-content'} />
        <View
          key={'header'}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15
          }}
        >
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

          <Text
            style={{
              fontWeight: Platform.OS == 'android' ? 'bold' : '600',
              fontSize: 20 * factorRatio,
              alignSelf: 'center',
              textAlign: 'center'
            }}
          >
            Terms of Service
          </Text>
          <View style={{ flex: 1 }} />
        </View>
        <ScrollView
          style={{
            flex: 1,
            paddingHorizontal: 15
          }}
        >
          <Text style={styles.title}>Terms of Use</Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold' }]}>
            Please read this agreement carefully before accessing or using this
            web site. By accessing or using the site, you agree to be bound by
            this agreement. The information and services on this site are
            provided by Musora Media, Inc. and its suppliers, subject to your
            agreement to the terms and conditions below.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Use Of Information And Services
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            The staff of Musora Media and its users create the majority of the
            content in this site. The information (including without limitation
            advice and recommendations) and services on the site are intended
            solely as a general educational aid. Musora Media and its agents
            assume no responsibility for any consequence relating directly or
            indirectly to any action or inaction you take based on the
            information, services or other material on this site.
          </Text>
          <Text style={styles.text}>
            While Musora Media strives to keep the information on this site
            accurate, complete, and up-to-date, Musora Media and its suppliers
            cannot guarantee, and will not be responsible for any injuries,
            damage, or loss related to, the accuracy, completeness or timeliness
            of the information.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Copyright Information
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            Unless otherwise noted, all of the text, audio, and video content
            within Pianote.com is the copyrighted property of Musora Media, Inc.
            This copyrighted material includes all writing by staff, video
            lessons, and some of the artwork, drawings and logos. You may print
            out any articles and activities for your personal use only.
          </Text>
          <Text style={styles.text}>
            Materials may not be reproduced on another Web site, book, or
            publication without express written permission. Any reproduction or
            editing by any means mechanical or electronic without the explicit
            written permission of Musora Media is expressly prohibited. Certain
            names, logos, phrases, and artwork on these pages may constitute
            trademarks of Musora Media or its sponsors. The mark "Pianote.com"
            and the contents of its Web site are the sole property of Musora
            Media. Reproduction in whole or in part is strictly prohibited
            without written permission of Musora Media. Musora Media also cannot
            guarantee that all content and material appearing in the Musora
            Media Web site is not infringing on any registered or non-registered
            copyrights.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            User Contributions
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            Users who post materials to this site (e.g., bulletin boards or chat
            rooms) agree to abide by the following rules: (1) users may not post
            or transmit material that is libelous, defamatory, obscene,
            fraudulent, harmful, threatening, abusive or hateful, that violates
            the property rights of others (including without limitation
            infringing use of a copyright or trademark), that violates the
            privacy or publicity right of others, or that is in violation of
            applicable laws; (2) users may not interfere with other user's use
            and enjoyment of this site; (3) users may not use this site to
            conduct any activity that is illegal or that violates the rights of
            others; (4) users may not use this site to advertise or sell
            products or services to others; and (5) users must immediately
            inform Musora Media if they have reason to believe that a user is
            infringing any copyrighted materials. A user posting material
            represents that such material is unique to the user or used with
            permission of the copyright holder, and assigns to Musora Media
            ownership of such material. Musora Media has no responsibility for
            the content of any material posted by users, but Musora Media
            reserves the right in its sole discretion to (i) edit or delete any
            documents, information or other material submitted to or appearing
            on this site, and (ii) refuse access to the site to any user that
            violates this agreement. Bulletin boards and chat rooms contain the
            opinions and views of other parents. Musora Media is not responsible
            for the accuracy of any messages on this site and you should always
            consult a physician or other qualified health care provider before
            relying on any information you find on this site.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Links To Other Web Sites
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            This site may include links to other Internet sites solely as a
            convenience to users. Musora Media does not endorse any such sites
            or the information, material, products or services contained on or
            accessible through the sites, and you access and use such sites,
            including information, material, products and services therein,
            solely at your own risk.
          </Text>
          <Text style={styles.text}>
            Musora Media is not responsible for the use, functionality,
            appearance, privacy policy, upkeep, or management of featured links.
            Should a problem arise with a featured link, the user should contact
            the appropriate author(s) with any questions or concerns.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Disclaimer of Warranty
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            Musora Media AND ITS SUPPLIERS DISCLAIM ALL EXPRESS AND IMPLIED
            WARRANTIES WITH REGARD TO THE INFORMATION, SERVICES, AND MATERIALS
            CONTAINED ON THIS SITE INCLUDING WITHOUT LIMITATION ANY IMPLIED
            WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. ALL SUCH INFORMATION, SERVICES, AND MATERIALS ARE
            PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Limitation of Liability
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            IN NO EVENT SHALL Musora Media OR ITS SUPPLIERS BE LIABLE FOR ANY
            SPECIAL, INDIRECT, PUNITIVE INCIDENTAL, EXEMPLARY OR CONSEQUENTIAL
            DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
            BUSINESS, DATA OR PROFITS, LITIGATION AND THE LIKE, WHETHER BASED ON
            BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), PRODUCT LIABILITY
            OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            WITH RESPECT TO GOODS OR SERVICES PURCHASED THROUGH THIS SITE,
            Musora Media'S LIABILITY, IN ANY CASE, IS EXPRESSLY LIMITED TO
            REPLACEMENT OF DEFECTIVE GOODS, OR, AT Musora Media'S ELECTION, TO
            THE REPAYMENT OR CREDITING OF BUYER WITH AN AMOUNT EQUAL TO THE
            PURCHASE PRICE OF THE GOODS. YOU ACKNOWLEDGE AND AGREE THAT THE
            LIMITATIONS SET FORTH ABOVE ARE FUNDAMENTAL ELEMENTS OF THIS
            AGREEMENT AND THE SITE WOULD NOT BE PROVIDED TO YOU ABSENT SUCH
            LIMITATIONS. SOME STATE STATUTES MIGHT APPLY REGARDING LIMITATION OF
            LIABILITY.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Indemnification
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            You agree to indemnify, defend and hold harmless Musora Media, Inc.,
            its affiliates and suppliers from any liability, loss, claim and
            expense (including attorneys' reasonable fees) related to (i) your
            violation of this agreement, and (ii) your posting of material to
            this site.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Proprietary Rights
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            All materials on this site (as well as the organization and layout
            of the site) are owned and copyrighted by Musora Media, Inc. or its
            suppliers and may be accessed, downloaded or printed for your
            personal non-commercial use only. Without the prior written
            permission of Musora Media or its suppliers, you may not copy,
            distribute or transfer any material on this site, in whole or in
            part.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Changes To Site
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            Musora Media and its suppliers may make improvements or changes in
            the information, services, products, and other materials on this
            site, or terminate this site, at any time without notice. Musora
            Media may modify this agreement at any time, and such modifications
            shall be effective immediately upon posting of the modified
            agreement. Accordingly, you agree to review the agreement
            periodically, and your continued access or use of this site shall be
            deemed your acceptance of the modified agreement.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Restriction of Liability
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            Musora Media makes no claims, promises or guarantees about the
            accuracy, completeness, or adequacy of the contents of its resources
            and expressly disclaims liability for errors and omissions in the
            contents therein.
          </Text>
          <View style={{ height: 25 * factorRatio }} />
          <Text style={[styles.text, { fontWeight: 'bold', marginBottom: 0 }]}>
            Miscellaneous
          </Text>
          <View style={{ height: 5 * factorRatio }} />
          <Text style={styles.text}>
            This agreement and the resolution of any dispute related to this
            Agreement or the site shall be governed by and construed in
            accordance with the laws of Washington, without giving effect to any
            principles of conflicts of law. Musora Media's failure to insist
            upon strict enforcement of any provision of this agreement shall not
            be construed as a waiver of any provision or right. Any legal action
            or proceeding between Musora Media and you related to this agreement
            shall be brought exclusively in a federal or state court of
            competent jurisdiction venue in Washington.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
