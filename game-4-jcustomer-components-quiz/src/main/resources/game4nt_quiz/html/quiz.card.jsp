<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>

<template:addResources type="css" resources="cards.css" />

<c:set var="language" value="${currentResource.locale.language}"/>
<c:set var="title" value="${fn:escapeXml(currentNode.displayableName)}"/>
<c:set var="subtitle" value="${fn:escapeXml(currentNode.properties['game4:subtitle'])}"/>
<c:set var="quizQuestion" value="${title} - ${subtitle}"/>
<c:set var="quizKey" value="${currentNode.properties['game4:quizKey']}"/>
<c:set var="quizElemtId" value="quiz-${quizKey}"/>
<c:set var="quizScorePropertyName" value="quiz-score-${quizKey}"/>
<c:url var="quiz" value="${currentNode.url}"/>

<c:set var="persoResultNode" value="${currentNode.properties['game4:personalizedResultContent'].node}"/>
<c:set var="quizReset" value="${currentNode.properties['game4:reset'].boolean}"/>
<c:if test="${empty quizReset}" >
    <c:set var="quizReset" value="false"/>
</c:if>

<c:set var="imageNode" value="${currentNode.properties['wden:mediaNode'].node}"/>
<c:choose>
    <c:when test="${!empty imageNode && jcr:isNodeType(imageNode, 'wdenmix:widenAsset')}">
        <c:set var="imageURL" value="${imageNode.properties['wden:templatedUrl'].string}"/>
        <c:set var="imageURL" value="${fn:replace(imageURL, '{scale}', '1')}"/>
        <c:set var="imageURL" value="${fn:replace(imageURL, '{quality}', '72')}"/>
        <c:set var="imageURL" value="${fn:replace(imageURL, '{size}', '768')}"/>
        <c:url var="imageURL" value="${imageURL}"/>
    </c:when>
    <c:otherwise>
        <c:url var="imageURL" value="${imageNode.url}"/>
    </c:otherwise>
</c:choose>

<c:if test="${!renderContext.editMode && empty persoResultNode}" >
    <template:addResources type="javascript" resources="profiling/vendor/handlebars.runtime.min.js"/>
    <template:addResources type="javascript" resources="profiling/templates/quizScore.precompiled.js"/>
    <template:addResources type="javascript" resources="profiling/userdata.js"/>

    <script>
        window.addEventListener("DOMContentLoaded", () => {
            const loadQuizScore = (completed) =>{
                if(window.cxs === undefined)
                    return;

                completed(_getQuizScore({
                    labelBtnStart:'<fmt:message key="label.game4_btnStart"/>',
                    labelBtnTryAgain:'<fmt:message key="label.game4_btnTryAgain"/>',
                    quiz:{
                        key:'${quizKey}',
                        scorePropertyName:'${quizScorePropertyName}',
                        url:'${quiz}',
                        question:'${quizQuestion}',
                        elemtId:'${quizElemtId}',
                        language:'${language}',
                        reset:${quizReset}
                    }
                }));
            }
            const interval = setInterval(loadQuizScore, 500, (result) => {
                clearInterval(interval);
            });
        });
    </script>
</c:if>

<div class="col-md-4">
    <div class="card text-white card-has-bg click-col" style="background-image:url('${imageURL}');">
        <div class="card-img-overlay d-flex flex-column quiz" id="${quizElemtId}">
            <div class="card-body">
                <small class="card-meta mb-2">Quiz</small>
                <h4 class="card-title mt-0 text-white">${quizQuestion}</h4>
<%--                <small><i class="far fa-clock"></i>...</small>--%>
                    <c:if test="${!empty persoResultNode}" >
                        <c:choose>
                            <c:when test="${renderContext.editMode}">
                                <fmt:message key="label.persoResultNodeVisibleInPreview"/>...
                            </c:when>
                            <c:otherwise>
                                <template:module node="${persoResultNode}" editable="false"/>
                            </c:otherwise>
                        </c:choose>
                    </c:if>
            </div>
            <div class="card-footer">
            <c:choose>
                <c:when test="${empty persoResultNode}">
                    <fmt:message key="label.game4_scoreCalculationInProgress"/>...
                </c:when>
                <c:otherwise>
                    <c:if test="${quizReset}" >
                        <p><a class="btn btn-primary btn-block px-3 py-2" href="${quiz}">
                            <fmt:message key="label.game4_btnTryAgain"/>
                        </a></p>
                    </c:if>
                </c:otherwise>
            </c:choose>
            </div>
        </div>
    </div>
</div>

<%--<div class="col-md-4">--%>
<%--    <div class="card p-3 mb-2 quiz" id="${quizElemtId}">--%>
<%--        <div class="d-flex justify-content-between">--%>
<%--            <div class="d-flex flex-row align-items-center">--%>
<%--                <div class="icon"> <i class="bx bxl-mailchimp"></i> </div>--%>
<%--                <div class="ms-2 c-details">--%>
<%--                    <h6 class="mb-0">Completed</h6> <span>...</span>--%>
<%--                </div>--%>
<%--            </div>--%>
<%--            <div class="badge"> <span>Quiz</span> </div>--%>
<%--        </div>--%>
<%--        <div class="mt-5">--%>
<%--            <h3 class="heading">${quizQuestion}</h3>--%>
<%--            <div class="mt-5" >--%>
<%--                <fmt:message key="label.game4_scoreCalculationInProgress"/>...--%>
<%--            </div>--%>
<%--        </div>--%>
<%--    </div>--%>
<%--</div>--%>
