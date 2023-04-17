import React, {useEffect, useRef, useState} from 'react';
import * as PropTypes from 'prop-types';

// export type CxsType = {
//     profileId: string,
//     sessionId: string
// }

const CxsCtx = React.createContext({});

const CxsCtxProvider = ({children}) => {
    const [cxs, setCxs] = useState(null);

    const callBack = useRef(() => {
        setCxs(window.cxs);
    });
    useEffect(() => {
        if (typeof window === 'undefined') {
            // TODO Read CXS from cookies
        } else if (window.cxs) {
            setCxs(window.cxs);
        } else if (window.digitalData) {
            window.digitalData.loadCallbacks = window.digitalData.loadCallbacks || [];
            window.digitalData.loadCallbacks.push(callBack.current);
        }

        return () => {
            if (typeof window !== 'undefined' && window.digitalData) {
                const index = window.digitalData.loadCallbacks.indexOf(callBack);
                if (index !== -1) {
                    window.digitalData.loadCallbacks.splice(index, 1);
                }
            }
        };
    });
// console.log("[provider] cxs : ",cxs);
    return (
        <CxsCtx.Provider value={cxs}>
            {children}
        </CxsCtx.Provider>
    );
};

CxsCtxProvider.propTypes = {
    children: PropTypes.node
};

const {Consumer} = CxsCtx;
export {CxsCtx, CxsCtxProvider, Consumer as CxsCtxConsumer};
