/**
 * CourseCatalog
 */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { getContent } from '@musora/services';
import { ContentModel } from '@musora/models';
import FastImage from 'react-native-fast-image';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Topic from 'Pianote2/src/assets/img/svgs/topics.svg';
import Levels from 'Pianote2/src/assets/img/svgs/levels.svg';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import Progress from 'Pianote2/src/assets/img/svgs/progress.svg';
import Graduation from 'Pianote2/src/assets/img/svgs/courses.svg';
import NavigationBar from 'Pianote2/src/components/NavigationBar.js';
import NavigationMenu from 'Pianote2/src/components/NavigationMenu.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import FilterIcon from 'Pianote2/src/assets/img/svgs/filters-selected.svg';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';

export default class CourseCatalog extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            filterClicked: false, // clicked red button center bottom of image
            outVideos: false, // if no more videos to load
            showChooseInstructors: false,
            showChooseYourLevel: false,
            items: [], // videos loaded
            page: 0, // current page
            levelChosen: false,
            instructorChosen: false,
            topicChosen: false,
            progressChosen: false,
            circle1: false, 
            circle2: false,
            circle3: false,
            circle4: false,
            circle5: false,
            circle6: false,
            circle7: false,
            circle8: false,
            circle9: false,
            circle10: false,
            lisa: false, 
            cassi: false,
            jordan: false,
            nate: false,
            brett: false,
            jonny: false,
            jay: false, 
            kenny: false,
            parentPage: 'LESSONS',
            menu: 'COURSES',
        }
    }


    componentDidMount() {
        this.getContent()
    }


    async getContent() {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand:'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['song'],
            });
            
            if(response.data.data.length == 0) {
                this.setState({outVideos: true})
            }

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                    items.push({
                        title: newContent[i].getField('title'),
                        artist: newContent[i].getField('artist'),
                        thumbnail: newContent[i].getData('thumbnail_url'),
                    })
                }
            }

            this.setState({
                items: [...this.state.items, ...items],
                page: this.state.page + 1,
            })

        }
    }


    whatFilter() {
        if( this.state.filterClicked == false && (
            this.state.levelChosen == true ||
            this.state.instructorChosen == true ||
            this.state.topicChosen == true ||
            this.state.progressChosen == true
        )) {
            return <View style={styles.centerContent}>
                <View style={{flex: 1}}/>
                    <TouchableOpacity
                        onPress={() => this.setState({filterClicked: !this.state.filterClicked})}
                        style={[
                            styles.centerContent, {
                            borderWidth: 2*factorRatio,
                            height: 42.5*factorRatio,
                            width: 42.5*factorRatio,
                            flexDirection: 'row',
                            borderColor: 'red',
                            backgroundColor: 'red',
                            borderRadius: 200,
                        }]}
                    >
                        <View
                            style={[
                                styles.centerContent, {
                                position: 'absolute',
                                zIndex: 5,
                                height: 42.5*factorRatio,
                                width: 42.5*factorRatio,
                                borderRadius: 200,
                                transform: [{rotate: '90deg'}],
                            }]}
                        >
                            <IonIcon 
                                size={22.5*factorRatio}
                                name={'md-options'}
                                color={'white'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
        
        } else if(
            this.state.filterClicked == false && 
            this.state.levelChosen == false &&
            this.state.instructorChosen == false &&
            this.state.topicChosen == false &&
            this.state.progressChosen == false
        ) {
            return <View style={styles.centerContent}>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity
                        onPress={() => this.setState({filterClicked: !this.state.filterClicked})}
                        style={[
                            styles.centerContent, {
                            borderWidth: 2*factorRatio,
                            height: 42.5*factorRatio,
                            width: 42.5*factorRatio,
                            flexDirection: 'row',
                            borderColor: 'red',
                            borderRadius: 200,
                        }]}
                    >
                        <FilterIcon
                            fill={(
                                this.state.levelChosen == true ||
                                this.state.instructorChosen == true ||
                                this.state.topicChosen == true ||
                                this.state.progressChosen == true
                                ) ? 'red' : 'transparent'
                            }
                            height={42.5*factorRatio}
                            width={42.5*factorRatio}
                        />
                        <View
                            style={[
                                styles.centerContent, {
                                position: 'absolute',
                                zIndex: 5,
                                height: 42.5*factorRatio,
                                width: 42.5*factorRatio,
                                borderRadius: 200,
                                transform: [{rotate: '90deg'}],
                            }]}
                        >
                            <IonIcon 
                                size={22.5*factorRatio}
                                name={'md-options'}
                                color={(
                                    this.state.showFilters
                                ) ? 'white' : 'red'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
        } else {
            return <View style={styles.centerContent}>
                <View style={{flex: 1}}/>
                <TouchableOpacity
                    onPress={() => this.setState({filterClicked: !this.state.filterClicked})}
                    style={[
                        styles.centerContent, {
                        height: 42.5*factorRatio,
                        width: 42.5*factorRatio,
                        flexDirection: 'row',
                    }]}
                >
                    <FilterIcon
                        fill={'red'}
                        height={'102.5%'}
                        width={'102.%'}
                    />
                    <View
                        style={[
                            styles.centerContent, {
                            position: 'absolute',
                            zIndex: 5,
                            height: 42.5*factorRatio,
                            width: 42.5*factorRatio,
                            transform: [{rotate: '90deg'}],
                        }]}
                    >
                        <IonIcon 
                            size={22.5*factorRatio}
                            name={'md-options'}
                            color={'white'}
                        />
                    </View>
                </TouchableOpacity>
            </View>                 
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
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, }}
                    >
                        <View key={'backgroundColoringIOS'}
                            style={{
                                backgroundColor: 'black',
                                position: 'absolute',
                                height: fullHeight,
                                top: -fullHeight,
                                left: 0,
                                right: 0,
                                zIndex: 10,
                            }}
                        >
                        </View>
                        <View key={'filtericon'}
                            style={{
                                position: 'absolute',
                                top: (onTablet) ? fullHeight*0.315 : fullHeight*0.275,
                                flexDirection: 'row',
                                width: fullWidth,
                                zIndex: 2,
                                elevation: 2,
                            }}
                        >
                            <View style={{flex: 1}}/>
                            {this.whatFilter()}
                            <View style={{flex: 1}}/>
                        </View>
                        <View key={'image'}
                            style={{
                                height: (onTablet) ? fullHeight*0.425 : fullHeight*0.375,
                                width: fullWidth,
                                elevation: 2,
                                backgroundColor: 'transparent',
                            }}
                        >
                            <NavMenuHeaders
                                pxFromTop={navPxFromTop}
                                leftHeader={'LESSONS'}
                                pressLeftHeader={() => {
                                    this.setState({
                                        parentPage: 'LESSONS',
                                        menu: 'HOME',
                                        showModalMenu: true,
                                    })
                                }}
                                pressRightHeader={() => {
                                    this.setState({
                                        parentPage: 'COURSES',
                                        menu: 'LESSONS',
                                        showModalMenu: true,
                                    })
                                }}
                                rightHeader={'COURSES'}
                                isHome={false}
                            />
                            <View key={'courses'}
                                style={[
                                    styles.centerContent, {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    zIndex: 2,
                                    height: '100%',
                                    width: '100%',
                                    
                                }]}
                            >
                                <Graduation
                                    height={50*factorRatio}
                                    width={50*factorRatio}
                                    fill={'#fb1b2f'}
                                />
                                <Text
                                    style={{
                                        fontSize: 40*factorRatio,
                                        fontFamily: 'Roboto',
                                        fontWeight: '700',
                                        color: 'white',
                                    }}
                                >
                                    COURSES
                                </Text>
                            </View>
                            <FastImage
                                style={{flex: 1}}
                                source={require('Pianote2/src/assets/img/imgs/backgroundHands.png')}
                                resizeMode={FastImage.resizeMode.stretch}
                            />
                        </View>
                        {this.state.filterClicked && (
                        <View key={'filterOptions'} 
                            style={{
                                height: (onTablet) ? fullHeight*0.25 : fullHeight*0.2,
                                width: fullWidth,
                                paddingTop: 2.5*factorRatio,
                            }}
                        >
                            <View key={'content'}
                                style={{
                                    flex: 1,
                                }}
                            >
                                <View key={'upper'}
                                    style={{
                                        flex: 0.5,
                                        flexDirection: 'row',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    <View key={'level'}
                                        style={{flex: 1}}
                                    >
                                        <View 
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '90%',
                                                        width: '100%',
                                                        borderRadius: 40*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: (
                                                            this.state.levelChosen ? 
                                                                '#fb1b2f' : 'black'
                                                        ),
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                showChooseYourLevel: true
                                                            })
                                                        }}
                                                        style={[
                                                            styles.centerContent, {
                                                            height: '100%',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                        }]}
                                                    >
                                                        <Levels
                                                            height={12.5*factorRatio}
                                                            width={12.5*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}/>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'OpenSans-Regular',
                                                                fontSize: 13*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            LEVEL
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex: 1}}/>
                                        </View>
                                    </View>
                                    <View key={'instructor'}
                                        style={{flex: 1}}
                                    >
                                        <View 
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '90%',
                                                        width: '100%',
                                                        borderRadius: 35*factorRatio,
                                                        alignSelf: 'stretch',       
                                                        backgroundColor: this.state.instructorChosen ? 
                                                                '#fb1b2f' : 'black',
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                showChooseInstructors: true
                                                            })
                                                        }}
                                                        style={[
                                                            styles.centerContent, {
                                                            height: '100%',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                        }]}
                                                    >
                                                        <FontIcon
                                                            name={'user'}
                                                            size={17.5*factorRatio}
                                                            color={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}/>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'OpenSans-Regular',
                                                                fontSize: 12*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            INSTRUCTOR
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex: 1}}/>
                                        </View>
                                    </View>
                                </View>
                                <View key={'lower'}
                                    style={{
                                        flex: 0.5,
                                        flexDirection: 'row',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    <View key={'topic'}
                                        style={{flex: 1}}
                                    >
                                        <View 
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '90%',
                                                        width: '100%',
                                                        borderRadius: 35*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: this.state.topicChosen ? 
                                                                '#fb1b2f' : 'black',
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                topicChosen: !this.state.topicChosen
                                                            })
                                                        }}
                                                        style={[
                                                            styles.centerContent, {
                                                            height: '100%',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                        }]}
                                                    >
                                                        <Topic
                                                            height={18*factorRatio}
                                                            width={18*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}/>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'OpenSans-Regular',
                                                                fontSize: 13*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            TOPIC
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex: 1}}/>
                                        </View>
                                    </View>
                                    <View key={'progress'}
                                        style={{flex: 1}}
                                    >
                                        <View 
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                            }}
                                        >
                                            <View style={{flex: 1}}/>
                                            <View
                                                style={{
                                                    height: '100%',
                                                    width: '93%',
                                                    alignSelf: 'stretch',
                                                }}
                                            >
                                                <View style={{flex: 1}}/>
                                                <View
                                                    style={{
                                                        height: '90%',
                                                        width: '100%',
                                                        borderRadius: 35*factorRatio,
                                                        alignSelf: 'stretch',
                                                        backgroundColor: this.state.progressChosen ? 
                                                                '#fb1b2f' : 'black',
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            this.setState({
                                                                progressChosen: !this.state.progressChosen
                                                            })
                                                        }}
                                                        style={[
                                                            styles.centerContent, {
                                                            height: '100%',
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                        }]}
                                                    >
                                                        <Progress
                                                            height={17*factorRatio}
                                                            width={17*factorRatio}
                                                            fill={'white'}
                                                        />
                                                        <View style={{width: 5*factorHorizontal}}/>
                                                        <Text
                                                            style={{
                                                                fontFamily: 'OpenSans-Regular',
                                                                fontSize: 12.5*factorRatio,
                                                                fontWeight: '800',
                                                                color: 'white',
                                                            }}
                                                        >
                                                            PROGRESS
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={{flex: 1}}/>
                                            </View>
                                            <View style={{flex: 1}}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View key={'clear'}
                                style={{
                                    height: fullHeight*0.075,
                                    backgroundColor: 'white',
                                }}
                            >
                                <View style={{flex: 1}}/>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({
                                            filterClicked: !this.state.filterClicked,
                                            levelChosen: false,
                                            instructorChosen: false,
                                            topicChosen: false,
                                            progressChosen: false,
                                            circle1: false, 
                                            circle2: false,
                                            circle3: false,
                                            circle4: false,
                                            circle5: false,
                                            circle6: false,
                                            circle7: false,
                                            circle8: false,
                                            circle9: false,
                                            circle10: false,
                                            lisa: false, 
                                            cassi: false,
                                            jordan: false,
                                            nate: false,
                                            brett: false,
                                            jonny: false,
                                            jay: false,
                                            kenny: false,
                                        })
                                    }}
                                    style={[
                                        styles.centerContent, {
                                        flexDirection: 'row',
                                    }]}
                                >
                                    <Text
                                        style={[
                                            styles.centerContent, {
                                            fontSize: 14*factorRatio,
                                            color: 'grey',
                                            fontFamily: 'OpenSans-Regular',
                                            marginRight: 0.5,
                                            textAlign: 'center',
                                            fontWeight: '700',
                                        }]}
                                    >
                                            <Text
                                            style={[
                                                styles.centerContent, {
                                                fontSize: 14*factorRatio,
                                                color: 'grey',
                                                fontFamily: 'OpenSans-Regular',
                                                textAlign: 'right',
                                                fontWeight: '700',
                                            }]}
                                        >
                                            x </Text>
                                        CLEAR FILTERS 
                                    </Text>
                                </TouchableOpacity>
                                <View style={{flex: 1}}/>
                            </View>
                        </View>
                        )}
                        <VerticalVideoList
                            outVideos={this.state.outVideos}
                            getVideos={() => this.getContent()}
                            renderType={'Mapped'}
                            items={this.state.items}
                            imageRadius={10*factorRatio}
                            containerBorderWidth={1}
                            containerWidth={fullWidth}
                            containerHeight={(onTablet) ? fullHeight*0.15 : (
                                Platform.OS == 'android') ? fullHeight*0.115 : fullHeight*0.09}
                            imageHeight={(onTablet) ? fullHeight*0.125 : (
                                Platform.OS == 'android') ? fullHeight*0.0925 : fullHeight*0.07
                            }
                            imageWidth={fullWidth*0.26}
                        />
                    </ScrollView>
                </View>      
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
                <NavigationBar
                    currentPage={'COURSECATALOG'}
                />
            </View>
        )
    }
}