(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['quizScore'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"progress\">\n    <div class=\"progress-bar\" role=\"progressbar\" style=\"width: "
    + alias4(((helper = (helper = lookupProperty(helpers,"quizScore") || (depth0 != null ? lookupProperty(depth0,"quizScore") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizScore","hash":{},"data":data,"loc":{"start":{"line":3,"column":63},"end":{"line":3,"column":76}}}) : helper)))
    + "%\" aria-valuenow=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"quizScore") || (depth0 != null ? lookupProperty(depth0,"quizScore") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizScore","hash":{},"data":data,"loc":{"start":{"line":3,"column":94},"end":{"line":3,"column":107}}}) : helper)))
    + "\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div>\n</div>\n<div class=\"mt-3\"> <span class=\"text1\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"quizScore") || (depth0 != null ? lookupProperty(depth0,"quizScore") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizScore","hash":{},"data":data,"loc":{"start":{"line":5,"column":39},"end":{"line":5,"column":52}}}) : helper)))
    + " <span class=\"text2\">/100</span></span> </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p><a class=\"btn btn-primary btn-sm px-3 py-2\" href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"quizURL") || (depth0 != null ? lookupProperty(depth0,"quizURL") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizURL","hash":{},"data":data,"loc":{"start":{"line":7,"column":53},"end":{"line":7,"column":64}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"quizStartBtnLabel") || (depth0 != null ? lookupProperty(depth0,"quizStartBtnLabel") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"quizStartBtnLabel","hash":{},"data":data,"loc":{"start":{"line":7,"column":66},"end":{"line":7,"column":87}}}) : helper)))
    + "</a></p>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? lookupProperty(depth0,"quizScore") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":8,"column":7}}})) != null ? stack1 : "");
},"useData":true});
})();