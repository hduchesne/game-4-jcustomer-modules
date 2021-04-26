import React from 'react';
import PropTypes from "prop-types";

import {Radio, Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from '@material-ui/icons/Clear';
import {makeStyles} from "@material-ui/core/styles";
import classnames from 'clsx';

const useStyles = makeStyles(theme => ({
    answerGroup: {
        display:"flex",
        alignItems:"center",
        flexWrap:'wrap',
        ".showResult &":{
            "&.checked":{
                backgroundColor: theme.palette.background.checkedAnswer,
                borderRadius: theme.geometry.checkedAnswer.borderRadius,
                "& .MuiTypography-body1":{
                    color: theme.palette.grey[900],
                },
                "& + div::before":{
                    borderTop: '2px solid transparent',
                },
                "&:last-child":{
                        borderBottom: '2px solid transparent',
                    },
                "::before":{
                        borderTop: '2px solid transparent',
                }
            }
        }
    },
    checkGroup:{
        position:"relative",
        height:'1.5rem',
        padding:'.15rem .25rem .15rem .15rem',
        marginLeft:"-32px",
        opacity: 0,
        // transform: none,
        transition:theme.transitions.create(['opacity'],{
            easing: theme.transitions.easing.easeOut,
        }),
        borderRadius: '5px 0px 0px 5px',
        backgroundColor: theme.palette.grey[300],
        zIndex: 1,
        ".showResult &":{
            opacity: 1,
        },
        "&::after":{
            content: '""',
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '.9rem 0 .9rem 1.15rem',
            position: 'absolute',
            top: 0,
            // right:'-1.1rem',
            left:'1.9rem',
            borderColor:  `transparent transparent transparent ${theme.palette.grey[300]}`
        },
        "&.valid":{
            backgroundColor:theme.palette.primary.main,
            color:"rgba(255, 255, 255, 0.87)",
            "&::after":{
               borderColor:  `transparent transparent transparent ${theme.palette.primary.main}`
            }
        },
    },
    labelGroup:{
        marginLeft:"12px"
    }
}));

const Answer = (props) =>{
    const classes = useStyles(props);
    const {qna, qnaDispatch,id} = props;
    const [answer] = qna.answers.filter(answer => answer.id === id);

    const isValid = answer.isAnswer || (qna.notUsedForScore ? answer.checked : false);
    const handleChange = () =>
        qnaDispatch({
            case:"TOGGLE_ANSWER",
            payload:{
                answer
            }
        });

    const getResultIcon = () =>{
        if(isValid)
            return <CheckIcon />
        return <ClearIcon />
    };

    const getControl = () =>{
        if("checkbox"===qna.inputType)
            return <Checkbox id={answer.id} />
        return <Radio id={answer.id}/>
    };

    return(
        // <li className={answer.checked?"checked":""}>
        //     <FormGroup row aria-label="answer">
        <div className={classnames(
            classes.answerGroup,
            (answer.checked?"checked":"")
        )}>
            <div className={classnames(
                classes.checkGroup,
                (isValid?"valid":"")
            )}>
                {getResultIcon()}
            </div>
            <FormControlLabel
                className={classes.labelGroup}
                // value={answer.checked}
                control={getControl()}
                label={answer.label}
                labelPlacement="end"
                onChange={handleChange}
                checked={answer.checked}
            />
        </div>

            // </FormGroup>
        // </li>
    );

    // return(
    //     <li className={answer.checked?"checked":""}>
    //         <div className={`result ${isValid?"valid":""}`}>
    //             {isValid &&
    //                 <FontAwesomeIcon icon={['fas','check']}/>
    //             }
    //             {!isValid &&
    //                 <FontAwesomeIcon icon={['fas','times']}/>
    //             }
    //         </div>
    //         <Form.Check
    //             custom
    //             type={qna.inputType}
    //             name={qna.id}
    //             id={answer.id}
    //             label={answer.label}
    //             onChange={handleChange}
    //             checked={answer.checked}
    //         />
    //     </li>
    // );
};

Answer.propTypes={
    qna:PropTypes.object.isRequired,
    qnaDispatch:PropTypes.func.isRequired,
    id:PropTypes.string.isRequired,
}

export default Answer;