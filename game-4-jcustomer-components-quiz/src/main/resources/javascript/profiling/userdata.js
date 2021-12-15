const USER_DATA_KEY = "wemUserData";

//this loads the profile from unomi
const loadProfile = (completed) => {
    if(window.cxs === undefined) return;

    const url = window.digitalData.contextServerPublicUrl + '/context.json?sessionId=' + window.cxs.sessionId;
    const payload = {
        source: {
            itemId: window.digitalData.page.pageInfo.pageID,
            itemType:"page",
            scope: window.digitalData.scope
        },
        requiredProfileProperties:["*"],
        requiredSessionProperties:["*"],
        requireSegments:true
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': "application/json",
            'Content-Type': "text/plain;charset=UTF-8"
        },
        body: JSON.stringify(payload)
    })
        .then((response) => response.json())
        .then((data) => {
            if(completed)
                completed(data);

            //add the user data to window
            window[USER_DATA_KEY]=data;

            //notify any subscribers that the patient data has been loaded
            const elemt = document.getElementById("quiz-score-loaded-subscriber");
            elemt.dispatchEvent(new CustomEvent('quizDataLoaded', { bubbles: true, data }))
            // $(".profile-loaded-subscriber").trigger("profileLoaded", data);
        });
}

(function(){
    const interval = setInterval(loadProfile, 500, (data) => {
        clearInterval(interval);
    });
})();
