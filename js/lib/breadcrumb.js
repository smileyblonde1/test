//Validate input ========================================================================================================================
var Breadcrumb=(function ()
{
  var GetBreadcrumbData=function()
  {
    //Get Page Type to load
    var PageType=Validation.CleanData_GeneralTxtOnly($(".JSpagetype").attr("id"));

    switch(PageType)
    {
      case "browse":
        //Get Browse Menu Breadcrumb
        RestAPI.RequestData("categories/"+Utillities.getURLID(),"get","GetBrowseBreadcrumb",Breadcrumb.RenderBrowseBreadcrumb,RestAPI.APIError,RestAPI.APIError,"","");
        break;

      case "search":
        RenderSearchBreadcrumb("JSSearchBreadcrumbTemplate",JSON.parse('{"searchbreadcrumb":[{"searchterm":"'+Validation.CleanData_GeneralTxtOnly(Utillities.GetUrlParameter("term"))+'"}]}'),"JSBreadcrumbContent");
        break;

      case "listitems":
      //This is IN resultsView as the list name is only known if there's results
      break;

      default:
      //Display Nothing
      break;
    }
  };

  var RenderBrowseBreadcrumb=function(Data)
  {
    console.log(Data);
    var PageTitle=JSON.stringify(Data);
    $("#JSResultsTitle").text(Validation.CleanData_GeneralTxtOnly(PageTitle.substring(PageTitle.lastIndexOf(":",PageTitle.length))));
    Lib_hbsclient.RenderTemplate("JSBrowseBreadcrumbTemplate",Data,"JSBreadcrumbContent");
  };

  var RenderSearchBreadcrumb=function(Template,Data,Container)
  {
    console.log(Data);
    $("#JSResultsTitle").text('Search "'+Data.searchbreadcrumb[0].searchterm+'" ');

    Lib_hbsclient.RenderTemplate(Template,Data,Container);
  };

  //return functions required by the page ********************************************************************************************************************************************
  return{
    GetBreadcrumbData:GetBreadcrumbData,
    RenderBrowseBreadcrumb:RenderBrowseBreadcrumb
  };
})();

//Get the page breadcrumb
Breadcrumb.GetBreadcrumbData();
