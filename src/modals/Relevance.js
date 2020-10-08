/**
 * Relevance
 */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {withNavigation} from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';

class Relevance extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            currentSort: this.props.currentSort, // 'newest', ‘oldest’, ‘popularity’, ‘trending’ and ‘relevance’
        };
    }

    render = () => {
        return (
            <View style={styles.container}>
                <View style={{flex: 1, alignSelf: 'stretch'}}>
                    <TouchableOpacity
                        onPress={() => this.props.hideRelevance()}
                        style={{
                            height: '100%',
                            width: '100%',
                            alignSelf: 'stretch',
                        }}
                    ></TouchableOpacity>
                </View>
                <View
                    style={{
                        minHeight:
                            fullHeight * 0.4 +
                            (global.isTablet ? fullHeight * 0.1 : 0),
                        flexDirection: 'row',
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            backgroundColor: colors.mainBackground,
                        }}
                    >
                        <TouchableOpacity
                            key={'relevance'}
                            onPress={() => {
                                this.props.hideRelevance(),
                                    this.props.changeSort('relevance');
                            }}
                            style={{
                                flex: 0.4,
                                paddingLeft: fullWidth * 0.05,
                                flexDirection: 'row',
                                borderBottomColor: colors.secondBackground,
                                borderBottomWidth: 0.25 * factorRatio,
                            }}
                        >
                            <View>
                                <View style={{flex: 1}} />
                                <EntypoIcon
                                    name={'check'}
                                    size={20 * factorRatio}
                                    color={
                                        this.state.currentSort == 'relevance'
                                            ? 'white'
                                            : colors.mainBackground
                                    }
                                />
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{width: 15 * factorHorizontal}} />
                            <View>
                                <View style={{flex: 1}} />
                                <Text
                                    style={{
                                        fontSize: 16 * factorRatio,
                                        fontFamily: 'OpenSans',
                                        color:
                                            this.state.currentSort ==
                                            'relevance'
                                                ? 'white'
                                                : colors.secondBackground,
                                    }}
                                >
                                    Relevance
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={'trending'}
                            onPress={() => {
                                this.props.hideRelevance(),
                                    this.props.changeSort('trending');
                            }}
                            style={{
                                flex: 0.4,
                                paddingLeft: fullWidth * 0.05,
                                flexDirection: 'row',
                                borderBottomColor: colors.secondBackground,
                                borderBottomWidth: 0.25 * factorRatio,
                            }}
                        >
                            <View>
                                <View style={{flex: 1}} />
                                <EntypoIcon
                                    name={'check'}
                                    size={20 * factorRatio}
                                    color={
                                        this.state.currentSort == 'trending'
                                            ? 'white'
                                            : colors.mainBackground
                                    }
                                />
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{width: 15 * factorHorizontal}} />
                            <View>
                                <View style={{flex: 1}} />
                                <Text
                                    style={{
                                        fontSize: 16 * factorRatio,
                                        fontFamily: 'OpenSans',
                                        color:
                                            this.state.currentSort == 'trending'
                                                ? 'white'
                                                : colors.secondBackground,
                                    }}
                                >
                                    Trending
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={'popular'}
                            onPress={() => {
                                this.props.hideRelevance(),
                                    this.props.changeSort('popularity');
                            }}
                            style={{
                                flex: 0.4,
                                paddingLeft: fullWidth * 0.05,
                                flexDirection: 'row',
                                borderBottomColor: colors.secondBackground,
                                borderBottomWidth: 0.25 * factorRatio,
                            }}
                        >
                            <View>
                                <View style={{flex: 1}} />
                                <EntypoIcon
                                    name={'check'}
                                    size={20 * factorRatio}
                                    color={
                                        this.state.currentSort == 'popularity'
                                            ? 'white'
                                            : colors.mainBackground
                                    }
                                />
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{width: 15 * factorHorizontal}} />
                            <View>
                                <View style={{flex: 1}} />
                                <Text
                                    style={{
                                        fontSize: 16 * factorRatio,
                                        fontFamily: 'OpenSans',
                                        color:
                                            this.state.currentSort == 'popularity'
                                                ? 'white'
                                                : colors.secondBackground,
                                    }}
                                >
                                    Most Popular
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={'newest'}
                            onPress={() => {
                                this.props.hideRelevance(),
                                    this.props.changeSort('newest');
                            }}
                            style={{
                                flex: 0.4,
                                paddingLeft: fullWidth * 0.05,
                                flexDirection: 'row',
                                borderBottomColor: colors.secondBackground,
                                borderBottomWidth: 0.25 * factorRatio,
                            }}
                        >
                            <View>
                                <View style={{flex: 1}} />
                                <EntypoIcon
                                    name={'check'}
                                    size={20 * factorRatio}
                                    color={
                                        this.state.currentSort == 'newest'
                                            ? 'white'
                                            : colors.mainBackground
                                    }
                                />
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{width: 15 * factorHorizontal}} />
                            <View>
                                <View style={{flex: 1}} />
                                <Text
                                    style={{
                                        fontSize: 16 * factorRatio,
                                        fontFamily: 'OpenSans',
                                        color:
                                            this.state.currentSort == 'newest'
                                                ? 'white'
                                                : colors.secondBackground,
                                    }}
                                >
                                    Newest First
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={'oldest'}
                            onPress={() => {
                                this.props.hideRelevance(),
                                    this.props.changeSort('oldest');
                            }}
                            style={{
                                flex: 0.4,
                                paddingLeft: fullWidth * 0.05,
                                flexDirection: 'row',
                                borderBottomColor: colors.secondBackground,
                                borderBottomWidth: 0.25 * factorRatio,
                            }}
                        >
                            <View>
                                <View style={{flex: 1}} />
                                <EntypoIcon
                                    name={'check'}
                                    size={20 * factorRatio}
                                    color={
                                        this.state.currentSort == 'oldest'
                                            ? 'white'
                                            : colors.mainBackground
                                    }
                                />
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{width: 15 * factorHorizontal}} />
                            <View>
                                <View style={{flex: 1}} />
                                <Text
                                    style={{
                                        fontSize: 16 * factorRatio,
                                        fontFamily: 'OpenSans',
                                        color:
                                            this.state.currentSort == 'oldest'
                                                ? 'white'
                                                : colors.secondBackground,
                                    }}
                                >
                                    Oldest First
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            key={'cancel'}
                            onPress={() => {
                                this.props.hideRelevance();
                            }}
                            style={{
                                flex: 0.4,
                                paddingLeft: fullWidth * 0.05,
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <View style={{flex: 1}} />
                                <EntypoIcon
                                    name={'cross'}
                                    size={25 * factorRatio}
                                    color={'white'}
                                />
                                <View style={{flex: 1}} />
                            </View>
                            <View style={{width: 10 * factorHorizontal}} />
                            <View>
                                <View style={{flex: 1}} />
                                <Text
                                    style={{
                                        fontSize: 16 * factorRatio,
                                        fontFamily: 'OpenSans',
                                        color: 'white',
                                    }}
                                >
                                    Cancel
                                </Text>
                                <View style={{flex: 1}} />
                            </View>
                        </TouchableOpacity>
                        <View style={{flex: 0.25}} />
                    </View>
                </View>
            </View>
        );
    };
}

export default withNavigation(Relevance);
