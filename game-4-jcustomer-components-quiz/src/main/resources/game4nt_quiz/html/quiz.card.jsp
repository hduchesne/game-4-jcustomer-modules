<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<template:addResources type="javascript" resources="profiling/vendor/handlebars.runtime.min.js"/>
<template:addResources type="javascript" resources="profiling/templates/quizScore.precompiled.js"/>
<template:addResources type="javascript" resources="profiling/userdata.js"/>
<template:addResources type="css" resources="cards.css" />

<c:set var="title" value="${fn:escapeXml(currentNode.displayableName)}"/>
<c:set var="subtitle" value="${fn:escapeXml(currentNode.properties['game4:subtitle'])}"/>
<c:set var="key" value="${currentNode.properties['game4:quizKey']}"/>
<c:set var="quizElemtId" value="quiz-${key}"/>
<c:set var="quizScorePropertyName" value="quiz-score-${key}"/>
<c:url var="quiz" value="${currentNode.url}"/>

<script>
    window.addEventListener("DOMContentLoaded", () => {
        const elemt = document.getElementById("${quizElemtId}");
        elemt.addEventListener('quizDataLoaded', e => {
            const templateData = {
                quizScore:e.detail.profileProperties["${quizScorePropertyName}"],
                quizURL:'${quiz}',
                quizStartBtnLabel:'<fmt:message key="label.game4_btnStart"/>'
            }
            const template = Handlebars.templates.quizScore;
            e.target.innerHTML=template(templateData);
        });
    });
</script>

<div class="col-md-4">
    <div class="card p-3 mb-2">
        <div class="d-flex justify-content-between">
            <div class="d-flex flex-row align-items-center">
                <div class="icon"> <i class="bx bxl-mailchimp"></i> </div>
                <div class="ms-2 c-details">
                    <h6 class="mb-0">Mailchimp</h6> <span>1 days ago</span>
                </div>
            </div>
            <div class="badge"> <span>Design</span> </div>
        </div>
        <div class="mt-5">
            <h3 class="heading">${title} - ${subtitle}</h3>
            <div class="mt-5 quiz-score-loaded-subscriber" id="${quizElemtId}">
                ...get your score
<%--                <div class="progress">--%>
<%--                    <div class="progress-bar" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>--%>
<%--                </div>--%>
<%--                <div class="mt-3"> <span class="text1">32 Applied <span class="text2">of 50 capacity</span></span> </div>--%>
            </div>
        </div>
    </div>
</div>
