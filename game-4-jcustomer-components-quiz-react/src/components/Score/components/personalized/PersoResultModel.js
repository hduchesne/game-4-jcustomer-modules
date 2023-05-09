import {getTypes} from 'misc/utils'
import DOMPurify from "dompurify";

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
        content: DOMPurify.sanitize(warmupJcrProps.content?.value, { ADD_ATTR: ['target'] }),
        media: media,
    }
}
