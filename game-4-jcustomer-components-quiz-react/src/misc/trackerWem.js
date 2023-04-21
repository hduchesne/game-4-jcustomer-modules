import {useTracker as tracker} from "apache-unomi-tracker";


export const syncTracker = ({scope,contextServerUrl,locale,quizKey,quizPath}) => {
    //needed for isCrawler
    window.Buffer = window.Buffer || require("buffer").Buffer;

    const unomiWebTracker = tracker();
    const config = {
        scope,
        site: {
            siteInfo: {
                siteID: scope
            }
        },
        page: {
            pageInfo: {
                pageID: `WebApp Quiz`,
                pageName: document.title,
                pagePath: document.location.pathname,
                destinationURL: document.location.origin + document.location.pathname,
                language: locale,
                categories: [],
                tags: []
            },
            attributes: {
                quizPath,
                quizKey
            },
            consentTypes: []
        },
        events: [],
        wemInitConfig: {
            contextServerUrl,
            timeoutInMilliseconds: "1500",
            contextServerCookieName: "context-profile-id",
            activateWem: true,
            trackerSessionIdCookieName: "unomi-tracker-session-id",
            trackerProfileIdCookieName: "unomi-tracker-profile-id"
        }
    };

    unomiWebTracker.initTracker(config);

    if (unomiWebTracker.getCookie(config.wemInitConfig.trackerSessionIdCookieName) == null) {
        unomiWebTracker.setCookie(config.wemInitConfig.trackerSessionIdCookieName, unomiWebTracker.generateGuid(), 1);
    }

    unomiWebTracker._registerCallback(() => {
        console.log("Unomi tracker successfully loaded context", unomiWebTracker.getLoadedContext());
    }, 'Unomi tracker loaded');

    unomiWebTracker.startTracker();
    return unomiWebTracker;
};
