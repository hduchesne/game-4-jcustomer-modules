const _getQuizScore = ({quiz,labelBtnStart}) =>{
    const {
        key,
        scorePropertyName,
        url,
        question,
        elemtId,
        language
    }=quiz;

    const fetchURL = window.digitalData.wemInitConfig.proxyServletUrl+'/cxs/events/search';
    const payload = {
        offset : 0,
        limit : 1,
        condition : {
            type: "booleanCondition",
            parameterValues: {
                subConditions: [
                    {
                        type: "eventTypeCondition",
                        parameterValues : {
                            eventTypeId: "setQuizScore"
                        }
                    },
                    {
                        type: "eventPropertyCondition",
                        parameterValues: {
                            propertyName: "properties.quizKey",
                            comparisonOperator: "equals",
                            propertyValue: key
                        }
                    },
                    {
                        type: "eventPropertyCondition",
                        parameterValues: {
                            propertyName: "profileId",
                            comparisonOperator: "equals",
                            propertyValue: window.cxs.profileId
                        }
                    }
                ],
                operator: "and"
            }
        },
        sortby: "timeStamp:desc"
    };
    fetch(fetchURL, {
        method: 'POST',
        headers: {
            'Accept': "application/json",
            'Content-Type': "application/json;charset=UTF-8"
        },
        credentials: 'include',
        body: JSON.stringify(payload)
    }).then(
        response => response.json()
    ).then( data => {
        let templateData = {
            quizQuestion:question,
            quizURL:url,
            quizStartBtnLabel:labelBtnStart
        }
        if(data.list.length === 1){
            templateData = data.list.reduce((templateData,item) => {
                templateData.quizScore = item.properties.update[`properties.${scorePropertyName}`];
                const quizReleaseDate = new Date(item.timeStamp);
                // const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const dateOptions = {
                    year: '2-digit', month: '2-digit', day: '2-digit',
                    hour:'2-digit', minute: '2-digit', second: '2-digit'};
                templateData.quizReleaseDate = quizReleaseDate.toLocaleDateString(language,dateOptions);
                return templateData;
            },{...templateData});
        }

        const elemt = document.getElementById(elemtId);
        const template = Handlebars.templates.quizScore;
        elemt.innerHTML=template(templateData);

    }).catch(e=>{
        console.error("oups ! ",e)

    });
    return true;
}
