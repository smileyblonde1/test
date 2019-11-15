//HELPER TO ALLOW IF is equal to CONDITIONS ==================================================================
// Compares first value to the second one allowing entering IF clause if true.
// Otherwise entering ELSE clause if exist.
Handlebars.registerHelper('ifEquals', function(a, b, options) {
  if (a === b) {
    return options.fn(this);
  }

  return options.inverse(this);
});

//HELPER TO ALLOW IF is NOT equal to CONDITIONS ==================================================================
// Compares first value to the second one allowing entering IF clause if true.
// Otherwise entering ELSE clause if exist.
Handlebars.registerHelper('ifNotEquals', function(a, b, options) {
  if (a !== b) {
    return options.fn(this);
  }

  return options.inverse(this);
});


//LOOP SPECIFIC NUMBER OF TIMES ================================================================================
Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
});

//DO SOMETHING DIFFERENT FOR FIRST OR LAST ITEM IN LOOP ========================================================
//to append a Header or Footer to the loop
//'{{#if @first}}first{{/if}}{{#if @last}} last{{/if}}'>{{@key}} - {{@index}}
Handlebars.registerHelper("foreach", function(context, options) {
  options = _.clone(options);
  options.data = _.extend({}, options.hash, options.data);

  if (options.inverse && !_.size(context)) {
    return options.inverse(this);
  }

  return _.map(context, function(item, index, list) {
    var intIndex = _.indexOf(_.values(list), item);

    options.data.key = index;
    options.data.index = intIndex;
    options.data.isFirst = intIndex === 0;
    options.data.isLast = intIndex === _.size(list) - 1;

    return options.fn(item, options);
  }).join('');
});

//FILTER DATA IF REQUIRED ======================================================================================
//in some instances only part of the JSON is used i.e titles, but the rest is used elsewhere so filters the
//data to stop it looping through data in places it shouldn't
function find_in_object(my_object, my_criteria){

  return my_object.filter(function(obj) {
    return Object.keys(my_criteria).every(function(c) {
      return obj[c] == my_criteria[c];
    });
  });
}

//ADD ABILITY TO DO SOMETHING DIFFERENT FOR FIRST INSTANCE IN LOOP =============================================
Handlebars.registerHelper("foreach",function(arr,options) {
    if(options.inverse && !arr.length)
        return options.inverse(this);

    return arr.map(function(item,index) {
        item.$index = index;
        item.$first = index === 0;
        item.$last  = index === arr.length-1;
        return options.fn(item);
    }).join('');
});

//POPULATE TEMPLATE WITH CONTENT ===============================================================================
var Lib_hbsclient =(function ()
{
  //If handlebars output expected, render template (append into output container - AFTER whatever's in it already)
  var RenderTemplate=function(componentTemplateID,componentdata,componentOutputContainerID)
  {
    //if a valid template and data has been passed in populate the page.
    if(document.getElementById(componentTemplateID)!==null && document.getElementById(componentOutputContainerID)!==null)
    {
      var source = document.getElementById(componentTemplateID).innerHTML;
      var template = Handlebars.compile(source);
      var data = componentdata;
      var output = template(data);
      document.getElementById(componentOutputContainerID).insertAdjacentHTML('beforeend', output);
    }
    else {
      RestAPI.APIError("Handlebars Template HTML ids incorrect "+componentTemplateID+"/"+componentOutputContainerID);
    }
  };

  return{
    RenderTemplate:RenderTemplate
  };
})();
