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
            trackerSessionIdCookieName: "context-session-id",//"unomi-tracker-session-id",
            trackerProfileIdCookieName: "context-profile-id"//"unomi-tracker-profile-id"
        }
    };

    unomiWebTracker.initTracker(config);

    if (unomiWebTracker.getCookie(config.wemInitConfig.trackerSessionIdCookieName) == null) {
        unomiWebTracker.setCookie(config.wemInitConfig.trackerSessionIdCookieName, unomiWebTracker.generateGuid(), 1);
    }
    if (unomiWebTracker.getCookie(config.wemInitConfig.trackerProfileIdCookieName) == null) {
        unomiWebTracker.setCookie(config.wemInitConfig.trackerProfileIdCookieName, unomiWebTracker.generateGuid(), 1);
    }

    unomiWebTracker._registerCallback(() => {
        // console.log("Unomi tracker successfully loaded context", unomiWebTracker.getLoadedContext());
        window.cxs = unomiWebTracker.getLoadedContext();
    }, 'Unomi tracker context loaded');

    unomiWebTracker.startTracker();

    const viewEvent = unomiWebTracker.buildEvent(
        'view',
        unomiWebTracker.buildTargetPage(),
        unomiWebTracker.buildSource(config.site.siteInfo.siteID, 'site')
    );
    unomiWebTracker._registerEvent(viewEvent, true);

    unomiWebTracker.loadContext();

    return unomiWebTracker;
};


export const syncVideoStatus = ({quiz,parentId,status,player,video}) =>{
    const  event = window.wem.buildEvent("click",
        window.wem.buildTarget(video.id,"react-video-player",{
            video:{
                ...video,
                duration: player.current.getDuration(),
                currentTime: player.current.getCurrentTime(),
                status: status
            }
        }),
        window.wem.buildSource(quiz.id,quiz.type,{
            quiz,
            warmup:{
                id:parentId
            },

        }));

    window.wem.collectEvent(event);
}

export const syncVisitorData = ({qna,propertyName,propertyValue}) =>{
    const  event = window.wem.buildEvent("updateQuizVisitorData",
        window.wem.buildTarget(propertyName,"user-property"),
        window.wem.buildSource(qna.id,qna.type,{
            qna
        }));

    event.properties = {
        update : {
            [propertyName]:propertyValue
        }
    }
    window.wem.collectEvent(event);
}
