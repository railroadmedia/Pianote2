/**
 * VerticalVideoList
*/
import React from 'react';
import { 
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import Relevance from '../modals/Relevance';
import FastImage from 'react-native-fast-image';
import { withNavigation } from 'react-navigation';
import TheFourPillars from '../modals/TheFourPillars';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';
import AsyncStorage from '@react-native-community/async-storage';
import ApprovedTeacher from 'Pianote2/src/assets/img/svgs/approved-teacher.svg';

class VerticalVideoList extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showRelevance: false,
        }
    }


    showSpinner = () => {
        return (
            <View
                style={[
                    styles.centerContent, {
                    height: fullHeight*0.415,
                    marginTop: 15*factorRatio,
                }]}
            >
                <ActivityIndicator
                    size={(onTablet) ? 'large' : 'small'}
                    animating={true}
                    color={colors.secondBackground}
                />
            </View>
        )
    }


    addToMyList = async (contentID) => {
        email = await AsyncStorage.getItem('email')

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
                console.log('response, added to my list: ', response)
            })
            .catch((error) => {
                console.log('API Error: ', error)
            }) 
    } 


    removeFromMyList = async (contentID) => {
        email = await AsyncStorage.getItem('email')
        await this.props.removeItem(contentID)
        await fetch('http://127.0.0.1:5000/removeFromMyList', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                ID: contentID,
            })
        })
            .then((response) => response.json())
            .then((response) => {
                this.props.items = []
                console.log('response, removed from my list: ', response)
            })
            .catch((error) => {
                console.log('API Error: ', error)
            }) 
    }


    capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    topics = () => {
        if(this.props.filters.topics.length > 0) {
            var topicString = '/ '

            for(i in this.props.filters.topics) {
                if(i == this.props.filters.topics.length - 1) {
                    topicString = topicString + this.props.filters.topics[i]
                } else { 
                    topicString = topicString + this.props.filters.topics[i] + ', '
                }
            }

            return topicString
        } else {
            return
        }
    }


    instructors = () => {
        if(this.props.filters.instructors.length > 0) {
            var instructorString = '/ '

            for(i in this.props.filters.instructors) {
                if(i == this.props.filters.instructors.length - 1) {
                    instructorString = instructorString + this.props.filters.instructors[i]
                } else { 
                    instructorString = instructorString + this.props.filters.instructors[i] + ', '
                }
            }

            return instructorString
        } else {
            return
        }
    }


    progress = () => {
        if(this.props.filters.progress.length > 0) {
            var progressString = '/ '

            for(i in this.props.filters.progress) {
                if(i == this.props.filters.progress.length - 1) {
                    progressString = progressString + this.props.filters.progress[i]
                } else { 
                    progressString = progressString + this.props.filters.progress[i] + ', '
                }
            }

            return progressString
        } else {
            return
        }
    }


    stringifyFilters = () => {
        return (
            ((this.props.filters.level.length > 0) ? '/ ' +this.props.filters.level[1] + ' ' + this.props.filters.level[0] + ' ' : '' ) + 
            ((typeof(this.topics()) !== 'undefined') ? this.topics()+ ' ' : '') + 
            ((typeof(this.instructors()) !== 'undefined') ? this.instructors()+ ' ' : '') +
            ((typeof(this.progress()) !== 'undefined') ? this.progress() : '')
            )
    }


    renderMappedList = () => {
        if(this.props.items.length == 0) {
            return (
                this.showSpinner()
            )
        } 

        return this.props.items.map((row, index) => {
            return (
                <View key={index}>
                    {(index >= 0 || this.props.showNextVideo == false) && (
                    <View
                        style={{
                            height: this.props.containerHeight,
                            width: this.props.containerWidth,
                            borderTopWidth: this.props.containerBorderWidth,
                            paddingLeft: 10*factorHorizontal,
                            flexDirection:'row',
                            borderTopColor: '#ececec',
                        }}
                    >
                        <TouchableOpacity 
                            onLongPress={() => {
                                this.setState({
                                    showModal: true,
                                    item: row,
                                })
                            }}
                            onPress={() => {
                                this.props.navigation.navigate('VIDEOPLAYER', {
                                    data: row
                                })
                            }}
                            style={{justifyContent: 'center'}}
                            underlayColor={'transparent'}    
                        >
                            <View
                                style={{
                                    width: this.props.imageWidth,
                                    height: this.props.imageHeight,
                                    borderRadius: this.props.imageRadius,
                                }}
                            >
                                <View
                                    style={[
                                        styles.centerContent, {
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                        zIndex: 4,
                                        opacity: 0.3,
                                        top: 0,
                                        left: 0,
                                        position: 'absolute',
                                        backgroundColor: (row.progress == 'check' || 
                                            row.progress == 'progress') ? '#ff3333':'transparent',
                                    }]}
                                >
                                </View>
                                <View
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                        zIndex: 4,
                                        opacity: 1,
                                        backgroundColor: 'transparent',
                                    }]}
                                >
                                    {(row.progress == 'check' || row.progress == 'progress') && (
                                    <ApprovedTeacher
                                        height={50}
                                        width={50*factorRatio}
                                        fill={'white'}
                                    />
                                    )}
                                </View>
                                
                                {this.props.showLines && (
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        top: -3.5*factorVertical,
                                        height: 5*factorVertical,
                                        left: 0,
                                        zIndex: 9,
                                        width: '100%',
                                        position: 'absolute',
                                    }]}
                                >
                                    <View 
                                        style={{
                                            backgroundColor: 'red',
                                            width: '95%',
                                            height: '100%',
                                            borderRadius: 20,
                                        }}
                                    >
                                    </View>
                                </View>
                                )}
                                {this.props.showLines && (
                                <View 
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        top: -7.5*factorVertical,
                                        left: 0,
                                        width: '100%',
                                        height: 7.5*factorVertical,
                                        zIndex: 8,
                                    }]}
                                >
                                    <View 
                                        style={{
                                            backgroundColor: '#7c1526',
                                            width: '90%',
                                            height: '100%',
                                            borderRadius: 20,
                                        }}
                                    />
                                </View>
                                )}
                                <FastImage
                                    style={{
                                        flex: 1, 
                                        zIndex: 10, 
                                        borderRadius: this.props.imageRadius
                                    }}
                                    source={{uri: row.thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{width: 10*factorHorizontal}}/>
                        <View style={{flex: 1.5, justifyContent: 'center'}}>
                            <Text
                                style={{
                                    fontSize: 15*factorRatio,
                                    textAlign: 'left',
                                    fontWeight: 'bold',
                                    fontFamily: 'OpenSans-Regular',
                                    color: 'white',
                                }}
                            >
                                {row.title}
                            </Text>
                            <View style={{height: 2*factorVertical}}/>
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >
                                {this.props.showLength && (
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontSize: 12*factorRatio,
                                        color: colors.secondBackground,
                                        textAlign: 'left',
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                >
                                    {Math.floor(row.duration/60)} {(Math.floor(row.duration/60) == 1) ? 'min' : 'mins'} 
                                </Text>
                                )}
                                {this.props.showType && (
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontSize: 12*factorRatio,
                                        color: colors.secondBackground,
                                        textAlign: 'left',
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                >
                                    {this.capitalize(row.type)} / 
                                </Text>
                                )}
                                {this.props.showArtist && (
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        fontSize: 12*factorRatio,
                                        color: colors.secondBackground,
                                        textAlign: 'left',
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                > {row.artist}
                                </Text>
                                )}
                            </View>
                        </View>
                        <View style={{flex: 0.5}}>
                            {(this.props.showPlus == null) && (
                            <TouchableOpacity 
                                onPress={() => {
                                    (this.props.type == 'MYLIST') ?
                                    this.removeFromMyList(row.id)
                                    :
                                    this.addToMyList(row.id)
                                }}
                                style={[styles.centerContent, {flex: 1}]}
                            >
                                {(this.props.type !== 'MYLIST') && (
                                <AntIcon
                                    name={'plus'} 
                                    size={30*factorRatio} 
                                    color={colors.pianoteRed}
                                />
                                )}
                                {(this.props.type == 'MYLIST') && (
                                <AntIcon
                                    name={'close'} 
                                    size={30*factorRatio} 
                                    color={colors.pianoteRed}
                                />
                                )}
                            </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    )}
                    {(index == 0 && this.props.showNextVideo == true) && (
                    <View
                        style={{
                            height: (this.props.showNextVideo && index == 0) ? this.props.containerHeight : 
                                this.props.containerHeight + 50*factorVertical,
                            width: this.props.containerWidth,
                            flexDirection:'row',
                            paddingLeft: 10*factorHorizontal,
                            backgroundColor: '#FFF1F2',
                        }}
                    >
                        <View 
                            style={{
                                position: 'absolute',
                                top: 22.5*factorVertical, 
                                left: 10*factorHorizontal,
                                width: fullWidth*0.5,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12*factorRatio,
                                    fontWeight: '700',
                                }}
                                numberOfLines={1}
                            >
                                YOUR NEXT LESSON
                            </Text>
                        </View>
                        <View 
                            style={{
                                position: 'absolute',
                                top: 25*factorVertical, 
                                right: 15*factorHorizontal,
                                width: fullWidth*0.2,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12*factorRatio,
                                    fontWeight: '300',
                                    color: 'red',
                                    textAlign: 'right',
                                }}
                                numberOfLines={1}
                            >
                                LESSON 7
                            </Text>
                        </View>              
                        <TouchableOpacity 
                            onLongPress={() => {
                                this.setState({
                                    showModal: true,
                                    item: row,
                                })
                            }}
                            onPress={() => {
                                this.props.navigation.navigate('VIDEOPLAYER')
                            }}
                            style={{justifyContent: 'center'}}
                            underlayColor={'transparent'}    
                        >
                            <View style={{flex: 2}}/>
                            <View
                                style={{
                                    width: this.props.imageWidth,
                                    height: this.props.imageHeight,
                                    borderRadius: this.props.imageRadius,
                                    borderColor: '#ececec',
                                    borderWidth: this.props.containerBorderWidth,
                                }}
                            >
                                <View
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                        zIndex: 4,
                                        opacity: 0.3,
                                        backgroundColor: (row.progress == 'check' || 
                                            row.progress == 'progress') ? '#ff3333':'transparent',
                                    }]}
                                >
                                </View>
                                <View
                                    style={[
                                        styles.centerContent, {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: this.props.imageWidth,
                                        height: this.props.imageHeight,
                                        borderRadius: this.props.imageRadius,
                                        zIndex: 4,
                                        opacity: 1,
                                        backgroundColor: 'transparent',
                                    }]}
                                >
                                    {(row.progress == 'check' || row.progress == 'progress') && (
                                    <ApprovedTeacher
                                        height={50}
                                        width={50*factorRatio}
                                        fill={'white'}
                                    />
                                    )}
                                </View>
                                <FastImage
                                    style={{flex: 1, borderRadius: this.props.imageRadius}}
                                    source={{uri: row.thumbnail}}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                            <View style={{flex: 1}}/>
                        </TouchableOpacity>
                        <View style={{width: 10*factorHorizontal}}/>
                        <View style={{flex: 1.5, justifyContent: 'center'}}>
                            <View style={{flex: 1.66}}/>
                            <View style={{flex: 1}}>
                                <Text
                                    style={{
                                        fontSize: 15*factorRatio,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {row.title}
                                </Text>
                                <View style={{height: 2*factorVertical}}/>
                                <Text
                                numberOfLines={2}
                                style={{
                                    fontSize: 12*factorRatio,
                                    color: '#9b9b9b',
                                    textAlign: 'left',
                                    fontWeight: '500',
                                }}
                            >
                                {Math.floor(row.duration/60)} mins
                            </Text>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View style={{flex: 0.5}}>
                            <View style={{flex: 1.66}}/>
                            <View style={{flex: 1}}>
                                {(this.props.showPlus == null) && (
                                <TouchableOpacity
                                    onPress={() => {
                                        this.addToMyList(row.id)
                                    }}
                                    style={[styles.centerContent, {flex: 1}]}
                                >
                                    <AntIcon
                                        name={'plus'} 
                                        size={30*factorRatio} 
                                        color={'#c2c2c2'}
                                    />
                                </TouchableOpacity>
                                )}
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                    )}
                </View>
            )
        })
    }

    
    render = () => {
        return (
            <View style={styles.container}>
                <View>
                    <View style={{height: 5*factorVertical}}/>
                    {this.props.showFilter && (
                    <View style={{flexDirection: 'row'}}>
                        <View style={{paddingLeft: 10*factorHorizontal}}>
                            <Text
                                style={{
                                    fontSize: 18*factorRatio,
                                    marginBottom: 5*factorVertical,
                                    textAlign: 'left',
                                    fontFamily: 'RobotoCondensed-Bold',
                                    color: colors.secondBackground,
                                }}
                            >
                                {this.props.title}
                            </Text>
                        </View>
                        <View style={{flex: 1}}/>
                        {!this.props.showTitleOnly && (
                        <View 
                            style={{
                                paddingRight: 10*factorHorizontal,
                                flexDirection: 'row',
                            }}
                        >
                            {this.props.showSort && (
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.setState({
                                        showRelevance: !this.state.showRelevance,
                                    })
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <Text
                                    style={{
                                        color: colors.pianoteRed,
                                        fontSize: 12*factorRatio,
                                        fontFamily: 'OpenSans-Regular',
                                    }}
                                >
                                    RELEVANCE
                                </Text>
                                <View style={{width: 5*factorHorizontal}}/>
                                <View>
                                    <FontIcon
                                        size={14*factorRatio}
                                        name={'sort-amount-down'}
                                        color={colors.pianoteRed}
                                    />
                                </View>
                                <View style={{flex: 1}}/>
                            </TouchableOpacity>
                            )}
                            <View style={{width: 10*factorHorizontal}}/>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.filterResults()
                                }}
                                style={[
                                    styles.centerContent, {
                                    borderWidth: 1.5*factorRatio,
                                    borderColor: colors.pianoteRed,
                                    paddingBottom: 5*factorRatio,
                                    paddingTop: 5*factorRatio,
                                    paddingRight: 7.5*factorRatio,
                                    paddingLeft: 7.5*factorRatio,
                                    borderRadius: 20*factorRatio,
                                }]}
                            >
                                <View style={{flex: 1}}/>
                                <View style={{transform: [{rotate: '90deg'}]}}>
                                    <IonIcon 
                                        size={14*factorRatio}
                                        name={'md-options'}
                                        color={colors.pianoteRed}
                                    />
                                </View>
                                <View style={{flex: 1}}/>
                            </TouchableOpacity>
                            <View style={{width: 5*factorHorizontal}}/>
                        </View>
                        )}
                    </View>
                    )}
                    {!this.props.showTitleOnly && this.props.showFilter && (
                    <View>
                        {(this.props.filters !== null) && (
                        <View
                            style={{
                                paddingLeft: 10*factorHorizontal,
                                paddingRight: 10*factorHorizontal,
                                paddingTop: 5*factorVertical,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 12*factorRatio,
                                    marginBottom: 5*factorVertical,
                                    textAlign: 'left',
                                    fontFamily: 'OpenSans-Regular',
                                    color: colors.secondBackground,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 12*factorRatio,
                                        marginBottom: 5*factorVertical,
                                        textAlign: 'left', 
                                        fontWeight: (Platform.OS == 'ios') ? '900' : 'bold', 
                                        fontFamily: 'OpenSans-Regular',
                                        color: colors.secondBackground,
                                    }}
                                >FILTERS APPLIED </Text>
                                {this.stringifyFilters()}
                            </Text>
                        </View>
                        )}
                    </View>
                    )}
                    <View style={{height: 5*factorVertical}}/>
                </View>
                <View style={[styles.centerContent, {flex: 1}]}>
                    {
                        (this.props.renderType == 'Mapped') ? this.renderMappedList() : null
                    }
                </View>
                <Modal key={'modal'}
                    isVisible={this.state.showModal}
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
                    hasBackdrop={true}
                >
                    <TheFourPillars
                        data={this.state.item}
                        hideTheFourPillars={() => {
                            this.setState({
                                showModal: false
                            })
                        }}
                    />
                </Modal>
                <Modal key={'modalRelevance'}
                    isVisible={this.state.showRelevance}
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
                    <Relevance
                        hideRelevance={() => {
                            this.setState({showRelevance: false})
                        }}
                        currentSort={this.props.currentSort}
                        changeSort={(sort) => {
                            this.props.changeSort(sort)
                        }}
                    />
                </Modal>
            </View>
        )
    }
}

export default withNavigation(VerticalVideoList);