import React, {useContext} from 'react';
import parse, {domToReact} from 'html-react-parser';
import {JahiaCtx} from 'contexts';
import {resolveJahiaEmbeddedURL, resolveJahiaMediaURL} from 'misc/utils';


export const EmbeddedPathInHtmlResolver = ({htmlAsString}) => {
    const {workspace, locale, host, isPreview, isEdit} = useContext(JahiaCtx);

    if (!htmlAsString) {
        return null;
    }

    const options = {
        replace(domNode) {
            const domElement = domNode;
            if (!domElement.attribs) {
                return;
            }

            if (domElement.attribs.src) {// Get image url
                const filePathRegex = /\{workspace\}(?<filePath>[\w\d/.-]*)/gm;
                const filePathExec = filePathRegex.exec(domElement.attribs.src);
                if (filePathExec) {
                    const {groups: {filePath}} = filePathExec;
                    domElement.attribs.src = resolveJahiaMediaURL({host,path: filePath, workspace});
                }

                return domElement;
            }

            if (domElement.attribs.href) {// Resolve link
                const nodePathRegex = /\{mode\}\/\{lang\}(?<nodePath>[\w\d/.-]*)/gm;///\{mode\}\/\{lang\}(?<nodePath>[\w\d/.-]*)\.\w+$/gm;
                const nodePathExec = nodePathRegex.exec(domElement.attribs.href);
                if (nodePathExec) {
                    const {groups: {nodePath}} = nodePathExec;
                    return (
                        <a href={resolveJahiaEmbeddedURL({path:nodePath,host,locale,isPreview,isEdit})}
                           target={domElement.attribs.target}
                           className={domElement.attribs.class}
                           title={domElement.attribs.title}
                        >
                            {domToReact(domElement.children, options)}
                        </a>
                    );
                }
            }
        }
    };

    const html = parse(htmlAsString, options);
    return (<>{html}</>);
};
