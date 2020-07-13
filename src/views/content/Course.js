/**
 * Course
 */
import React from 'react';
import { 
    View, 
    Text, 
    ScrollView,
    Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import { ContentModel } from '@musora/models';
import { getContent } from '@musora/services';
import RestartCourse from 'Pianote2/src/modals/RestartCourse.js';
import NavMenuHeaders from 'Pianote2/src/components/NavMenuHeaders.js';
import VerticalVideoList from 'Pianote2/src/components/VerticalVideoList.js';
import HorizontalVideoList from 'Pianote2/src/components/HorizontalVideoList.js';

export default class Course extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            progressCourses: [],
            newCourses: [],
            allCourses: [],
            showModalMenu: false, // show navigation menu
            showInfo: false,
            started: false, // if started lesson
            outVideos: false, // if no more videos
            page: 1, // page of content
            progress: 0.52,
            currentSort: 'Relevance',
            filters: null,
            filtering: false,
        }
    }


    componentDidMount = async () => {
        this.getProgressCourses()
        this.getNewCourses()
        this.getAllCourses()
    }


    getAllCourses = async () => {
        await this.setState({filtering: true})

        // see if importing filters
        try {
            var filters = this.state.filters
            if(
                filters.instructors.length !== 0 || 
                filters.level.length !== 0 || 
                filters.progress.length !== 0 || 
                filters.topics.length !== 0
            ) {
                // if has a filter then send filters to vertical list
                this.setState({filters})
            } else {
                // if no filters selected then null
                var filters = null
            }
        } catch (error) {
            var filters = null
        }

        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand:'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['song'],
            });

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                if(i > 0) {
                    if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                        items.push({
                            title: newContent[i].getField('title'),
                            artist: newContent[i].getField('instructor').fields[0].value,
                            thumbnail: newContent[i].getData('thumbnail_url'),
                            type: newContent[i].post.type,
                            description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                            xp: newContent[i].getField('xp'),
                            id: newContent[i].id,
                            likeCount: newContent[i].likeCount,
                            progress: (i < 7 && i > 1) ? 'check' : ((i == 7) ? 'progress':'none'),
                        })
                    }
                }
            }

            this.setState({
                allCourses: [...this.state.allCourses, ...items],
                page: this.state.page + 1,
                outVideos: (items.length == 0) ? true : false
            })
        }

        await this.setState({filtering: false})
    }
    

    getProgressCourses = async () => {
        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand:'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['song'],
            });

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                if(i > 0) {
                    if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                        items.push({
                            title: newContent[i].getField('title'),
                            artist: newContent[i].getField('instructor').fields[0].value,
                            thumbnail: newContent[i].getData('thumbnail_url'),
                            type: newContent[i].post.type,
                            description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                            xp: newContent[i].getField('xp'),
                            id: newContent[i].id,
                            likeCount: newContent[i].likeCount,
                            progress: (i < 7 && i > 1) ? 'check' : ((i == 7) ? 'progress':'none'),
                        })
                    }
                }
            }

            this.setState({
                progressCourses: [...this.state.progressCourses, ...items],
                page: this.state.page + 1,
                outVideos: (items.length == 0) ? true : false
            })
        }
    }


    getNewCourses = async () => {
        await this.setState({filtering: true})

        // see if importing filters
        try {
            var filters = this.state.filters
            if(
                filters.instructors.length !== 0 || 
                filters.level.length !== 0 || 
                filters.progress.length !== 0 || 
                filters.topics.length !== 0
            ) {
                // if has a filter then send filters to vertical list
                this.setState({filters})
            } else {
                // if no filters selected then null
                var filters = null
            }
        } catch (error) {
            var filters = null
        }

        if(this.state.outVideos == false) {
            const { response, error } = await getContent({
                brand:'pianote',
                limit: '15',
                page: this.state.page,
                sort: '-created_on',
                statuses: ['published'],
                included_types:['song'],
            });

            const newContent = response.data.data.map((data) => {
                return new ContentModel(data)
            })

            items = []
            for(i in newContent) {
                if(i > 0) {
                    if(newContent[i].getData('thumbnail_url') !== 'TBD') {
                        items.push({
                            title: newContent[i].getField('title'),
                            artist: newContent[i].getField('instructor').fields[0].value,
                            thumbnail: newContent[i].getData('thumbnail_url'),
                            type: newContent[i].post.type,
                            description: newContent[i].getData('description').replace(/(<([^>]+)>)/ig, ''),
                            xp: newContent[i].getField('xp'),
                            id: newContent[i].id,
                            likeCount: newContent[i].likeCount,
                            progress: (i < 7 && i > 1) ? 'check' : ((i == 7) ? 'progress':'none'),
                        })
                    }
                }
            }

            this.setState({
                newCourses: [...this.state.newCourses, ...items],
                page: this.state.page + 1,
                outVideos: (items.length == 0) ? true : false
            })
        }

        await this.setState({filtering: false})
    }


    filterResults = async () => {
        this.props.navigation.navigate('FILTERS', {
            filters: this.state.filters,
            type: 'COURSES',
            onGoBack: (filters) => {
                this.setState({
                    allCourses: [],
                    filters: (
                        filters.instructors.length == 0 && 
                        filters.level.length == 0 && 
                        filters.progress.length == 0 && 
                        filters.topics.length == 0
                    ) ? null : filters, 
                }),
                this.getAllCourses(),
                this.forceUpdate()
            }
        })
    }


    render() {
        return (
            <View styles={styles.container}>
                <View key={'container'}
                    style={{
                        height: fullHeight - navHeight, 
                        alignSelf: 'stretch',
                    }}
                >
                <View key={'contentContainer'}
                    style={{
                        height: fullHeight,
                        alignSelf: 'stretch'
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
                            parentPage={'COURSES'}
                        />
                    </View>
                    
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentInsetAdjustmentBehavior={'never'}
                        style={{flex: 1, backgroundColor: colors.mainBackground,}}
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
                            Courses
                        </Text>
                        <View style={{height: 15*factorVertical}}/>
                        <View key={'continueCourses'}
                            style={{
                                minHeight: fullHeight*0.225,
                                paddingLeft: fullWidth*0.035,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'CONTINUE'}
                                Description={''}
                                seeAll={() => this.props.navigation.navigate('SEEALL', {title: 'Continue'})}
                                showArtist={true}
                                items={this.state.progressCourses}
                                forceSquareThumbs={false}
                                itemWidth={isNotch ? fullWidth*0.575 : (onTablet ? fullWidth*0.425 : fullWidth*0.55)}
                                itemHeight={isNotch ? fullHeight*0.15 : fullHeight*0.175}
                            />
                        </View>
                        <View key={'newCourses'}
                            style={{
                                minHeight: fullHeight*0.225,
                                paddingLeft: fullWidth*0.035,
                                backgroundColor: colors.mainBackground,
                            }}
                        >
                            <HorizontalVideoList
                                Title={'NEW COURSES'}
                                Description={''}
                                seeAll={() => this.props.navigation.navigate('SEEALL', {title: 'New Courses'})}
                                showArtist={true}
                                items={this.state.newCourses}
                                forceSquareThumbs={false}
                                itemWidth={isNotch ? fullWidth*0.6 : (onTablet ? fullWidth*0.425 : fullWidth*0.55)}
                                itemHeight={isNotch ? fullHeight*0.155 : fullHeight*0.175}
                            />
                        </View>
                        
                        <View style={{height: 15*factorVertical}}/>
                        {!this.state.filtering && (
                        <VerticalVideoList
                            items={this.state.allCourses}
                            title={'COURSES'}
                            renderType={'Mapped'}
                            type={'COURSES'} // the type of content on page
                            showFilter={true}
                            showType={true} // show course / song by artist name
                            showArtist={true} // show artist name
                            showLength={false}
                            showSort={true}
                            filters={this.state.filters} // show filter list
                            imageRadius={5*factorRatio}
                            containerBorderWidth={0}
                            currentSort={this.state.currentSort} // relevance sort
                            changeSort={(currentSort) => { 
                                this.setState({
                                    currentSort,
                                    allCourses: [],
                                }),
                                this.getAllCourses()
                            }} // change sort and reload videos
                            filterResults={() => this.filterResults()} // apply from filters page
                            containerWidth={fullWidth}
                            containerHeight={(onTablet) ? fullHeight*0.15 : (Platform.OS == 'android') ?  fullHeight*0.115 : fullHeight*0.0925}
                            imageHeight={(onTablet) ? fullHeight*0.12 : (Platform.OS == 'android') ? fullHeight*0.085 :fullHeight*0.065}
                            imageWidth={fullWidth*0.26}
                            outVideos={this.state.outVideos}
                            //getVideos={() => this.getContent()}
                        />
                        )}               
                    </ScrollView>
                </View>                
                <Modal key={'restartCourse'}
                        isVisible={this.state.showRestartCourse}
                        style={[
                            styles.centerContent, {
                            height: fullHeight,
                            width: fullWidth,
                            elevation: 5,
                            margin: 0,
                        }]}
                        animation={'slideInUp'}
                        animationInTiming={350}
                        animationOutTiming={350}
                        coverScreen={false}
                        hasBackdrop={false}
                    >
                        <RestartCourse
                            hideRestartCourse={() => {
                                this.setState({
                                    showRestartCourse: false
                                })
                            }}
                        />
                    </Modal>
                </View>
            </View>
        )
    }
}