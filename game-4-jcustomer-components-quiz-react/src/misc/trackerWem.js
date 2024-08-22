import {useTracker as unomiTracker} from "apache-unomi-tracker";

export const syncTracker = () => {
    //needed for isCrawler
    window.Buffer = window.Buffer || require("buffer").Buffer;

    const wem = {
        ...unomiTracker(),
        init: function () {

            const {
                contextServerUrl,
                trackerSessionIdCookieName = 'wem-session-id'
            } = window.digitalData.wemInitConfig;

            wem.contextServerUrl = contextServerUrl;

            if (wem.getCookie(trackerSessionIdCookieName) == null) {
                wem.setCookie(trackerSessionIdCookieName, wem.generateGuid());
            }

            wem.initTracker(window.digitalData);

            wem._registerCallback(() => {
                window.cxs = wem.getLoadedContext();
            }, 'Unomi tracker context loaded', 5);

            //Load page view event
            const pageViewEvent = wem.buildEvent(
                'view',
                wem.buildTargetPage(),
                wem.buildSource(window.digitalData.site.siteInfo.siteID, 'site')
            );
            wem._registerEvent(pageViewEvent, true);

            wem.startTracker();
            wem.loadContext();
        }
    }
    wem.init();
    return wem;
};

export const syncVideoStatus = ({quiz,parentId,status,player,video}) =>{
    const  event = window.wem.buildEvent("clickPlayer",
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
    // const flattenedPropertyName = `flattenedProperties.${propertyName}`;
    const eventPropertyName = `properties.${propertyName}`;

    const  event = window.wem.buildEvent("updateQuizVisitorData",
        window.wem.buildTarget(propertyName,"user-property"),
        window.wem.buildSource(qna.id,qna.type,{
            qna
        }));

    event.properties = {
        update : {
            [eventPropertyName]:propertyValue
        }
    }
    window.wem.collectEvent(event);
}

export const syncQuizScore = ({quiz,score}) => {
    const propertyName = `quiz-score-${quiz.quizKey}`;
    const eventPropertyName = `properties.${propertyName}`;
    const {quizKey:key, title, subtitle} = quiz;

    const  event = window.wem.buildEvent("setQuizScore",
        window.wem.buildTarget(propertyName,"user-property"),
        window.wem.buildSource(quiz.id,quiz.type,{
            quiz:{
                title,
                subtitle,
                key
            }
        }));

    event.properties = {
        update : {
            [eventPropertyName]:score
        }
    }
    window.wem.collectEvent(event);
}
