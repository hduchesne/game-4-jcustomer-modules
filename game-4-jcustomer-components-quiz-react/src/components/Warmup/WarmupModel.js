import {getTypes} from 'misc/utils'

export const formatWarmupJcrProps = (warmupJcrProps) => {
    return{
        id: warmupJcrProps.id,
        title: warmupJcrProps.title,
        subtitle: warmupJcrProps.subtitle?.value || "",
        content: warmupJcrProps.content?.value || "",
        duration: warmupJcrProps.duration?.value || "",
        media: {
            id: warmupJcrProps.media?.node?.uuid || null,
            types: getTypes(warmupJcrProps.media?.node),
            path: warmupJcrProps.media?.node?.path || null,
        },
        video: {
            id: warmupJcrProps.video?.node?.uuid || null,
            types: getTypes(warmupJcrProps.video?.node),
            path: warmupJcrProps.video?.value || warmupJcrProps.video?.node?.path || null,
        },
        childNodes: warmupJcrProps.children?.nodes?.map(node => ({
                id: node.uuid,
                types: getTypes(node)
            })
        ) || []
    }
}
