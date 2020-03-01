/**
 * Replies
*/
import React from 'react';
import { 
    View,
    Text,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

class Replies extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            replies: [
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 0, 28,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
                ['Lorem ipsum dolor sit smart cosaf adlsafdd. elit, Prascent quie eros magna. Etrian tincidunt', 'Username', 'User Rank', '48 mins ago', '10.0 k', 4, 8,],
            ], // video's comments
        }
    }


    showFooter() {
        if(this.props.outReplies == false) {
            return (
                <View
                    style={[
                        styles.centerContent, {
                        marginTop: 15*factorRatio,
                        height: 35*factorVertical
                    }]}
                >
                    <ActivityIndicator
                        size={(isTablet) ? 'large' : 'small'}
                        color={'grey'}
                    />
                </View>
            )
        } else {
            return (
                <View style={{height:20*factorVertical}}/>
            )
        }
    }


    renderComment(row) {
        return (
            <View 
                style={{
                    backgroundColor: 'white',
                    paddingTop: fullHeight*0.025,
                    paddingBottom: fullHeight*0.02,
                    paddingLeft: fullWidth*0.05,
                    paddingRight: fullWidth*0.03,
                    minHeight: 40*factorVertical,
                    flexDirection: 'row',
                }}
            >
                <View>
                    <View style={{alignItems: 'center'}}>
                        <FastImage
                            style={{
                                height: 40*factorHorizontal,
                                width: 40*factorHorizontal,
                                borderRadius: 100,
                            }}
                            source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                            resizeMode={FastImage.resizeMode.stretch}
                        />
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                fontSize: 10*factorRatio,
                                marginTop: 2*factorRatio,
                                fontWeight: '700',
                                color: 'grey',
                            }}
                        >
                            {row.item[4]}
                        </Text>
                    </View>
                    <View style={{flex: 1}}/>
                </View>
                <View 
                    style={{
                        flex: 1,
                        paddingLeft: 12.5*factorHorizontal,
                    }}
                >
                    <View style={{height: 3*factorVertical}}/>
                    <Text 
                        style={{
                            fontFamily: 'Roboto',
                            fontSize: 13*factorRatio,
                        }}
                    >
                        {row.item[0]}
                    </Text>
                    <View style={{height: 7.5*factorVertical}}/>
                    <Text
                        style={{
                            fontFamily: 'Roboto',
                            fontSize: 11*factorRatio,
                            color: 'grey',
                        }}
                    >
                        {row.item[1]} | {row.item[2]} | {row.item[3]}
                    </Text>
                    <View style={{height: 50*factorVertical}}>
                        <View style={{flex: 1}}/>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity 
                                    onPress={() => {}}
                                    style={{
                                    }}
                                >
                                    <AntIcon
                                        name={'like2'}
                                        size={20*factorRatio}
                                        color={'black'}
                                    />
                                </TouchableOpacity>
                                <View style={{width: 10*factorHorizontal}}/>
                                {(row.item[6] > 0) && (
                                <View>
                                    <View style={{flex: 1}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            borderRadius: 40,
                                            paddingLeft: 8*factorHorizontal,
                                            paddingRight: 8*factorHorizontal,
                                            paddingTop: 4*factorVertical,
                                            paddingBottom: 4*factorVertical,
                                            backgroundColor: '#ececec',
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontSize: 9.5*factorRatio,
                                                color: 'dimgrey',
                                            }}
                                        >
                                            {row.item[6]} LIKES
                                        </Text>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>                                
                                )}
                            </View>
                            <View style={{width: 20*factorHorizontal}}/>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity 
                                    onPress={() => {}}
                                    style={{
                                    }}
                                >
                                    <MaterialIcon
                                        name={'comment-text-outline'}
                                        size={20*factorRatio}
                                        color={'black'}
                                    />
                                </TouchableOpacity>
                                <View style={{width: 10*factorHorizontal}}/>
                                {(row.item[5] > 0) && (
                                <View>
                                    <View style={{flex: 1}}/>
                                    <View 
                                        style={[
                                            styles.centerContent, {
                                            borderRadius: 40,
                                            paddingLeft: 8*factorHorizontal,
                                            paddingRight: 8*factorHorizontal,
                                            paddingTop: 4*factorVertical,
                                            paddingBottom: 4*factorVertical,
                                            backgroundColor: '#ececec',
                                        }]}
                                    >
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontSize: 10*factorRatio,
                                                color: 'dimgrey',
                                            }}
                                        >
                                            {row.item[5]} REPLIES
                                        </Text>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                )}
                            </View>
                        </View>
                        <View style={{flex: 1}}/>
                    </View>
                </View>
            </View>
        )
    }


    mapReplies() {
        return this.state.replies.map((row, index) => {
            return (
                <View 
                    style={{
                        backgroundColor: 'white',
                        paddingTop: fullHeight*0.01,
                        paddingBottom: fullHeight*0.01,
                        paddingLeft: fullWidth*0.05,
                        paddingRight: fullWidth*0.03,
                        minHeight: 30*factorVertical,
                        flexDirection: 'row',
                    }}
                >
                    <View>
                        <View style={{alignItems: 'center'}}>
                            <FastImage
                                style={{
                                    height: 40*factorHorizontal,
                                    width: 40*factorHorizontal,
                                    borderRadius: 100,
                                }}
                                source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                            <Text
                                style={{
                                    fontFamily: 'Roboto',
                                    fontSize: 10*factorRatio,
                                    marginTop: 2*factorRatio,
                                    fontWeight: '700',
                                    color: 'grey',
                                }}
                            >
                                {row[4]}
                            </Text>
                        </View>
                        <View style={{flex: 1}}/>
                    </View>
                    <View 
                        style={{
                            flex: 1,
                            paddingLeft: 12.5*factorHorizontal,
                        }}
                    >
                        <View style={{height: 3*factorVertical}}/>
                        <Text 
                            style={{
                                fontFamily: 'Roboto',
                                fontSize: 13*factorRatio,
                            }}
                        >
                            {row[0]}
                        </Text>
                        <View style={{height: 7.5*factorVertical}}/>
                        <Text
                            style={{
                                fontFamily: 'Roboto',
                                fontSize: 11*factorRatio,
                                color: 'grey',
                            }}
                        >
                            {row[1]} | {row[2]} | {row[3]}
                        </Text>
                        <View
                            style={{
                                height: 50*factorVertical,
                            }}
                        >
                            <View style={{flex: 1}}/>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity 
                                        onPress={() => {}}
                                        style={{
                                        }}
                                    >
                                        <AntIcon
                                            name={'like2'}
                                            size={20*factorRatio}
                                            color={'black'}
                                        />
                                    </TouchableOpacity>
                                    <View style={{width: 10*factorHorizontal}}/>
                                    {(row[6] > 0) && (
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <View 
                                            style={[
                                                styles.centerContent, {
                                                borderRadius: 40,
                                                paddingLeft: 8*factorHorizontal,
                                                paddingRight: 8*factorHorizontal,
                                                paddingTop: 4*factorVertical,
                                                paddingBottom: 4*factorVertical,
                                                backgroundColor: '#ececec',
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 9.5*factorRatio,
                                                    color: 'dimgrey',
                                                }}
                                            >
                                                {row[6]} LIKES
                                            </Text>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>                                
                                    )}
                                </View>
                                <View style={{width: 20*factorHorizontal}}/>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity 
                                        onPress={() => {}}
                                        style={{
                                        }}
                                    >
                                        <MaterialIcon
                                            name={'comment-text-outline'}
                                            size={20*factorRatio}
                                            color={'black'}
                                        />
                                    </TouchableOpacity>
                                    <View style={{width: 10*factorHorizontal}}/>
                                    {(row[5] > 0) && (
                                    <View>
                                        <View style={{flex: 1}}/>
                                        <View 
                                            style={[
                                                styles.centerContent, {
                                                borderRadius: 40,
                                                paddingLeft: 8*factorHorizontal,
                                                paddingRight: 8*factorHorizontal,
                                                paddingTop: 4*factorVertical,
                                                paddingBottom: 4*factorVertical,
                                                backgroundColor: '#ececec',
                                            }]}
                                        >
                                            <Text
                                                style={{
                                                    fontFamily: 'Roboto',
                                                    fontSize: 9.5*factorRatio,
                                                    color: 'dimgrey',
                                                }}
                                            >
                                                {row[5]} REPLIES
                                            </Text>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>
                                    )}
                                </View>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                </View>
            )
        })
    }


    render = () => {
        return (
            <View key={'componentContainer'}
                style={[
                    styles.centerContent, {
                    position: 'absolute',
                    bottom: 0,
                    height: (isTablet) ? fullHeight*0.6 : fullHeight*0.6975,
                    width: fullWidth,
                    zIndex: 10,
                }]}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior={'never'}
                    style={{flex: 1, backgroundColor: 'white'}}
                >
                    <View style={{flex: 1}}>
                        <View key={'commentCount'}
                            style={{
                                width: fullWidth,
                                backgroundColor: 'white',
                                zIndex: 5,
                            }}
                        >
                            <View style={{height: fullHeight*0.025}}/>
                            <View key={'commentHeader'}
                                style={{
                                    width: fullWidth,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.02,
                                }}
                            >
                                <View>
                                    <View style={{flex: 1}}/>
                                    <Text
                                        style={{
                                            fontSize: 20*factorRatio,
                                            fontWeight: '600',
                                            fontFamily: 'RobotoCondensed-Regular',
                                        }}
                                    >
                                        REPLIES
                                    </Text>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.hideReplies()
                                    }}
                                >
                                    <EntypoIcon
                                        size={27.5*factorRatio}
                                        name={'cross'}
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                <View style={{flex: 0.1}}/>
                            </View>
                            <View style={{flex: 1.25}}/>
                            <View key={'originalReply'}
                                style={{
                                    backgroundColor: 'white',
                                    paddingTop: fullHeight*0.02,
                                    paddingLeft: fullWidth*0.05,
                                    paddingRight: fullWidth*0.03,
                                    minHeight: 30*factorVertical,
                                    flexDirection: 'row',
                                }}
                            >
                                <View>
                                    <View style={{alignItems: 'center'}}>
                                        <FastImage
                                            style={{
                                                height: 40*factorHorizontal,
                                                width: 40*factorHorizontal,
                                                borderRadius: 100,
                                            }}
                                            source={{uri:'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                            resizeMode={FastImage.resizeMode.stretch}
                                        />
                                        <Text
                                            style={{
                                                fontFamily: 'Roboto',
                                                fontSize: 10*factorRatio,
                                                marginTop: 2*factorRatio,
                                                fontWeight: '700',
                                                color: 'grey',
                                            }}
                                        >
                                            13.1k
                                        </Text>
                                    </View>
                                    <View style={{flex: 1}}/>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        paddingLeft: 12.5*factorHorizontal,
                                    }}
                                >
                                    <View style={{height: 3*factorVertical}}/>
                                    <Text 
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 13*factorRatio,
                                        }}
                                    >
                                        Lorem ipsum dolor sit smart cosaf adiffdsf eli, prascent quie eros magnia. Etrian tincidunt
                                    </Text>
                                    <View style={{height: 7.5*factorVertical}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 11*factorRatio,
                                            color: 'grey',
                                        }}
                                    >
                                        user | rank | time
                                    </Text>
                                    <View style={{height: 50*factorVertical}}>
                                        <View style={{flex: 1}}/>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{flexDirection: 'row'}}>
                                                <TouchableOpacity 
                                                    onPress={() => {}}
                                                >
                                                    <AntIcon
                                                        name={'like2'}
                                                        size={20*factorRatio}
                                                        color={'black'}
                                                    />
                                                </TouchableOpacity>
                                                <View style={{width: 10*factorHorizontal}}/>
                                                <View>
                                                    <View style={{flex: 1}}/>
                                                    <View 
                                                        style={[
                                                            styles.centerContent, {
                                                            borderRadius: 40,
                                                            paddingLeft: 8*factorHorizontal,
                                                            paddingRight: 8*factorHorizontal,
                                                            paddingTop: 4*factorVertical,
                                                            paddingBottom: 4*factorVertical,
                                                            backgroundColor: '#ececec',
                                                        }]}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Roboto',
                                                                fontSize: 9.5*factorRatio,
                                                                color: 'dimgrey',
                                                            }}
                                                        >
                                                            4 LIKES
                                                        </Text>
                                                    </View>
                                                    <View style={{flex: 1}}/>
                                                </View>
                                            </View>
                                            <View style={{width: 20*factorHorizontal}}/>
                                            <View style={{flexDirection: 'row'}}>
                                                <TouchableOpacity 
                                                    onPress={() => {

                                                    }}
                                                >
                                                    <MaterialIcon
                                                        name={'comment-text-outline'}
                                                        size={20*factorRatio}
                                                        color={'black'}
                                                    />
                                                </TouchableOpacity>
                                                <View style={{width: 10*factorHorizontal}}/>
                                                <View>
                                                    <View style={{flex: 1}}/>
                                                    <View 
                                                        style={[
                                                            styles.centerContent, {
                                                            borderRadius: 40,
                                                            paddingLeft: 8*factorHorizontal,
                                                            paddingRight: 8*factorHorizontal,
                                                            paddingTop: 4*factorVertical,
                                                            paddingBottom: 4*factorVertical,
                                                            backgroundColor: '#ececec',
                                                        }]}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontFamily: 'Roboto',
                                                                fontSize: 9.5*factorRatio,
                                                                color: 'dimgrey',
                                                            }}
                                                        >
                                                            REPLIES
                                                        </Text>
                                                    </View>
                                                    <View style={{flex: 1}}/>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={{flex: 1}}/>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity key={'addComment'}
                                onPress={() => {
                                    this.props.showMakeComment()
                                }}
                                style={{
                                    width: fullWidth,
                                    height: fullHeight*0.1,
                                    flexDirection: 'row',
                                    paddingLeft: fullWidth*0.05,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        
                                    }}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    <View
                                        style={{
                                            height: '100%',
                                            width: 40*factorHorizontal,
                                        }}
                                    >
                                        <View style={{flex: 1}}/>
                                        <FastImage
                                            style={{
                                                height: 40*factorHorizontal,
                                                width: 40*factorHorizontal,
                                                borderRadius: 100,
                                            }}
                                            source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
                                            resizeMode={FastImage.resizeMode.stretch}
                                        />
                                        <View style={{flex: 1}}/>
                                    </View>
                                </TouchableOpacity>
                                <View style={{width: 12.5*factorHorizontal}}/>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.showMakeComment()
                                    }}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    <View style={{flex: 1}}/>
                                    <Text
                                        style={{
                                            fontFamily: 'Roboto',
                                            fontSize: 14*factorRatio,
                                            color: 'grey',
                                        }}
                                    >
                                        Add a reply...
                                    </Text>
                                    <View style={{flex: 1}}/>
                                </TouchableOpacity>
                            </TouchableOpacity>
                            <View style={{flex: 1}}/>
                        </View>
                        {this.mapReplies()}
                    </View>
                    <View style={{height: fullHeight*0.035}}/>
                </ScrollView>
            </View>
        )
    }
}

export default withNavigation(Replies);