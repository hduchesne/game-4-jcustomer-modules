<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="qjexp" uri="http://www.jahia.org/qjexp" %>

<template:addResources type="css" resources="cards.css"/>
<c:set var="title" value="${fn:escapeXml(currentNode.displayableName)}"/>
<c:set var="subtitle" value="${fn:escapeXml(currentNode.properties['game4:subtitle'])}"/>
<c:set var="quizQuestion" value="${title} - ${subtitle}"/>
<c:set var="quizReset" value="${currentNode.properties['game4:reset'].boolean}"/>

<c:set var="mediaNode" value="${currentNode.properties['game4:image'].node}"/>
<%@ include file="../../getMediaURL.jspf" %>
<c:set var="imageURL" value="${mediaURL}"/>
<template:addCacheDependency node="${mediaNode}"/>

<c:url var="quizURL" value="${currentNode.url}"/>
<c:set var="site" value="${renderContext.site.siteKey}"/>
<c:set var="quizKey" value="${currentNode.properties['game4:quizKey']}"/>
<c:set var="quizScorePropertyName" value="quiz-score-${quizKey}"/>
<c:set var="language" value="${currentResource.locale.language}"/>
<c:set var="quizEventProps"
       value="${qjexp:searchQuizScore(pageContext.request,site,quizKey,quizScorePropertyName,language)}"/>

<c:set var="persoResultNode" value="${currentNode.properties['game4:personalizedResultContent'].node}"/>

<c:choose>
    <c:when test="${!empty persoResultNode}">
        <template:include view="hidden.card.perso">
            <template:param name="quizQuestion" value="${quizQuestion}"/>
            <template:param name="imageURL" value="${imageURL}"/>
            <template:param name="quizReset" value="${quizReset}"/>
            <template:param name="quizURL" value="${quizURL}"/>
            <template:param name="quizReleaseDate" value="${quizEventProps['quizReleaseDate']}"/>
            <template:param name="quizScore" value="${quizEventProps['quizScore']}"/>
        </template:include>
    </c:when>
    <c:otherwise>
        <template:include view="hidden.card.score">
            <template:param name="quizQuestion" value="${quizQuestion}"/>
            <template:param name="imageURL" value="${imageURL}"/>
            <template:param name="quizReset" value="${quizReset}"/>
            <template:param name="quizURL" value="${quizURL}"/>
            <template:param name="quizReleaseDate" value="${quizEventProps['quizReleaseDate']}"/>
            <template:param name="quizScore" value="${quizEventProps['quizScore']}"/>
        </template:include>
    </c:otherwise>
</c:choose>




<%--Front side rendering approach, doesn't work if I do a jContent search event--%>
<%--<c:if test="${!renderContext.editMode && empty persoResultNode}" >--%>
<%--    <template:addResources type="javascript" resources="profiling/vendor/handlebars.runtime.min.js"/>--%>
<%--    <template:addResources type="javascript" resources="profiling/templates/quizScore.precompiled.js"/>--%>
<%--    <template:addResources type="javascript" resources="profiling/userdata.js"/>--%>

<%--    <script>--%>
<%--        window.addEventListener("DOMContentLoaded", () => {--%>
<%--            const loadQuizScore = (completed) =>{--%>
<%--                if(window.cxs === undefined)--%>
<%--                    return;--%>

<%--                completed(_getQuizScore({--%>
<%--                    labelBtnStart:'<fmt:message key="label.game4_btnStart"/>',--%>
<%--                    labelBtnTryAgain:'<fmt:message key="label.game4_btnTryAgain"/>',--%>
<%--                    quiz:{--%>
<%--                        key:'${quizKey}',--%>
<%--                        scorePropertyName:'${quizScorePropertyName}',--%>
<%--                        url:'${quiz}',--%>
<%--                        question:'${quizQuestion}',--%>
<%--                        elemtId:'${quizElemtId}',--%>
<%--                        language:'${language}',--%>
<%--                        reset:${quizReset}--%>
<%--                    }--%>
<%--                }));--%>
<%--            }--%>
<%--            const interval = setInterval(loadQuizScore, 500, (result) => {--%>
<%--                clearInterval(interval);--%>
<%--            });--%>
<%--        });--%>
<%--    </script>--%>
<%--</c:if>--%>

<%--<div class="col-md-4">--%>
<%--    <div class="card text-white card-has-bg click-col" style="background-image:url('${imageURL}');">--%>
<%--        <div class="card-img-overlay d-flex flex-column quiz" id="${quizElemtId}">--%>
<%--            <div class="card-body">--%>
<%--                <small class="card-meta mb-2">Quiz</small>--%>
<%--                <h4 class="card-title mt-0 text-white">${quizQuestion}</h4>--%>
<%--                ${quizEventProps["quizScore"]}--%>
<%--                <small><i class="far fa-clock"></i>${quizEventProps["quizReleaseDate"]}</small>--%>
<%--                    <c:if test="${!empty persoResultNode}" >--%>
<%--                        <c:choose>--%>
<%--                            <c:when test="${renderContext.editMode}">--%>
<%--                                <fmt:message key="label.persoResultNodeVisibleInPreview"/>...--%>
<%--                            </c:when>--%>
<%--                            <c:otherwise>--%>
<%--                                <template:module node="${persoResultNode}" editable="false"/>--%>
<%--                            </c:otherwise>--%>
<%--                        </c:choose>--%>
<%--                    </c:if>--%>
<%--            </div>--%>
<%--            <div class="card-footer">--%>
<%--            <c:choose>--%>
<%--                <c:when test="${empty persoResultNode}">--%>
<%--                    <fmt:message key="label.game4_scoreCalculationInProgress"/>...--%>
<%--                </c:when>--%>
<%--                <c:otherwise>--%>
<%--                    <c:if test="${quizReset}" >--%>
<%--                        <p><a class="btn btn-primary btn-block px-3 py-2" href="${quiz}">--%>
<%--                            <fmt:message key="label.game4_btnTryAgain"/>--%>
<%--                        </a></p>--%>
<%--                    </c:if>--%>
<%--                </c:otherwise>--%>
<%--            </c:choose>--%>
<%--            </div>--%>
<%--        </div>--%>
<%--    </div>--%>
<%--</div>--%>
