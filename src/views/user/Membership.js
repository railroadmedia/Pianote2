/**
 * Membership
 */
import React from 'react';
import { View } from 'react-native';
import XpRank from '../../modals/XpRank';
import QuickTips from '../../modals/QuickTips.js';
import RestartCourse from '../../modals/RestartCourse.js';
import LessonComplete from '../../modals/LessonComplete.js';
import TheFourPillars from '../../modals/TheFourPillars.js';
import ChooseYourLevel from '../../modals/ChooseYourLevel.js';
import ChooseInstructors from '../../modals/ChooseInstructors.js';
import ReplyNotification from '../../modals/ReplyNotification.js';
import AssignmentComplete from '../../modals/AssignmentComplete.js';

export default class Membership extends React.Component {
    static navigationOptions = {header: null};
    constructor(props) {
        super(props);
        this.state = {
            showChooseInstructors: false,
            showQuickTips: false,
            showRestartCourse: false,
            showChooseYourLevel: false,
            showTheFourPillars: false,
            showAssignmentComplete: false,
            showLessonComplete: false,
            showXpRank: false,
            showReplyNotification: true,
        }
    }


    render() {
        return (
            <View 
                styles={{
                    width: fullWidth,
                    height: fullHeight,
                    backgroundColor: 'black',
                    alignSelf: 'stretch',
                }}
            >
                {this.state.showReplyNotification && (
                <ReplyNotification
                    hideReplyNotification={() => {
                        this.setState({showReplyNotification: false})
                    }}
                />
                )}

                {this.state.showXpRank && (
                <XpRank
                    hideXpRank={() => {
                        this.setState({showXpRank: false})
                    }}
                />
                )}
                {this.state.showChooseInstructors && (
                <ChooseInstructors
                    hideChooseInstructors={() => {
                        this.setState({showChooseInstructors: false})
                    }}
                />
                )}
                {this.state.showAssignmentComplete && (
                <AssignmentComplete
                    hideAssignmentComplete={() => {
                        this.setState({showAssignmentComplete: false})
                    }}
                />
                )}
                {this.state.showTheFourPillars && (
                <TheFourPillars
                    hideTheFourPillars={() => {
                        this.setState({showTheFourPillars: false})
                    }}
                />
                )}
                {this.state.showChooseYourLevel && (
                <ChooseYourLevel
                    hideChooseYourLevel={() => {
                        this.setState({showChooseYourLevel: false})
                    }}
                />
                )}
                {this.state.showLessonComplete && (
                <LessonComplete
                    hideLessonComplete={() => {
                        this.setState({showLessonComplete: false})
                    }}
                />
                )}
                {this.state.showRestartCourse && (
                <RestartCourse
                    hideRestartCourse={() => {
                        this.setState({showRestartCourse: false})
                    }}
                />
                )}
                {this.state.showQuickTips && (
                <QuickTips
                    hideQuickTips={() => {
                        this.setState({showQuickTips: false})
                    }}
                />
                )}
            </View>
        )
    }
}