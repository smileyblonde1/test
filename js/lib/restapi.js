//API Data =================================================================================================================================================================================
var RestAPI =(function ()
{
  //REFRESH EXPIRED USER TOKEN) ------------------------------------------------------------------------------------------------------------------------------------------------------------
  RequestTokenData=function(RequestURL,RequestMethod,CookieSessionID,CurrentTokenID,RequestSuccessCallback,RequestFailCallback)
  {
    return $.ajax({
      cache: false,
      type:RequestMethod,
      url: Global.siteNm+Global.APIDir+RequestURL,
      headers: { "Authorization": 'Bearer ' + CurrentTokenID,"X-443-Session-Key": CookieSessionID},
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      dataType: "json",
      xhrFields: {withCredentials: true},
      success: function (response) {
        //return the data to the callback
        RequestSuccessCallback(response);
      },
      error: function (xhr) {
        // handle errors
        RequestFailCallback (xhr);
      }
    });
  };

  ResetPasswordData=function(RequestSuccessCallback,RequestFailCallback,RequestjsonData)
  {
      return $.ajax({
      type:"post",
      url: Global.siteNm+Global.APIDir+"user/reset",
      contentType: "application/json; charset=utf-8",
      crossDomain: true,
      data : RequestjsonData,
      dataType: "json",
      xhrFields: {withCredentials: true},
      success: function (data) {
        RequestSuccessCallback();
      },
      error: function (status, xhr) {
        // handle errors
        RequestFailCallback();
      }
    });
  };

  //GENERAL APP DATA REQUEST (ACTIVE TOKEN REQUIRED / SIGN IN HAS AN EXCEPTION HANDLER IN THE USER TOKEN PROCESS) --------------------------------------------------------------------------
  //Get Current Token & Convert Parameters into an Array so it can be passed through to the applicable process
  var RequestData=function(RequestURL,RequestMethod,DataType,RequestSuccessCallback,RequestFailCallback,RequestNoResultsCallback,AdditionalParams,RequestjsonData)
  {
    //Get Active Token - this is ONLY updated by UserToken process
    ActiveSession=Utillities.ReadCookie("sid");
    ActiveToken= Utillities.ReadCookie("tkn");

    //Get Active Token Details
    if(RequestjsonData=="")
    {
      return $.ajax({
        cache: false,
        type:RequestMethod,
        url: Global.siteNm+Global.APIDir+RequestURL,
        headers: { "Authorization": 'Bearer ' + ActiveToken,"X-443-Session-Key": ActiveSession}, //- pass token to verify access to API
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: "json",
        xhrFields: {withCredentials: true},
        success: function (response) {
          // return the response for processing
          ParseAPIData.IdentifyProcessType(response,DataType,RequestSuccessCallback,RequestFailCallback,RequestNoResultsCallback,AdditionalParams);
        },
        error: function (xhr) {
          // handle errors
          APIError(xhr);
        }
      });
    }
    else
    {
      //If the request does require JSON in the body
      return $.ajax({
        cache: false,
        type:RequestMethod,
        url: Global.siteNm+Global.APIDir+RequestURL,
        headers: { "Authorization": 'Bearer ' + ActiveToken,"X-443-Session-Key": ActiveSession}, //- pass token to verify access to API
        contentType: "application/json; charset=utf-8",
        crossDomain: true,
        dataType: "json",
        data : RequestjsonData,
        xhrFields: {withCredentials: true},
        success: function (response) {
          // return the response for processing
          ParseAPIData.IdentifyProcessType(response,DataType,RequestSuccessCallback,RequestFailCallback,RequestNoResultsCallback,AdditionalParams);
        },
        error: function (xhr) {
          // handle errors
          APIError(xhr);
        }
      });
    }
  };

  //REQUEST STATIC JSON DATA ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  var RequestPlaceholder=function(componentID,DataType,RequestSuccessCallback,RequestFailCallback,RequestNoResultsCallback,AdditionalParams)
  {
    //0: Footer Links txt & link
    //1: Quicklinks for the menus

    var componentnm=["companyinfo","quicklinks","guestprofile"];
    $.getJSON("/data/"+componentnm[componentID]+".json", function(response) {
      ParseAPIData.IdentifyProcessType(response,DataType,RequestSuccessCallback,RequestFailCallback,RequestNoResultsCallback,AdditionalParams);
    });
  };

  //Sort orders Available ----------------------------------------------------------------------------------------------------------------------------------------------------------------
  var SortSelection=function()
  {
    var sortselected=parseInt(Validation.CleanData_NumOnly($("#JSSortBy").val()));
    var srt="";

    switch(sortselected)
    {
      case 1:
      srt="sort=price";
      break;

      case 2:
      srt="sort=price-desc";
      break;

      case 3:
      srt="sort=product_name";
      break;

      case 4:
      srt="sort=modified-desc";
      break;

      case 5:
      srt="sort=name";
      break;

      case 6:
      srt="sort=line_count-desc";
      break;

      case 7:
      srt="sort=line_count";
      break;
    }

    if(Validation.isNotDefined(srt)==false)
    {
      return "&"+srt;
    }
    else
    {
      return "";
    }
  };

  //Error ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var APIError=function(xhr,ReqDetails)
  {
    if(xhr.status==401)
    {
      //If the token has timed out - force it to refresh
      UserToken.SessionTimedOut();
    }
    else
    {
      console.error(xhr);
     // Utillities.Redirect("/somethingwentwrong");
    }
  };

  //return functions required by the page ***************************************************************************************************************************************************
  return{
    RequestTokenData:RequestTokenData,
    RequestData:RequestData,
    ResetPasswordData:ResetPasswordData,
    RequestPlaceholder:RequestPlaceholder,
    SortSelection:SortSelection,
    APIError:APIError
  };
})();
