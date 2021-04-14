import React from 'react';
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";

import get from "lodash.get";
import {useQuery} from "@apollo/react-hooks";

import {StoreContext} from "contexts";
import {GET_WARMUP} from "./WarmupGraphQL";
import Qna from "components/Qna";
import WarmupMapper from "components/Warmup/WarmupModel";
import Media from "components/Media";

const Warmup = (props) => {
    const { state, dispatch } = React.useContext(StoreContext);
    const { currentSlide,jContent} = state;
    const { gql_variables,cnd_type,language_bundle } =  jContent;

    const variables = Object.assign(gql_variables,{id:props.id})
    // const query = loader("./Warmup.graphql.disabled");
    const {loading, error, data} = useQuery(GET_WARMUP, {
        variables:variables,
    });

    const [warmup, setWarmup] = React.useState({childNodes:[]});

    React.useEffect(() => {

        if(loading === false && data){
            const warmup = WarmupMapper(get(data, "response.warmup", {}),cnd_type)
            dispatch({
                case:"ADD_SLIDES",
                payload:{
                    slides:warmup.childNodes.map(node=>node.id),
                    parentSlide:warmup.id
                }
            });
            // console.debug("warmup.id : ",warmup.id,"; warmup.video : ",warmup.video);
            setWarmup(warmup);
        }
    },[loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.debug("*** paint warmup : ",warmup.title);

    const show = currentSlide === props.id;
    const handleCLick = () =>
        dispatch({
            case:"NEXT_SLIDE"
        });

    return(
        <>
            <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
                {warmup.media &&
                    <Media id={warmup.media.id}
                           type={warmup.media.type.value}
                           mixins={warmup.media.mixins.map(mixin=>mixin.value)}
                           path={warmup.media.path}
                           alt={warmup.title}
                    />
                }

                <div className="game4-quiz__caption d-none d-md-block">
                    <h2 className="text-uppercase">{warmup.title}<span className="subtitle">{warmup.subtitle}</span></h2>
                    <div className="lead" dangerouslySetInnerHTML={{__html:warmup.content}}></div>
                    { warmup.video != null &&
                        <div>
                            <Media id={warmup.video.id || null}
                                   type={warmup.video.type.value}
                                   path={warmup.video.path}
                                   sourceID={warmup.id}
                            />
                        </div>
                    }
                    <Button variant="game4-quiz"
                            onClick={ handleCLick }>
                        {/*disabled={!props.showNext}*/}
                        {language_bundle && language_bundle.btnQuestion}
                    </Button>
                </div>
            </div>
            {warmup.childNodes.map( node =>
                <Qna
                    key={node.id}
                    id={node.id}
                />
            )}
        </>
    );
}

Warmup.propTypes={
    id:PropTypes.string.isRequired
}

export default Warmup;