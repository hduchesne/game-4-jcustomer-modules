import {useTracker as tracker} from "apache-unomi-tracker";


export const syncTracker = () => {
    //needed for isCrawler
    window.Buffer = window.Buffer || require("buffer").Buffer;
    const unomiWebTracker = tracker();

    unomiWebTracker.initTracker(window.digitalData);

    if (window.digitalData.wemInitConfig.trackerSessionIdCookieName &&
        unomiWebTracker.getCookie(window.digitalData.wemInitConfig.trackerSessionIdCookieName) == null) {
        unomiWebTracker.setCookie(window.digitalData.wemInitConfig.trackerSessionIdCookieName, unomiWebTracker.generateGuid(), 1);
    }
    if (window.digitalData.wemInitConfig.trackerProfileIdCookieName &&
        unomiWebTracker.getCookie(window.digitalData.wemInitConfig.trackerProfileIdCookieName) == null) {
        unomiWebTracker.setCookie(window.digitalData.wemInitConfig.trackerProfileIdCookieName, unomiWebTracker.generateGuid(), 1);
    }

    unomiWebTracker._registerCallback(() => {
        window.cxs = unomiWebTracker.getLoadedContext();
    }, 'Unomi tracker context loaded');

    unomiWebTracker.startTracker();

    const viewEvent = unomiWebTracker.buildEvent(
        'view',
        unomiWebTracker.buildTargetPage(),
        unomiWebTracker.buildSource(window.digitalData.site.siteInfo.siteID, 'site')
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

export const syncQuizScore = ({quiz,score}) => {
    const propertyName = `properties.quiz-score-${quiz.quizKey}`;
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
            [propertyName]:score
        }
    }
    window.wem.collectEvent(event);
}
