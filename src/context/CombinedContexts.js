import React from 'react';

import { NetworkContext } from './NetworkProvider';
import { OrientationContext } from './OrientationProvider';

export const Contexts = React.createContext({});

const CombinedContexts = props => (
  <NetworkContext.Consumer>
    {networkContext => (
      <OrientationContext.Consumer>
        {orientationContext => (
          <Contexts.Provider
            value={{ ...networkContext, ...orientationContext }}
          >
            {props.children}
          </Contexts.Provider>
        )}
      </OrientationContext.Consumer>
    )}
  </NetworkContext.Consumer>
);

export default CombinedContexts;
