/**
 * HorizontalVideoList
 */
import React from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator,
    TouchableOpacity, 
    TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import TheFourPillars from '../modals/TheFourPillars';
import Icon from 'react-native-vector-icons/AntDesign';

class HorizontalVideoList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.showFooter = this.showFooter.bind(this)
        this.state = {
            showCourse: false,
        }
    }


    addToMyList = async (contentID) => {
        await fetch('http://127.0.0.1:5000/addToMyList', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                ID: contentID,
            })
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('response, addded to my list: ', response)
            })
            .catch((error) => {
                console.log('API Error: ', error)
            }) 
    } 


    showFooter() {
        if(this.props.items.length == 0) {
            return (
                <View 
                    style={[
                        styles.centerContent, {
                        height: '100%',
                    }]}
                >
                    <View style={{flex: 0.33}}/>
                    <ActivityIndicator 
                        size={'small'}
                        color={'grey'}
                    />
                    <View style={{flex: 0.66}}/>
                </View>
            )
        } else {
            return (
                <View style={{height: 10*factorHorizontal}}/>
            )
        }
    }

    capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    render = () => {
        return (
            <View style={styles.container}>
                <View style={[styles.centerContent, {minHeight: this.props.itemHeight}]}>
                    <View key={'container'}
                        style={[
                            styles.centerContent, {
                            width: fullWidth-20*factorHorizontal,
                        }]}
                    >
                        <View style={{height: 10*factorVertical}}/>
                        <View key={'title'}
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignContent: 'center',
                                paddingBottom: 5*factorVertical
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18*factorRatio,
                                    marginBottom: 5*factorVertical,
                                    textAlign: 'left', 
                                    fontWeight: (Platform.OS == 'ios') ? '900' : 'bold', 
                                    fontFamily: 'RobotoCondensed-Bold',
                                    color: colors.secondBackground,
                                }}
                            >
                                {this.props.Title}
                            </Text>
                            <View style={{flex: 1}}/>
                            <TouchableOpacity key={'seeAll'}
                                style={{flex: 1}}
                                onPress={() => this.props.seeAll()}
                            >
                                <Text 
                                    style={{
                                        textAlign: 'right',
                                        fontSize: 14.5*factorRatio,
                                        marginRight: 3.5*factorHorizontal,
                                        fontWeight: '300',
                                        marginTop: 5*factorVertical,
                                        color: 'red',
                                    }}
                                >
                                    See All
                                </Text>
                            </TouchableOpacity>
                            <View style={{flex: 0.1}}/>
                        </View>
                        {((this.props.Description === '') ? false : true) && (
                        <View key={'description'}
                            style={{flex: 0.5}}
                        >
                            <Text 
                                style={{
                                    fontSize: 16*factorRatio,
                                    fontFamily: 'OpenSans-Regular',
                                    color: 'white',
                                }}
                            >
                                {this.props.Description}
                            </Text>
                        </View>
                        )}
                    </View>
                    {(this.props.Description === '' ? false : true) && (
                    <View style={{height: 0*factorVertical}}/>
                    )}
                    <FlatList
                        data={this.props.items}
                        onLayout={console.log(this.props.items)}
                        extraData={this.state}
                        horizontal={true}
                        ListFooterComponent={this.showFooter}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) =>
                        <View>
                            <TouchableHighlight 
                                underlayColor={'transparent'}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        width: this.props.itemWidth,
                                        height: this.props.itemHeight,
                                        marginRight: 10*factorHorizontal,
                                        borderRadius: 7.5*factorRatio,
                                        backgroundColor: '#ececec',
                                    }]}
                                >
                                    <TouchableOpacity
                                        onLongPress={() => {
                                            this.setState({
                                                showCourse:  true,
                                                item,
                                            })
                                        }}
                                        delayLongPress={350}
                                        onPress={() => {
                                            this.props.navigation.navigate('VIDEOPLAYER')
                                        }}
                                        style={{
                                            flex: 1, 
                                            alignSelf: 'stretch'
                                        }}
                                    >
                                        <FastImage 
                                            style={{flex: 1, borderRadius: 7.5*factorRatio}}
                                            source={{uri: item.thumbnail}}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />        
                                    </TouchableOpacity>
                                </View>
                            </TouchableHighlight>
                            <View 
                                style={{
                                    width: this.props.itemWidth,
                                    height: 80*factorVertical,
                                    flexDirection: 'row',
                                }}
                            >
                                <View style={{flex: 0.8}}>
                                    <Text 
                                        numberOfLines={2} 
                                        style={{
                                            fontSize: 15.5*factorRatio,
                                            marginTop: 7.5*factorRatio,
                                            textAlign: 'left', 
                                            fontWeight: (Platform.OS == 'ios') ? '800' : 'bold',
                                            fontFamily: 'OpenSans-Regular',
                                            color: 'white',
                                        }}
                                    >
                                        {item.title}
                                    </Text>
                                    <View style={{height: 3*factorRatio}}/>
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        {this.props.showType && (
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                textAlign: 'left',
                                                fontFamily: 'OpenSans-Regular',
                                                color: colors.secondBackground,
                                                fontSize: 12*factorRatio,
                                            }}
                                        >
                                            {this.capitalize(item.type)} / 
                                        </Text>
                                        )}
                                        {this.props.showArtist && (
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                textAlign: 'left',
                                                fontFamily: 'OpenSans-Regular',
                                                color: colors.secondBackground,
                                                fontSize: 12*factorRatio,
                                            }}
                                        > {item.artist}
                                        </Text>
                                        )}
                                    </View>
                                </View>
                                <View style={{flex: 0.2, flexDirection: 'row'}}>
                                    <View style={{flex: 1}}/>
                                    {this.props.showArtist && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.addToMyList(item.id)
                                        }}
                                        style={{
                                            paddingTop: 5*factorVertical
                                        }}
                                    >
                                        <Icon
                                            name={'plus'}
                                            size={30*factorRatio}
                                            color={colors.pianoteRed}
                                        />
                                    </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    }/>
                    <Modal key={'modal'}
                        isVisible={this.state.showCourse}
                        style={[
                            styles.centerContent, {
                            margin: 0,
                            height: fullHeight,
                            width: fullWidth,
                        }]}
                        animation={'slideInUp'}
                        animationInTiming={250}
                        animationOutTiming={250}
                        coverScreen={true}
                        hasBackdrop={false}
                        backdropColor={'white'}
                        backdropOpacity={0.79}
                    >
                        <TheFourPillars
                            data={this.state.item}
                            hideTheFourPillars={() => {
                                this.setState({
                                    showCourse: false
                                })
                            }}
                        />
                    </Modal>       
                </View>
            </View>
        )
    }
}

export default withNavigation(HorizontalVideoList);