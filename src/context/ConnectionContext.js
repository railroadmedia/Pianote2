import {createContext} from 'react';

const ConnectionContext = createContext({
    isConnected: true,
});

export default ConnectionContext;
