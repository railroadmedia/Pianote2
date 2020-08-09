<img src="https://github.com/railroadmedia/pianote-app/blob/master/src/assets/img/svgs/pian.jpg" width="300" />

<H1>Pianote App</H1>

Repository for the Pianote Mobile App for education in piano. Developed using React Native. An overview of installation and running the app is provided here, see the React Native Docs for more in-depth information.

<H1>Installation</H1>

Development was completed using Mac OS, and is required to develop iOS, so these instructions are for Mac OS although React Native Android development can be done on Windows and Linux.

<H2>Install React Native CLI and Dependencies</H2>

Follow the React Native CLI Quick Start guide on React Native Getting Started for iOS & Android development.

<H3>Install Yarn</H3>

In addition to the installation from React Native CLI Quick Start, Yarn is used for package management

`brew install yarn`

<H3>Clone repo and download dependencies</H3>

```
git clone https://github.com/railroadmedia/Pianote2.git
cd Pianote
yarn install
```

<H2>Running Debug App Versions</H2>

<H3>iOS</H3>

`react-native run-ios`

first, to see a list of available iOS simulators:

`xcrun simctl list`

then specify a specific simulator:

`react-native run-ios --simulator "iPhone X"`

To run on a physical iOS device:

Plugin device
• Open the XCode project located in the ios directory
• Set the active scheme to DrumeoKidsApp > 'Your Device'
• Make sure the correct signing is set up, for team Musora Media Inc.
• Build and run current scheme

<H3>Android</H3>

Open a simulator from Android Studio > Tools > AVD Manager or plug in an android device A physical device needs to have usb debugging enabled

`react-native run-android`

<H2>Running Release App Versions</H2>

<H3>iOS</H3>

Same as the debug version, but set the active scheme to DrumeoKidsApp Release

<H3>Android</H3>

Release versions of Android need to be signed. See instructions on generating an upload key and setting up gradle variables. For testing you can create your own keystore and replace the variables in the gradle file with that. When we release the app to the Google Play Store I will share the keystore that I generated for that upload as only one key can be used to upload apks to the Play Store.

Once the key is setup, the app can be run on an android simulator or device in release mode:

`react-native run-android --variant=release`

<H2>In-App Purchases</H2>

<H3>iOS</H3>

In order to in-app purchases during testing, you will need to setup a sandbox tester in App Store Connect. You can't use your existing apple id and the email you use to create the account can't already be associated with an apple id. I just created a new gmail account for my own testing. See this guide for more info on setting up a test account.

Also, the in-app purchases that I have made for testing are consumable - which allows you to delete the app / erase content and then re-purchase the lessons which I thought could be helpful for testing. When we get closer to release I will create the non-consummable in-app products and we can do a quick test of those to make sure they are working correctly.
