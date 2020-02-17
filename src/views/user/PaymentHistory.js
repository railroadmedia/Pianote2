/**
 * PaymentHistory
 */
import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';

export default class PaymentHistory extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.imageIURL = require('Pianote2/src/assets/img/imgs/lisa-foundations.png')
        this.state = {
            weeklyCommunityUpdatesClicked: true,
            commentRepliesClicked: false, 
            commentLikesClicked: true,
            forumPostRepliesClicked: false,
            forumPostLikesClicked: true,
            frequency: 'Immediate',
            payments: [
                ['Faster Fingers', 'December 20, 2019', 197],
                ['Faster Fingers', 'December 20, 2019', 197],
                ['Faster Fingers', 'December 20, 2019', 197],
                ['Faster Fingers', 'December 20, 2019', 197],
                ['Faster Fingers', 'December 20, 2019', 197],
                ['Faster Fingers', 'December 20, 2019', 197],
                ['Faster Fingers', 'December 20, 2019', 197],
                ['Faster Fingers', 'December 20, 2019', 197],
                ['Faster Fingers', 'December 20, 2019', 197],
                ['Faster Fingers', 'December 20, 2019', 197],
            ],
        }
    }


    mapPayments() {
        return this.state.payments.map((row, index) => {
            console.log(row)
            return (
                <View key={index}
                    style={{
                        height: fullHeight*0.085,
                        width: fullWidth,
                        backgroundColor: 'white',
                        paddingLeft: fullWidth*0.05,
                        paddingRight: fullWidth*0.05,
                    }}
                >
                    <View style={{flex: 1}}/>
                    <View>
                        <View key={'date'}>
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 12*factorRatio,
                                    color: 'grey',
                                }}
                            >
                                {row[1]}
                            </Text>
                        </View>
                        <View style={{height: 5*factorVertical}}/>
                        <View key={'payment'}
                            style={{flexDirection: 'row'}}
                        >
                            <Text 
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 14*factorRatio,
                                }}
                            >
                                {row[0]}
                            </Text>
                            <View style={{flex: 1}}/>
                            <Text 
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 14*factorRatio,
                                }}
                            >
                                USD${row[2]}
                            </Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}/>
                </View>
            )
        })
                    
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
                    <View key={'contentContainer'}
                        style={{flex: 1}}
                    >
                        <View key={'buffer'}
                            style={{
                                height: (hasNotch) ? 15*factorVertical : 0,
                            }}
                        >
                        </View>
                        <View key={'header'}
                            style={[
                                styles.centerContent, {
                                flex: 0.1,
                                borderBottomColor: '#ececec',
                                borderBottomWidth: 1*factorRatio,
                            }]}
                        >
                            <View key={'goback'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    left: 0, 
                                    bottom: 0*factorRatio,
                                    height: 50*factorRatio,
                                    width: 50*factorRatio,
                                }]}
                            >
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.goBack()}
                                    style={[
                                        styles.centerContent, {
                                        height: '100%',
                                        width: '100%',
                                    }]}
                                >
                                    <EntypoIcon
                                        name={'chevron-thin-left'}
                                        size={22.5*factorRatio}
                                        color={'black'}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 0.66}}></View>
                            <Text
                                style={{
                                    fontWeight: '600',
                                    fontSize: 20*factorRatio,
                                }}
                            >
                                Payment History
                            </Text>
                            <View style={{flex: 0.33}}></View>
                        </View>
                        <ScrollView style={{flex: 0.95}}>
                            {this.mapPayments()}
                        </ScrollView>
                    </View>
                    <NavigationBar
                        currentPage={'PROFILE'}
                    />
                </View>
            </View>
        )
    }
}