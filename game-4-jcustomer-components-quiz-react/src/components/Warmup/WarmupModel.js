import {getTypes} from 'misc/utils'
import DOMPurify from "dompurify";

export const formatWarmupJcrProps = (warmupJcrProps) => {
    return{
        id: warmupJcrProps.uuid,
        title: warmupJcrProps.title,
        subtitle: warmupJcrProps.subtitle?.value || "",
        content: DOMPurify.sanitize(warmupJcrProps.content?.value || "", { ADD_ATTR: ['target'] }),
        duration: warmupJcrProps.duration?.value || "",
        media: {
            id: warmupJcrProps.media?.node?.uuid || null,
            types: getTypes(warmupJcrProps.media?.node),
            path: warmupJcrProps.media?.node?.path || null,
        },
        video: {
            id: warmupJcrProps.video?.node?.uuid || null,
            type: warmupJcrProps.video?.node?.primaryNodeType?.name,
            types: getTypes(warmupJcrProps.video?.node),
            path: warmupJcrProps.video?.node?.path || warmupJcrProps.video?.value ||  null,
        },
        childNodes: warmupJcrProps.children?.nodes?.map(node => ({
                id: node.uuid,
                types: getTypes(node)
            })
        ) || []
    }
}
