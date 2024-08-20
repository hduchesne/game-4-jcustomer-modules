import React, {useEffect, useRef, useState} from 'react';
import * as PropTypes from 'prop-types';


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
            // const onLoadCallback = window.digitalData._webapp ?
            //     {
            //         priority:5,
            //         name:"Set cxs to CxsCtx",
            //         execute: callBack.current
            //     } :
            //     callBack.current;
            const onLoadCallback = {
                    priority:5,
                    name:"Set cxs to CxsCtx",
                    execute: callBack.current
                }

            window.digitalData.loadCallbacks.push(onLoadCallback);
        }

        return () => {
            if (typeof window !== 'undefined' && window.digitalData) {
                // const index = window.digitalData._webapp ?
                //     window.digitalData.loadCallbacks.findIndex( ({execute}) =>  execute === callBack) :
                    // window.digitalData.loadCallbacks.indexOf(callBack);
                const index = window.digitalData.loadCallbacks.findIndex( ({execute}) =>  execute === callBack);
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
