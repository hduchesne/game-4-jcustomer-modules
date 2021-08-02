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
One feature of this module is to be **Contributor oriented**. That means,
the Quiz webapp must be fully editable and configurable from the jContent UI.
The marketeer must be able to create at least a Quiz content and its related children
like a Warmup content or a Question & Answer content (QnA). Moreover, they must also be able to translate
these contents, to order them, to remove one of them and more.
But to be really contributor oriented, the marketeer must also be able to :
* Override the static labels used in the application (like "start" button).
* Enable a marketo form before to start the quiz.
* Synchronize user response with the CDP jExperience.
* Use a personalized content to present user results.
* Enable/disable transition between slides.
* Override some part of the application `theme`.

All of these requirements can be achieved with a well configured Jahia backend.

#### overview
The nodeTypes and mixins written in the [definitions.cnd] file are defined to create the best Jahia
backend.
The main goal of this module is to create Quizzes and a quiz (`game4nt:quiz`) has two types of children:
1. Warmup (`game4nt:warmup`) used to introduce a set of QnA. A warmup can display a text or a video to provide information
 or to introduce the context of coming questions.
2. QnA (`game4nt:qna`) used to ask a question and to display a set of response.

The hierarchy between the mixins and node types is presented in the schema below:

<img src="./doc/schema/020_quizArch.png" style="max-width:800px;"/>

#### game4nt:quiz
This nodeType is the main entry of a Quiz and the only one type a user can create directly in jContent.
the nodeType support the Quiz title, subtitle, description and other editorial content, but also the
webapp configuration.
##### Definition
This node type is defined like this:
```cnd
[game4nt:quiz] > jnt:content, game4mix:components, game4mix:showInTree, game4mix:usesConsents, wdenmix:mediaReference,game4mix:quizConfiguration,game4mix:marketingFormReference, mix:title, game4mix:quizStaticLabels orderable
 - game4:quizKey (string) primary mandatory
 - game4:subtitle (string) internationalized
 - game4:description (string, richtext[ckeditor.toolbar='Tinny',ckeditor.customConfig='$context/modules/game-4-jcustomer-components-quiz/javascript/ckeditor/config/small.js']) internationalized
 - game4:duration (string,choicelist[resourceBundle]) = '5 mins' autocreated indexed=no < '5 mins', '10 mins', '30 mins', '1h' , '> 1h'
 - game4:personalizedResultContent (weakreference, choicelist[nodes='$currentSite//*;wemnt:personalizedContent'])
 + * (game4mix:quizChild)
```

To be flexible and to have the capability to add Warmup and QnA in the order we want and the number
we want, we use as child type the mixin `game4mix:quizChild`

`game4nt:quiz` extends 9 supertypes:
1. `jnt:content` meaning the node type is a content node type.
2. `game4mix:components` meaning the node type appears in the **Game Center** menu entry.
This mixin is defined in the core module (see the core [defnition.cnd][core_cnd]).
3. `game4mix:showInTree` meaning the node is visible in the jContent tree
4. `game4mix:usesConsents` meaning the contributor can select jExperience consent that user must
approve before to start the quiz (see the core [defnition.cnd][core_cnd]).
5. `wdenmix:mediaReference` meaning the contributor can select a background for the Quiz 'slide' coming
from jContent Media repository or from Widen Dam if the contributor has a licence with them.
6. `game4mix:quizConfiguration` meaning the contributor can configure the behavior of some part
of the Quiz.

7. `game4mix:marketingFormReference` meaning the contributor can select a marketing form provider
to expose a form in the first slide of the Quiz. Currently, the accelerator is configured with Marketo
only.
8. `game4mix:quizStaticLabels` meaning the contributor can update and translate the "static" content
used in the Quiz, mostly buttons label.
9. `mix:title` meaning the contributor will have a **title** property which will be automatically
sync with the System name field.

###### Mixins
###### game4mix:usesConsents
This mixin is defined in the [core component][core_cnd] :
```cnd
[game4mix:usesConsents] mixin
 - game4:consentType (weakreference, choicelist[nodes='$currentSite/consentTypes;wemnt:consentType']) multiple nofulltext
```
This mixin adds to the nodeType using it a property with a `choiceList selectorType` which lists
the consents created in jExperience.

Consent in jExperience
![001]

Contributor select a consent in a Quiz (Jahia backend)
![002]

Website visitor must consent before to start the Quiz
![003]

###### wdenmix:mediaReference
This mixin is defined in the [Widen module][widen_module]. That means you have to install this module
to use the Quiz.
> [Widen][widen] is an external DAM provider.

This mixin adds two properties in the nodeType using it :
1. **Media Source** : select the source where you want to pick a media (Widen or jContent).
2. **Media Content** : picker to select the media you want to use as background of the Quiz slide.

Select a content from Widen Dam selecting "**Widen**" as Media Source.
![012]

Then click "Add Widen Asset" placeholder to select the media you want
(see more about [widen picker][widen_picker])
![014]

Select a content from jContent Media repository selecting "**jContent**" as Media Source.
![011]

> Note : it is **not required** to have a Widen account to use this mixin. Indeed, if you do not have a Widen account
> configured the **picker** displays an error message if you select "Widen" as Media Source, so, you
> have to select jContent to pick a media.

![010]

###### game4mix:quizConfiguration
* enable/disable transition between slide
* enable/disable the reset button
* enable/disable the browsing from the progress bar
* change the css theme
###### game4mix:marketingFormReference
###### game4mix:quizStaticLabels


##### Views

### The Custom selectorType QnAJson.jsx
### The drools rule



  When you have a quiz create you can create subcontent like *Question and Answer* (Qna) and *Warmup*

<img src="./doc/images/202_subContent.png" width="375px"/>

[001]: ./doc/images/001_consent.png
[002]: ./doc/images/002_consent.png
[003]: ./doc/images/003_consent.png

[010]: ./doc/images/010_widenOff.png
[011]: ./doc/images/011_widenOffJcontentOn.png
[012]: ./doc/images/012_widenOn.png
[014]: ./doc/images/014_widenOnSelected.png

[overview.md]: ../README.md
[definitions.cnd]: ./src/main/resources/META-INF/definitions.cnd
[quizViews]: ./src/main/resources/game4nt_quiz/html
[quizRefViews]: ./src/main/resources/game4nt_quizReference/html
[d_rule]: ./src/main/resources/META-INF/rules.drl
[quiz_webapp]: ./src/main/resources/javascript/webapp
[QnAJson]: ./src/javascript/QnAJson
[jExp_conf]: ./src/main/resources/META-INF/jexperience
[selector_conf]:  ./src/main/resources/META-INF/jahia-content-editor-forms/fieldsets
[core_cnd]: ../game-4-jcustomer-core/src/main/resources/META-INF/definitions.cnd
[widen_module]: https://store.jahia.com/contents/modules-repository/org/jahia/se/modules/widen-picker.html
[widen]: https://www.widen.com/
[widen_picker]: https://github.com/Jahia/widen-asset-picker/blob/main/doc/en/picker.md