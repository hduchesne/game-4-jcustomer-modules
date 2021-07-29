# Quiz experience

The quiz component is part of the Gamification Experience project. To know more about
the full component of the project [read this page][overview.md].

## Overview

This module is used to configure Jahia as a backend of the Quiz React webapp.
Also, it contains :
* The content definition of **Quiz**, **Warmup**, **Question & Answer**,
and **Quiz Reference** (see the [definitions.cnd] file.), and the JSON
**selectorType configurations** (see [the folder][selector_conf]).
* A **custom selectorType** ([QnAJson]) used to manage 3 related properties and store 
the result as a JSON into a Jahia String property.
* **Views** for **Quiz** (see [quiz views folder][quizViews]),
and **Quiz Reference** (see [quiz reference views folder][quizRefViews]).
Note, the default view for the Quiz embed the Quiz React webapp code.
* The build of the **Quiz React webapp** (see [the folder][quiz_webapp])
* A **drools rule** (see [the code][d_rule]) which create automatically a jExperience user profile based
on the quiz key. This property is used to store the score that a user obtains
at the end of a quiz. Then marketeers can create personalization rule based
on this score to personalize the content displayed to the user.
* A set of **configuration files for jExperience** to create automatically 
user profile properties and rules (see [the folder][jExp_conf])

## Module in details

### Node Type definitions and views
### The Custom selectorType QnAJson.jsx
### The drools rule

Also, the user can :
* override some part of the application `theme`,
* enable/disable transition between slides
* override the static labels used in the application (like "start" button)
* enable a marketo form before to start the quiz
* synchronize user response with the CDP jExperience
* use a personalized content to present user results
* 

  When you have a quiz create you can create subcontent like *Question and Answer* (Qna) and *Warmup*

<img src="./doc/images/202_subContent.png" width="375px"/>


[overview.md]: ../README.md
[definitions.cnd]: ./src/main/resources/META-INF/definitions.cnd
[quizViews]: ./src/main/resources/game4nt_quiz/html
[quizRefViews]: ./src/main/resources/game4nt_quizReference/html
[d_rule]: ./src/main/resources/META-INF/rules.drl
[quiz_webapp]: ./src/main/resources/javascript/webapp
[QnAJson]: ./src/javascript/QnAJson
[jExp_conf]: ./src/main/resources/META-INF/jexperience
[selector_conf]:  ./src/main/resources/META-INF/jahia-content-editor-forms/fieldsets