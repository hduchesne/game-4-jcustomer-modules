// const USER_DATA_KEY = "wemUserData";

//this loads the profile from unomi
const loadProfile = (completed) => {
    // if(window.cxs === undefined) return;

    const url = `${window.digitalData.contextServerPublicUrl}/context.json`;
    // const url = window.digitalData.contextServerPublicUrl + '/context.json?sessionId=' + window.cxs.sessionId;
    const payload = {
        source: {
            itemId: window.digitalData.page.pageInfo.pageID,
            itemType:"page",
            scope: window.digitalData.scope
        },
        requiredProfileProperties:["*"],
        // requiredSessionProperties:["*"],
        // requireSegments:true
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': "application/json",
            'Content-Type': "text/plain;charset=UTF-8"
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    })
        .then((response) => response.json())
        .then((data) => {
            // if(completed)
            //     completed(data);

            //add the user data to window
            // window[USER_DATA_KEY]=data;

            //notify any subscribers that the user data has been loaded
            const elemts = [...document.getElementsByClassName("quiz-score-loaded-subscriber")];
            elemts.forEach(elemt =>
                elemt.dispatchEvent(
                    new CustomEvent(
                        'quizDataLoaded',
                        {
                            bubbles: true,
                            detail:data
                        }
                    )
                )
            )
        });
}
window.addEventListener("DOMContentLoaded", (event) => {
    loadProfile();
})
