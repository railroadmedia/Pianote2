import React from 'react';
import Orientation from 'react-native-orientation-locker';

export const OrientationContext = React.createContext({
  isLandscape: false,
  orientation: ''
});

export default class OrientationProvider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLandscape: null,
      orientation: ''
    };
  }

  componentDidMount() {
    Orientation.getDeviceOrientation(this.orientationListener);
    Orientation.addDeviceOrientationListener(this.orientationListener);
  }

  componentWillUnmount() {
    Orientation.removeDeviceOrientationListener(this.orientationListener);
  }

  orientationListener = o =>
    this.setState({ isLandscape: o.includes('LAND'), orientation: o });

  render() {
    return this.state.isLandscape === null ? (
      <></>
    ) : (
      <OrientationContext.Provider value={this.state}>
        {this.props.children}
      </OrientationContext.Provider>
    );
  }
}
