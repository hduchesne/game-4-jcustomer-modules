(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['quizScore'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <small><i class=\"far fa-clock\"></i> "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"quizReleaseDate") || (depth0 != null ? lookupProperty(depth0,"quizReleaseDate") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"quizReleaseDate","hash":{},"data":data,"loc":{"start":{"line":5,"column":40},"end":{"line":5,"column":59}}}) : helper)))
    + "</small>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p><a class=\"btn btn-primary btn-block px-3 py-2\" href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"quizURL") || (depth0 != null ? lookupProperty(depth0,"quizURL") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizURL","hash":{},"data":data,"loc":{"start":{"line":10,"column":60},"end":{"line":10,"column":71}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"quizResetBtnLabel") || (depth0 != null ? lookupProperty(depth0,"quizResetBtnLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizResetBtnLabel","hash":{},"data":data,"loc":{"start":{"line":10,"column":73},"end":{"line":10,"column":94}}}) : helper)))
    + "</a></p>\n";
},"5":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <div class=\"progress\">\n        <div class=\"progress-bar\" role=\"progressbar\" style=\"width: "
    + alias4(((helper = (helper = lookupProperty(helpers,"quizScore") || (depth0 != null ? lookupProperty(depth0,"quizScore") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizScore","hash":{},"data":data,"loc":{"start":{"line":14,"column":67},"end":{"line":14,"column":80}}}) : helper)))
    + "%\"\n            aria-valuenow=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"quizScore") || (depth0 != null ? lookupProperty(depth0,"quizScore") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizScore","hash":{},"data":data,"loc":{"start":{"line":15,"column":27},"end":{"line":15,"column":40}}}) : helper)))
    + "\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>\n    </div>\n    <div class=\"mt-3\"> <span class=\"text1\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"quizScore") || (depth0 != null ? lookupProperty(depth0,"quizScore") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizScore","hash":{},"data":data,"loc":{"start":{"line":17,"column":43},"end":{"line":17,"column":56}}}) : helper)))
    + "<span class=\"text2\">/100</span></span> </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    <p><a class=\"btn btn-primary btn-block px-3 py-2\" href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"quizURL") || (depth0 != null ? lookupProperty(depth0,"quizURL") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizURL","hash":{},"data":data,"loc":{"start":{"line":19,"column":60},"end":{"line":19,"column":71}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"quizStartBtnLabel") || (depth0 != null ? lookupProperty(depth0,"quizStartBtnLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizStartBtnLabel","hash":{},"data":data,"loc":{"start":{"line":19,"column":73},"end":{"line":19,"column":94}}}) : helper)))
    + "</a></p>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"card-body\">\n    <small class=\"card-meta mb-2\">Quiz</small>\n    <h4 class=\"card-title mt-0 text-white\">"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"quizQuestion") || (depth0 != null ? lookupProperty(depth0,"quizQuestion") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"quizQuestion","hash":{},"data":data,"loc":{"start":{"line":3,"column":43},"end":{"line":3,"column":59}}}) : helper)))
    + "</h4>\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"quizReleaseDate") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":4},"end":{"line":6,"column":11}}})) != null ? stack1 : "")
    + "</div>\n<div class=\"card-footer\">\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"quizReset") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":4},"end":{"line":11,"column":11}}})) != null ? stack1 : "")
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"quizHasScore") : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(7, data, 0),"data":data,"loc":{"start":{"line":12,"column":4},"end":{"line":20,"column":11}}})) != null ? stack1 : "")
    + "</div>\n\n\n";
},"useData":true});
})();