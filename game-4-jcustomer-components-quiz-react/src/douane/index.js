import * as Ajv from "ajv";
import {context as contextSchema} from "douane/lib/schema/context";
import {getGQLWorkspace} from "misc/utils";
import {ContextException} from 'exceptions/ContextException';
import {cndTypes,consentStatusEnum,scoreSplitPattern,mktgFormEnum} from "douane/lib/config";

const ajv = new Ajv({useDefaults:true});
//TODO le try catch doit etre fait ici et un component react doit etre retourne
export const contextValidator = (context) =>{

    const valid = ajv.validate(contextSchema, context);
    if (!valid) {
        throw new ContextException({
            message: 'Context configuration object',
            errors: ajv.errors
        });
    }

    context.workspace = getGQLWorkspace(context.workspace);
    context.cndTypes=cndTypes;
    context.appContext = {
        consentStatusEnum,
        scoreSplitPattern,
        mktgFormEnum
    }

    return context;
}
