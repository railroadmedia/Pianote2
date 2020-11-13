/**
 * BlurredList
 */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import FeatherIcon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-community/async-storage';
import {NetworkContext} from '../context/NetworkProvider';

const navigationOptions = [
    {
        title: 'Home',
        navigator: 'LESSONS',
    },
    {
        title: 'Foundations',
        navigator: 'FOUNDATIONS',
    },
    {
        title: 'Courses',
        navigator: 'COURSE',
    },
    {
        title: 'Songs',
        navigator: 'SONGCATALOG',
    },
    {
        title: 'Student Focus',
        navigator: 'STUDENTFOCUSCATALOG',
    },
];
class NavigationMenu extends React.Component {
    static contextType = NetworkContext;
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            foundationIsStarted: false,
            foundationIsCompleted: false,
        };
    }

    UNSAFE_componentWillMount = async () => {
        let data = await AsyncStorage.multiGet([
            'foundationsIsStarted',
            'foundationsIsCompleted',
        ]);

        await this.setState({
            foundationIsStarted:
                typeof data[0][1] !== null ? JSON.parse(data[0][1]) : false,
            foundationIsCompleted:
                typeof data[1][1] !== null ? JSON.parse(data[1][1]) : false,
        });
    };

    lessonNav() {
        return (
            <View>
                {navigationOptions.map((nav, index) => (
                    <View
                        key={index}
                        style={[
                            styles.centerContent,
                            {
                                height: onTablet
                                    ? fullHeight * 0.125
                                    : fullHeight * 0.1,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                if (!this.context.isConnected)
                                    return this.context.showNoConnectionAlert();
                                this.props.onClose(false);
                                if (nav.title === 'Foundations') {
                                    this.props.navigation.navigate(
                                        'FOUNDATIONS',
                                        {
                                            foundationIsStarted: this.state
                                                .foundationIsStarted,
                                            foundationIsCompleted: this.state
                                                .foundationIsCompleted,
                                        },
                                    );
                                } else {
                                    this.props.navigation.navigate(
                                        nav.navigator,
                                    );
                                }
                            }}
                            style={{flex: 1}}
                        >
                            <Text
                                style={{
                                    fontFamily:
                                        this.props.parentPage ==
                                        nav.title.toUpperCase()
                                            ? 'OpenSans-ExtraBold'
                                            : 'OpenSans-Bold',
                                    color:
                                        this.props.parentPage ==
                                        nav.title.toUpperCase()
                                            ? 'white'
                                            : colors.secondBackground,
                                    fontSize:
                                        (this.props.parentPage ==
                                        nav.title.toUpperCase()
                                            ? 32.5 * factorRatio
                                            : 27.5 * factorRatio) +
                                        (onTablet ? 27.5 : 0),
                                }}
                            >
                                {nav.title}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View
                    style={[
                        styles.centerContent,
                        {
                            height: onTablet
                                ? fullHeight * 0.125
                                : fullHeight * 0.1,
                            alignSelf: 'center',
                        },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.props.onClose(false);
                        }}
                        style={[
                            styles.centerContent,
                            styles.innerRedButton,
                            styles.redButton,
                        ]}
                    >
                        <FeatherIcon
                            size={50 * factorRatio}
                            name={'x'}
                            color={'white'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render = () => {
        return (
            <View
                key={'componentContainer'}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.mainBackground,
                    borderWidth: 1,
                    borderColor: 'red',
                }}
            >
                {this.lessonNav()}
            </View>
        );
    };
}

export default withNavigation(NavigationMenu);
