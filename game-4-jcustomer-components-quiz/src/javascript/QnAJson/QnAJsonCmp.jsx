import React from 'react';
import * as PropTypes from 'prop-types';
import './QnAJsonCmp.css';

import {Input, Toggle} from '@jahia/design-system-kit';

// Import Checkbox from '@material-ui/core/Checkbox';
// import FormGroup from '@material-ui/core/FormGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';
// import TextField from '@material-ui/core/TextField';
// import {Checkbox, FormGroup, FormControlLabel, FormControl, FormLabel, TextField, withStyles} from '@material-ui/core';
// import {Checkbox, FormGroup, FormControlLabel, FormControl, FormLabel, InputBase, withStyles} from '@material-ui/core';
import {Grid, FormControlLabel, withStyles} from '@material-ui/core';
const styles = () => ({
    switchLabel: {
        '& >span:last-child': {
            color: 'black'
            // FontSize: '1rem'
        }
    },
    container: {
        // Border: '1px solid rgba(19, 28, 33, 1)',
        padding: '.5rem',
        boxShadow: '0px 2px 10px -5px #000000, 2px 5px 15px 5px rgba(0,0,0,0);'
    },
    toggle: {
        margin: 0
    }
    // Root: {
    //     background: '#fff',
    //     display: 'flex',
    //     boxShadow: 'none',
    //     zIndex: 3,
    //     margin: '0 auto',
    // },
    // input: {
    //     flex: '100%',
    //     borderBottom: `1px solid ${theme.palette.primary.main}`,
    //     height: '50px'
    // },
    // inputCdp: {
    //     flex: '50%',
    //     borderBottom: `1px solid ${theme.palette.primary.main}`,
    //     height: '50px'
    // }
    // Root: {
    //     '& > *': {
    //         margin: Number(theme.spacing.unit),
    //         width: '25ch'
    //     }
    // }
});

const formatValue = value => {
    const defaultAnswer = {
        isAnswer: false,
        label: '',
        cdpValue: ''
    };
    // Console.log('value :', value);
    // console.log('typeof value :', typeof value);

    if (value === undefined) {
        // Console.log('value is undefined, return default:', defaultAnswer);
        // Return {...defaultAnswer} ;
        return defaultAnswer;
    }

    // Note see I use ajv here to check object format
    if (typeof value === 'object' && value !== null) {
        return value;
    }

    if (typeof value === 'string') {
        try {
            const formattedValue = JSON.parse(value);
            if (typeof formattedValue === 'object' && formattedValue !== null) {
                return formattedValue;
            }
        } catch (e) {
            console.warn('value is not an object, maybe the format used is before version 1.0.2 ');
        }
    }

    return {
        ...defaultAnswer,
        label: value
    };
};

const QnAJsonCmp = ({field, id, value, onChange, classes}) => {
    const maxLength = field.selectorOptions.find(option => option.name === 'maxLength');
    // Note do a convert here, because I need a unique format for the app!
    const controlledValue = formatValue(value);
    // ControlledValue.id=id;

    const handleChangeLabel = e => {
        controlledValue.label = e?.target?.value;
        onChange(JSON.stringify(controlledValue));
    };

    const handleChangeCdpValue = e => {
        controlledValue.cdpValue = e?.target?.value;
        onChange(JSON.stringify(controlledValue));
    };

    /* eslint no-unused-vars: ["error", {"args": "after-used"}] */
    const handleChangeIsAnswer = (e, checked) => {
        controlledValue.isAnswer = checked;
        onChange(JSON.stringify(controlledValue));
    };

    return (
        <Grid container spacing={3} className={classes.container}>
            <Grid item xs={12} sm={6}>
                <FormControlLabel
                    className={classes.switchLabel}
                    control={
                        <Toggle
                            id={`isAnswer-${id}`}
                            name={`isAnswer-${id}`}
                            className={classes.toggle}
                            checked={controlledValue.isAnswer === true}
                            readOnly={field.readOnly}
                            onChange={handleChangeIsAnswer}
                        />
                        // <Switch
                        //     checked={controlledValue.isAnswer === true}
                        //     name={`isAnswer-${id}`}
                        //     color="primary"
                        //     onChange={handleChangeIsAnswer}
                        // />
                    }
                    label="Expected Answer"
                    // LabelPlacement="top"
                />

            </Grid>
            <Grid item xs={12} sm={6}>
                <Input
                    fullWidth
                    id={`cdp-${id}`}
                    name={`cdp-${id}`}
                    value={controlledValue.cdpValue}
                    readOnly={field.readOnly}
                    type="text"
                    placeholder="(optional) User profile value"
                    onChange={handleChangeCdpValue}
                />
            </Grid>
            <Grid item xs={12}>
                <Input
                    fullWidth
                    id={id}
                    name={id}
                    inputProps={{
                        'aria-labelledby': `${field.name}-label`,
                        'aria-required': field.mandatory,
                        maxlength: maxLength && maxLength.value
                    }}
                    value={controlledValue.label}
                    readOnly={field.readOnly}
                    type="text"
                    placeholder="Answer"
                    onChange={handleChangeLabel}
                />
            </Grid>
        </Grid>
    );
};

QnAJsonCmp.propTypes = {
    field: PropTypes.object,
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired
};

export const QnAJson = withStyles(styles)(QnAJsonCmp);
QnAJsonCmp.displayName = 'QnAJsonCmp';
