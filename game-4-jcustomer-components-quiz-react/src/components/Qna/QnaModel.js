import {getRandomString, getTypes} from "misc/utils";

export const formatQnaJcrProps = qnaJcrProps => {

    const randomSelection=JSON.parse(qnaJcrProps.randomSelection?.value || false);
    const answers= qnaJcrProps.answers?.values?.map(answer=>{
        const controlledAnswer = JSON.parse(answer);
        return {
            ...controlledAnswer,
            id:getRandomString(5,"#aA"),
            checked:false
        }
    })

    if(randomSelection)
        answers.sort( (a,b) => a.id > b.id );

    const inputType = answers.filter(answer => answer.isAnswer).length > 1 ?"checkbox":"radio"

    return {
        id:qnaJcrProps.uuid,
        type: qnaJcrProps.primaryNodeType?.name,
        title: qnaJcrProps.title,
        question: qnaJcrProps.question?.value || "",
        help: qnaJcrProps.help?.value || "",
        notUsedForScore: JSON.parse(qnaJcrProps.notUsedForScore?.value || false),
        media: {
            id: qnaJcrProps.media?.node?.uuid || null,
            types: getTypes(qnaJcrProps.media?.node),
            path: qnaJcrProps.media?.node?.path || null,
        },
        jExpField2Map: qnaJcrProps.jExpField2Map?.value || null,
        randomSelection,
        answers,
        inputType
    }
}
