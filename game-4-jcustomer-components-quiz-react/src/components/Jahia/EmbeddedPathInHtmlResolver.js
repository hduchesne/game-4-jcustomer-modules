import React, {useContext} from 'react';
import {Element} from 'domhandler/lib/node';
import parse, {DOMNode, domToReact} from 'html-react-parser';
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
            // Console.log("[EmbeddedPathInHtmlResolver] domElement : ",domElement)
            if (!domElement.attribs) {
                return;
            }

            //filesServerUrl
            if (domElement.attribs.src) {// Get image url
                // console.log("[EmbeddedPathInHtmlResolver] img domElement.attribs : ",domElement.attribs)
                const filePathRegex = /\{workspace\}(?<filePath>[\w\d/.-]*)/gm;
                const filePathExec = filePathRegex.exec(domElement.attribs.src);
                if (filePathExec) {
                    const {groups: {filePath}} = filePathExec;
                    // Console.log("[EmbeddedPathInHtmlResolver] filePath : ",filePath)
                    domElement.attribs.src = resolveJahiaMediaURL({host,path: filePath, workspace});
                }

                return domElement;
            }

            if (domElement.attribs.href) {// Resolve link
                // console.log("[EmbeddedPathInHtmlResolver] link domElement.attribs : ",domElement.attribs)
                const nodePathRegex = /\{mode\}\/\{lang\}(?<nodePath>[\w\d/.-]*)/gm;///\{mode\}\/\{lang\}(?<nodePath>[\w\d/.-]*)\.\w+$/gm;
                const nodePathExec = nodePathRegex.exec(domElement.attribs.href);
                if (nodePathExec) {
                    const {groups: {nodePath}} = nodePathExec;
                    // Console.log("[EmbeddedPathInHtmlResolver] nodePath : ",nodePath)
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

    // return parse(htmlAsString, options);
    const html = parse(htmlAsString, options);
    return (<>{html}</>);
};
