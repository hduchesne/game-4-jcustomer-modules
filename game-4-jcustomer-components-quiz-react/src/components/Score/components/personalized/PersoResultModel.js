import {getTypes} from 'misc/utils'

export const formatPersoResultJcrProps = (warmupJcrProps) => {

    const media = warmupJcrProps.media?.node ? {
        id: warmupJcrProps.media.node.uuid || null,
        types: getTypes(warmupJcrProps.media.node),
        path: warmupJcrProps.media.node.path || null,
    } : undefined;

    return{
        id: warmupJcrProps.uuid,
        title: warmupJcrProps.title?.value,
        subtitle: warmupJcrProps.subtitle?.value,
        content: warmupJcrProps.content?.value,
        media: media,
    }
}
