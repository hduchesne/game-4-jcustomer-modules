const validMark="[*]";
const score_splitPattern="::";

const workspace = ["default","live"];
const cnd_type = {
    QNA:"game4nt:qna",
    WARMUP:"game4nt:warmup",
    WIDEN_IMAGE:"wdennt:image",
    WIDEN_VIDEO:"wdennt:video",
    EXT_VIDEO:'ext:video',
    JNT_FILE:'jnt:file',
    IMAGE:'jmix:image'
}
const consent_status={
    GRANTED:"GRANTED",
    DENIED:"DENIED",
    REVOKED:"REVOKED"
};
const mktgForm={
    MARKETO:"mkto",
}

export {
    workspace,
    cnd_type,
    validMark,
    consent_status,
    score_splitPattern,
    mktgForm
}