//GET USER TOKEN ================================================================================================================================================================================
var TokenTimer;
var InitialTimestampTimeout;

var UserToken =(function ()
{
  //All pages on the site excluding Sign In and Reset Password require a token and account
  //This function is to refresh expired tokens and return to sign in on expiry of session

  //Set Cookie Variables
  var CurrentUserType           = "";
  var CurrentSessionID          = "";
  var CurrentTokenID            = "";
  var CurrentTokenIDTimestamp   = "";
  var CurrentTimeUTC            = "";

  //Set constants
  var TokenMax                 = 30 * 60 * 1000; //if the token is older than 30 mins force update

  //BROWSE AS GUEST ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetGuestToken=function()
  {
    RestAPI.RequestTokenData("user/browse","get","","",UserToken.SignInAsGuest,UserToken.SignInError);
  };

  var SignInAsGuest=function(data)
  {
    //Set the Token with Guest Sessions settings
    console.log("Guest Token Set");

    console.log(data);

    Utillities.CreateCookie("sid",data.session_key,1);
    Utillities.CreateCookie("tkn",data.token,1);
    Utillities.CreateCookie("ttm",Utillities.CookieTimeStamp(),1);

    //As a new token has been set - reset the timer
    SetTokenTimer();

    Utillities.Redirect("/");
  };

  //RETRIEVE CURRENT TOKEN SETTINGS -------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetCurrentToken=function(CallbackFn,ForceUpdate)
  {
    CurrentSessionID          = Utillities.ReadCookie("sid");
    CurrentTokenID            = Utillities.ReadCookie("tkn");
    CurrentTokenIDTimestamp   = Utillities.ReadCookie("ttm");
    CurrentTimeUTC            = Date.now();

    //There should always be a token - if thre isn't one, redirect to Sign In
    if(Validation.isNotDefined(CurrentTokenID)==true)
    {
      console.log("No Active Token");
      console.log(CurrentTokenID);
      SessionTimedOut();
    }
    else
    {
      //if there is a token - determine if it's a Guest or Authoried user
      CurrentUserType =  Utillities.GetUserType();
      switch(CurrentUserType)
      {
        //if the current token is a Guest Account
        case "Guest":
        console.log("Guest User");

        break;

        //if the current token is an Authorised Account
        case "Authorised":
        console.log("Authorised User");
        break;

        default:
        console.log("User Type Invalid");
        SessionTimedOut();
        break;
      }
    }

    CallbackFn(CurrentSessionID,CurrentTokenID,CurrentTokenIDTimestamp,CurrentUserType,CurrentTimeUTC,ForceUpdate);
  };

  //VALIDATE TOKEN ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var ValidateToken=function(CurrentSessionID,CurrentTokenID,CurrentTokenIDTimestamp,CurrentUserType,CurrentTimeUTC,ForceUpdate)
  {
    if(CurrentTimeUTC>=CurrentTokenIDTimestamp || ForceUpdate==1)
    {
      switch(CurrentUserType)
      {
        //if the current token is a Guest Account
        case "Guest":
        console.log("Guest Token Update");
        RestAPI.RequestTokenData("user/browse","get",CurrentSessionID,CurrentTokenID,UserToken.RefreshGuestUserToken,UserToken.SessionTimedOut);
        break;

        //if the current token is an Authorised Account
        case "Authorised":
        console.log("Authorised Token Update");
        RestAPI.RequestTokenData("user/refresh_token","get",CurrentSessionID,CurrentTokenID,UserToken.RefreshAuthorisedUserToken,UserToken.SessionTimedOut);
        break;
      }
    }
    else
    {
      console.log("Token Valid");
      SetTokenTimer();
    }
  };

  //UPDATE GUEST TOKEN ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var RefreshGuestUserToken=function(data)
  {
    console.log("Guest Token Refreshed");
    //set Active Cookies to Guest Version
    Utillities.CreateCookie("tkn",data.token,1);
    Utillities.CreateCookie("sid",data.session_key,1);
    Utillities.CreateCookie("ttm",Utillities.CookieTimeStamp(),1);

    //As a new token has been set - reset the timer
    SetTokenTimer();
  };

  //UPDATE AUTHORISED TOKEN -------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var RefreshAuthorisedUserToken=function(data)
  {
    //set Active Cookies to Auhorised User Version
    console.log("Authorised User Token Refreshed");

    Utillities.CreateCookie("tkn",data.new_token,1);
    //Session is not applicable on refresh for Authorised Users
    Utillities.CreateCookie("ttm",Utillities.CookieTimeStamp(),1);

    SetTokenTimer();
  };

  //After Updating the Token reset the timer as it doesn't need to update for 10mins after a change -------------------------------------------------------------------------------------------
  var SetTokenTimer=function()
  {
    //As a new token has been set - reset the timer
    console.log("Token Timer set");
    clearTimeout(InitialTimestampTimeout);

    //Validate on Page Load the Token is Valid
    var TokenExpiry=parseInt(CurrentTokenIDTimestamp-CurrentTimeUTC);
    if (TokenExpiry<0)
    {
      TokenExpiry=0;
    }

    //If the Token is valid, set the timeout to fire before the token expires
    //Initial Timeout
    if(TokenExpiry>0 && TokenExpiry<600000)
    {
      //if it's a time that's pending between 10mins in the future and now
       InitialTimestampTimeout =setTimeout(function(){console.log("Initial Timeout");UserToken.GetCurrentToken(UserToken.ValidateToken,1,"");}, TokenExpiry);
    }
    else
    {
      //if it's a number in the past default to 10mins
      InitialTimestampTimeout =setTimeout(function(){console.log("Past Timeout");UserToken.GetCurrentToken(UserToken.ValidateToken,1,"");}, TokenExpiry);
    }

    console.warn(TokenExpiry);
  };

  //SESSION EXPIRED OR API ERROR OCCURRED (UNABLE TO UPDATE TOKEN) ----------------------------------------------------------------------------------------------------------------------------
  var SessionTimedOut=function()
  {
    var PageName= $(".JSpagetype").attr("id");

    //Stop timer to Refresh Token (as the token is now invalid)
    window.clearInterval(TokenTimer);

    if(PageName!=="login"&&PageName!=="policies-and-terms")
    {
      //Clear Cookies and Return to Sign In
      Utillities.SessionExpired();
      Utillities.Redirect("/signin");
    }
  };

  //UNABLE TO SIGN IN -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var SignInError=function(xhr)
  {
    throw new Error(xhr.status+" "+xhr.responseText);
  };

  //SET TOKEN ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //Used by ad hoc functions that require token changes
  var SetToken=function(Token,Session,TimeStamp)
  {
    //Set the Cookies
    Utillities.CreateCookie("tkn",Token,1);
    Utillities.CreateCookie("sid",Session,1);
    Utillities.CreateCookie("ttm",TimeStamp,1);

    //Set the current Session information
    CookieSessionID=Token;
    CookieTokenID=Session;
    CookieTokenIDTimestamp=TimeStamp;
    CurrentTimeUTC=Date.now();
  };

  //UNABLE TO SIGN IN -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var SignOut=function()
  {
    //Sign User Out of the database
    CurrentSessionID          = Utillities.ReadCookie("sid");
    CurrentTokenID            = Utillities.ReadCookie("tkn");

    RestAPI.RequestTokenData("user/logout","POST",CurrentSessionID,CurrentTokenID,UserToken.SignOutAuthorisedUser,UserToken.SignOutAuthorisedUserError);
  };

  var SignOutAuthorisedUser=function(data)
  {
    //Reset Cookie Variables
    var CurrentUserType           = "";
    var CurrentSessionID          = "";
    var CurrentTokenID            = "";
    var CurrentTokenIDTimestamp   = "";
    var CurrentTimeUTC            = "";

    SessionTimedOut();
  };

  var SignOutAuthorisedUserError=function()
  {
    alert("Sign Out Failed - Please Try Again");
  };

  //return functions required by the page *******************************************************************************************************************************************************
  return{
    GetGuestToken:GetGuestToken,
    SignInAsGuest:SignInAsGuest,
    GetCurrentToken:GetCurrentToken,
    ValidateToken:ValidateToken,
    RefreshGuestUserToken:RefreshGuestUserToken,
    RefreshAuthorisedUserToken:RefreshAuthorisedUserToken,
    SessionTimedOut:SessionTimedOut,
    SignInError:SignInError,
    SetToken:SetToken,
    SignOut:SignOut,
    SignOutAuthorisedUser:SignOutAuthorisedUser,
    SignOutAuthorisedUserError:SignOutAuthorisedUserError
  };
})();

//IF it's not the Sign In Page - maintain an Active Token
var PageName= $(".JSpagetype").attr("id");
if(PageName!=="login")
{
  //On page load - check the token
  UserToken.GetCurrentToken(UserToken.ValidateToken,0,"");
}
