/**
 * StudentFocusCatalog
 */
import React from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class StudentFocusCatalog extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            progressStudentFocus: [], // videos
            isLoadingProgress: true,
            outVideos: false, // if no more videos to load
            page: 0, // current page
            lessonsStarted: false,
        }
    }


    componentDidMount = async () => {
        email = await AsyncStorage.getItem('email')

        await fetch('http://3.17.144.93:5000/accountDetails', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
            })
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    lessonsStarted: (response.lessonsStarted == 1) ? true : false,
                })
            })
            .catch((error) => {
                console.log('API Error: ', error)
            })           
        await this.getProgressStudentFocus()
    }


    async getProgressStudentFocus() {
        const { response, error } = await getContent({
            brand: 'pianote',
            limit: '15',
            page: 1,
            sort: '-created_on',
            statuses: ['published'],
            required_user_states: ['started'],
            included_types: ['course'],
        });

        const newContent = response.data.data.map((data) => {
            return new ContentModel(data)
        })

        items = []
        for(i in newContent) {
            if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                items.push({
                    title: newContent[i].getField('title'),
                    artist: newContent[i].getField('instructor').fields[0].value,
                    thumbnail: newContent[i].getData('thumbnail_url'),
                    type: newContent[i].post.type,
                    description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                    xp: newContent[i].post.xp,
                    id: newContent[i].id,
                    like_count: newContent[i].likeCount,
                    duration: this.getDuration(newContent[i]),
                    isLiked: newContent[i].isLiked,
                    isAddedToList: newContent[i].isAddedToList,
                    isStarted: newContent[i].isStarted,
                    isCompleted: newContent[i].isCompleted,
                    bundle_count: newContent[i].post.bundle_count,
                    progress_percent: newContent[i].post.progress_percent,
                })
            }
        }

        this.setState({
            progressStudentFocus: [...this.state.progressStudentFocus, ...items],
            isLoadingProgress: false,
            isStarted: (response.data.data.length > 0) ? true : false,
        })        
    }

    
    getDuration = (newContent) => {
        if(newContent.post.fields[0].key == 'video') {
            return newContent.post.fields[0].value.fields[1].value
        } else if(newContent.post.fields[1].key == 'video') {
            return newContent.post.fields[1].value.fields[1].value
        } else if(newContent.post.fields[2].key == 'video') {
            return newContent.post.fields[2].value.fields[1].value
        }
    }    


    render() {
        return (
            <View styles={styles.container}>
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight*0.90625 - navHeight,
                        alignSelf: 'stretch',
                    }}
                >
                    <View
                        style={{
                            height: fullHeight*0.1,
                            width: fullWidth,
                            position: 'absolute',
                            zIndex: 2, 
                            elevation: 2,
                            alignSelf: 'stretch', 
                        }}
                    >
                        <NavMenuHeaders
                            currentPage={'LESSONS'}
                            parentPage={'STUDENT FOCUS'}
                        />
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: colors.mainBackground}}
                    >
                        <View key={'header'}
                            style={{
                                height: fullHeight*0.1,
                                backgroundColor: colors.thirdBackground,
                            }}
                        />
                        <View key={'backgroundColoring'}
                            style={{
                                backgroundColor: colors.thirdBackground,
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                                elevation: 10,
                            }}
                        >
                        </View>
                        <View style={{height: 20*factorVertical}}/>
                        <Text
                            style={{
                                paddingLeft: 12*factorHorizontal,
                                fontSize: 30*factorRatio,
                                color: 'white',
                                fontFamily: 'OpenSans-Regular',
                                fontWeight: (Platform.OS == 'ios') ? '900' : 'bold',
                            }}
                        >
                            Student Focus
                        </Text>
                        <View style={{height: 15*factorVertical}}/>
                        {(this.state.isStarted) && (
                        <View key={'continueCourses'}
                            style={{
                                minHeight: fullHeight*0.305,
                                paddingLeft: fullWidth*0.035,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'CONTINUE'}
                                seeAll={() => this.props.navigation.navigate('SEEALL', {title: 'Continue'})}
                                seeAll={() => this.props.navigation.navigate('SEEALL', {
                                    title: 'Continue',
                                    parent: 'Student Focus',
                                })}
                                showArtist={true}
                                isLoading={this.state.isLoadingProgress}
                                showType={true}
                                items={this.state.progressStudentFocus}
                                itemWidth={isNotch ? fullWidth*0.6 : (onTablet ? fullWidth*0.425 : fullWidth*0.55)}
                                itemHeight={isNotch ? fullHeight*0.155 : fullHeight*0.175}
                            />
                        </View>
                        )}

                        <View key={'pack'}
                            style={{
                                height: fullWidth*0.45*2+fullWidth*0.033,
                                width: fullWidth,
                                justifyContent: 'space-around',
                                alignContent: 'space-around',
                            }}
                        >
                            <View key={'Q&A'}
                                style={{
                                    borderRadius: 12.5*factorRatio,
                                    position: 'absolute',
                                    top: 0,
                                    right: fullWidth*0.035,
                                    height: fullWidth*0.45,
                                    width: fullWidth*0.45,
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                            {'pack' : 'Q&A'}
                                        )
                                    }}
                                    style={{
                                        height: fullWidth*0.45,
                                        width: fullWidth*0.45,
                                        zIndex: 10,
                                        elevation: 10,
                                    }}
                                >
                                    <FastImage
                                        style={{flex: 1, borderRadius: 10*factorRatio}}
                                        source={require('Pianote2/src/assets/img/imgs/questionAnswer.jpg')}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />  
                                </TouchableOpacity>
                            </View>
                            <View key={'bootcamps'}
                                style={{
                                    borderRadius: 12.5*factorRatio,
                                    position: 'absolute',
                                    top: 0,
                                    left: fullWidth*0.035,
                                    height: fullWidth*0.45,
                                    width: fullWidth*0.45
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                            {'pack' : 'Bootcamps'}
                                        )
                                    }}
                                    style={{
                                        height: fullWidth*0.45,
                                        width: fullWidth*0.45,
                                    }}
                                >
                                    <FastImage
                                        style={{flex: 1, borderRadius: 10*factorRatio}}
                                        source={require('Pianote2/src/assets/img/imgs/bootcamps.jpg')}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />   
                                </TouchableOpacity>
                            </View>
                            <View key={'studentReviews'}
                                style={{
                                    borderRadius: 12.5*factorRatio,
                                    position: 'absolute',
                                    bottom: 0,
                                    right: fullWidth*0.035,
                                    height: fullWidth*0.45,
                                    width: fullWidth*0.45
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                            {'pack' : 'Student Review'}
                                        )
                                    }}
                                    style={{
                                        height: fullWidth*0.45,
                                        width: fullWidth*0.45,
                                    }}
                                >
                                    <FastImage
                                        style={{flex: 1, borderRadius: 10*factorRatio}}
                                        source={require('Pianote2/src/assets/img/imgs/studentReview.jpg')}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />   
                                </TouchableOpacity>
                            </View>
                            <View key={'quicktips'}
                                style={{
                                    borderRadius: 12.5*factorRatio,
                                    position: 'absolute',
                                    bottom: 0,
                                    left: fullWidth*0.035,
                                    height: fullWidth*0.45,
                                    width: fullWidth*0.45
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.navigation.navigate('STUDENTFOCUSSHOW', 
                                            {'pack' : 'Quick Tips'}
                                        )
                                    }}
                                    style={{
                                        height: fullWidth*0.45,
                                        width: fullWidth*0.45,
                                    }}
                                >
                                    <FastImage
                                        style={{flex: 1, borderRadius: 10*factorRatio}}
                                        source={require('Pianote2/src/assets/img/imgs/quickTips.jpg')}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />   
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{height: 15*factorVertical}}/>                  
                    </ScrollView>
                </View>                
                <NavigationBar
                    currentPage={''}
                />
                <Modal key={'navMenu'}
                    isVisible={this.state.showModalMenu}
                    style={{
                        margin: 0, 
                        height: fullHeight,
                        width: fullWidth,
                    }}
                    animation={'slideInUp'}
                    animationInTiming={250}
                    animationOutTiming={250}
                    coverScreen={true}
                    hasBackdrop={false}
                >
                    <NavigationMenu
                        onClose={(e) => this.setState({showModalMenu: e})}
                        menu={this.state.menu}
                        parentPage={this.state.parentPage}
                    />
                </Modal>
            </View>
        )
    }
}