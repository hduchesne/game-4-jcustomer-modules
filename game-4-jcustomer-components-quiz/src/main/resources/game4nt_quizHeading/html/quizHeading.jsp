<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%--<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>--%>
<%--<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>--%>
<%--<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>--%>
<%--<%@ taglib prefix="ui" uri="http://www.jahia.org/tags/uiComponentsLib" %>--%>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<template:addResources type="css" resources="quiz.css" />
<div class="quiz-heading"></div>


<%--<c:set var="bindedComponent" value="${ui:getBindedComponent(currentNode, renderContext, 'j:bindedComponent')}"/>--%>
<%--<c:if test="${not empty bindedComponent && jcr:isNodeType(bindedComponent, 'game4nt:quiz')}">--%>
<%--    <c:set var="quizProps" value="${bindedComponent.properties}"/>--%>
<%--</c:if>--%>

<%--<c:set var="imageNode" value="${quizProps['wden:mediaNode'].node}"/>--%>
<%--<c:choose>--%>
<%--    <c:when test="${!empty imageNode && jcr:isNodeType(imageNode, 'wdenmix:widenAsset')}">--%>
<%--        <c:set var="imageURL" value="${imageNode.properties['wden:templatedUrl'].string}"/>--%>
<%--        <c:set var="imageURL" value="${fn:replace(imageURL, '{scale}', '1')}"/>--%>
<%--        <c:set var="imageURL" value="${fn:replace(imageURL, '{quality}', '72')}"/>--%>
<%--        <c:set var="imageURL" value="${fn:replace(imageURL, '{size}', '768')}"/>--%>
<%--        <c:url var="imageURL" value="${imageURL}"/>--%>
<%--    </c:when>--%>
<%--    <c:otherwise>--%>
<%--        <c:url var="imageURL" value="${imageNode.url}"/>--%>
<%--    </c:otherwise>--%>
<%--</c:choose>--%>

<%--<div class="inner-page">--%>
<%--    <div class="slider-item" style="background-image: url('${imageURL}');">--%>
<%--        <div class="container">--%>
<%--            <div class="row slider-text align-items-center justify-content-center">--%>
<%--                <div class="col-md-8 text-center col-sm-12 pt-5 element-animate">--%>
<%--                    <h1 class="pt-5">Quiz</h1>--%>
<%--                </div>--%>
<%--            </div>--%>
<%--        </div>--%>
<%--    </div>--%>
<%--</div>--%>
