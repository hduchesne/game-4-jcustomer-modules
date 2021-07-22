# Gamification experience
Gamification is a great marketing tool to enrich a visitor's profile. **jExperience** is a great
**[Customer Data Platform][cdp]** (a.k.a. CDP), **jContent** is a great **[Digital Experience Platform][dxp]**
(a.k.a. DXP) so let combine the power of both to create and run marketing game like Quizzes or Assessment tool.

This project present how to use the power of the Jahia suite to add gamification to the experience
of your visitor.

This project is composed by: 
* 3 main components:
    1. A [Core component][core] which contains configurations usable across multiple component
    1. A [Quiz component][quiz] which contains configurations and views to create, update and display
       Quizzes from jContent
    1. A standalone [React application][webapp] which is the quiz engine. This application consumes contents
       (quiz description, question & answers, warmup, video) from jContent and collects feedback for jExperience.
* 2 sample components:   
    1. A [Package builder][package] used to create a unique archive and deploy in one shoot the Core and the Quiz
    1. A [jCustomer plugin][jCust-plugin] sample code for a jCustomer custom action (not used)

## Overview
This project is a Jahia Accelerator. It presents implementation examples on
*how to deal with a headless application*.

### Features
The Quiz React webapp has 3 main features:
1. **Contributor oriented** : the webapp is fully editable and configurable from the jContent UI:
    * Quiz description, question & answers, warmup, video, background image (*editorial content*). 
      Media content can be added from a third party DAM or the local jContent Media repository
    * Static content like button label, css style, transition fx (*configuration content*).
1. **User Experience oriented** : The webapp can synchronize user responses with its CDP user profile
   (jExperience) and the user can have a personalized result page. User profile data can also be used to personalized
   your website content thereafter.
1. **Multichannel oriented** : The Quiz webapp can be added in your jahia website in few seconds. But,
   as a standalone application it can also be embedded via iframe or via a template in your favorite CMS.
   Contribute and personalize in Jahia, broadcast where you want.

### Data flow schema
The React quiz webapp get editorial and configuration content from jContent.
The module interact also with jExperience to enhanced user profile and improve content
personalization.

![010]

1. Marketeers create Quiz content from jContent and publish it. Now they have 2 options, embed the Quiz
in a website managed by Jahia, or start a standalone Quiz webapp.
1. A visitor visit the web page with the Quiz and start to answer questions.

<!-- The jahia Assessment Tool module is an good usage example of this module --> 
## QuickStart
### Prerequisite
This module needs
* widen-picker >= 2.1.0
* codemirror-editor >= 1.1.2

### Install
Import the package module in your Jahia server. This deploys 2 modules :
* game-4-jcustomer-components-quiz
* game-4-jcustomer-core

<img src="./doc/images/100_modules.png" width="600px"/>
  
To be able to create Quiz enable game-4-jcustomer-components-quiz for your project.

Now your are able to create a Quiz in jContent or create a Quiz Reference in Page composer.

<img src="./doc/images/200_contentToCreate.png" width="375px"/>

When you have a quiz create you can create subcontent like *Question and Answer* (Qna) and *Warmup*

<img src="./doc/images/202_subContent.png" width="375px"/>


[100]: doc/images/100_modules.png
[010]: doc/schema/010archi.png
[comment]: <> ([200]: doc/images/200_contentToCreate.png)

[comment]: <> ([202]: doc/images/202_subContent.png)

[core]: game-4-jcustomer-core/README.md
[quiz]: game-4-jcustomer-components-quiz/README.md
[webapp]: game-4-jcustomer-components-quiz-react/README.md
[package]: game-4-jcustomer-package/README.md
[jCust-plugin]: game-4-jcustomer-plugin/README.md

[dxp]: https://en.wikipedia.org/wiki/Digital_experience_platform
[cdp]: https://en.wikipedia.org/wiki/Customer_data_platform