//SIGN IN PAGE ===================================================================================================================================================================
var SignIn =(function ()
{
  var HasLoggedIn="";

  //LOAD PAGE --------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //setup page
    var init=function()
    {
      ResetSignInPanels();
      PageBindings();

      //Remember Business Login name
      var bclogin=Utillities.ReadCookie("bc");
      if(Validation.isNotDefined(bclogin)==false)
      {
        $("#JSSignIn_BusinessCode").val(bclogin);
      }
    };

  //REGISTER --------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //Register
    var ShowRegistrationPanel=function()
    {
      animateLoginPanel("#JSSignInLoginForm","#JSRegisterAdvice",1);
    };

  //SIGN IN ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //Sign In
    var SignInUser=function()
    {
      //Clear Previous Tokens and error text
      Utillities.SessionExpired();
      $("#ErrorText").text("");

      //if any value is invalid, the value will be returned as "" (empty string)
      var userlogin_BusinessCode=Validation.CleanData_GeneralTxtOnly($("#JSSignIn_BusinessCode").val());
      var userlogin_Username=Validation.CleanData_GeneralTxtOnly($("#JSSignIn_Username").val());
      var userlogin_Password=$.base64('encode',$('#JSSignIn_Password').val().replace(/^[ ]+|[ ]+$/g,''));

      //If input is valid continue
      if (userlogin_BusinessCode!=="" && userlogin_Username!=="" && userlogin_Password!=="")
      {
        //set the business code to be remembered for next login
        //this is to make mobile login easier
        Utillities.CreateCookie("bc",userlogin_BusinessCode,2030);

        var customer = '{"customer_code":"'+userlogin_BusinessCode+'","username":"'+userlogin_Username+'","password":"'+userlogin_Password+'"}';
        RestAPI.RequestData("user/login","post","SignInAccounts",SignIn.SignIn_SelectAccount,SignIn.SignIn_NotAuthorised,SignIn.SignIn_NotAuthorised,"",customer);
      }
      else
      {//If input is invalid feeback to the user what the issue is
        if (userlogin_BusinessCode!=="")
        {
          $("#ErrorText").text("Invalid Business Code");
        }

        if (userlogin_Username!=="")
        {
          $("#ErrorText").text("Invalid Username");
        }

        if (userlogin_Password!=="")
        {
          $("#ErrorText").text("Invalid Password");
        }
      }
    };

    //Sign in Fail
    var SignIn_NotAuthorised=function()
    {
      $("#ErrorText").text("Incorrect Details");
    };

    //Sign In Success - Get Account Selection
    var SignIn_SelectAccount=function(firstlogin,data)
    {
      //If the user has logged in before set HasLoggedIn
      HasLoggedIn=firstlogin;

      //Show the Account List - if there's more than 1 account
      if(Validation.isNotDefined(data)==false)
      {

        console.log(data);

        $("#JSSignInAccountChoice").empty();

        //Disable the Continue Button
        Utillities.ToggleClass("#JSAccountSelectContinue","disabled",1);
        Utillities.ToggleClass("#JSAccountSelectContinue","active",2);

        //Populate the template in the HTML document
        Lib_hbsclient.RenderTemplate("JSAccountSelectTemplate",data,"JSSignInAccountChoice");

        animateLoginPanel("#JSSignInLoginForm","#JSSelectAccount",1);
      }
      else
      {
        SignIn_CheckFirstLogin(HasLoggedIn);
      }
    };

    // Onclick: Account selected - highlight it and enable continue button ------------------------------------------
    var SignIn_AccountSelected=function(accID)
    {
      //EVENT: select account and enable continue button if more than 1 account to choose from
      Utillities.ToggleClass(".JSSignInAccountSelect","activeAccount",2);
      Utillities.ToggleClass("#"+accID,"activeAccount",1);

      //Enable the Continue Button
      Utillities.SwapClass("#JSAccountSelectContinue","disabled","active");
    };

    // Onclick: Account selected clicked continue -------------------------------------------------------------------
    var SignIn_AccountSelectedContinue=function()
    {
      //onclick of the sign in button
      //hide the login form, submit to the API and get the accounts / results back and change the back button action
      if ($(".JSSignInAccountSelect").hasClass("activeAccount"))
      {
        var accountNo=parseInt(($(".activeAccount").attr("id")).replace("JSAcc_",""));
        var account='{"account_id":'+accountNo+'}';

        RestAPI.RequestData("user/set_account","post","SignInAccountSelected",SignIn.SignIn_CheckFirstLogin,SignIn.SignIn_AccountSelectionFailed,SignIn.SignIn_AccountSelectionFailed,HasLoggedIn,account);
      }
    };

    var SignIn_AccountSelectionFailed=function()
    {
      Utillities.Toaster("Account select failed",1);
    };

    //Check if it's the user's first login
    var SignIn_CheckFirstLogin=function()
    {
      console.log(HasLoggedIn);
      //if it is the first login - direct to privacy
      if(HasLoggedIn==true || Validation.isNotDefined(HasLoggedIn)==true)
      {
        SignIn_Privacy();
      }
      else
      {
        //if it's not the first login - direct to home page
        Utillities.Redirect("/");
      }
    };

    //Privacy
    var SignIn_Privacy=function()
    {
      Utillities.ToggleClass("#JSSignInLoginForm","hide",1);
      Utillities.ToggleClass("#JSSelectAccount","hide",1);
      Utillities.ToggleClass("#JSprivacyStatement","hide",2);

      //Accept All Button
      //Customise Button
    };

    var GetCurrentPrivacySettings=function(callback)
    {
      RestAPI.RequestData("user/preferences","get","",callback,SignIn.SignIn_PrivacyFailedRetry,SignIn.SignIn_PrivacyFailedRetry,HasLoggedIn,"");
    };

    //On click 'Accept all' on privacy page
    var SignIn_PrivacyAcceptAll=function(data,HasLoggedIn)
    {
      var chkboxArray=[true,true,true,true];
      var setpreferences='{"contact_email":"'+data.contact_email+'","customer_name":"'+data.customer_name+'","display_name":"'+data.display_name+'","full_name":"'+data.full_name+'","privacy_1":'+chkboxArray[0]+',"privacy_2":'+chkboxArray[1]+',"privacy_3":'+chkboxArray[2]+',"privacy_4":'+chkboxArray[3]+'}';
      RestAPI.RequestData("user/preferences","put","",SignIn.SignIn_Onboarding,SignIn.SignIn_PrivacyFailedRetry,SignIn.SignIn_PrivacyFailedRetry,HasLoggedIn,setpreferences);
    };

    //On click Customise
    var PrivacyCustomiseView=function()
    {
      Utillities.ToggleClass("#JSprivacyStatement","hide",1);
      Utillities.ToggleClass("#JScustomPrivacy","hide",2);

      //Continue
    };

    var SignIn_PrivacyCustom=function(data,HasLoggedIn)
    {
      var chkboxArray=[true,true,true,true];
      var setpreferences='{"contact_email":"'+data.contact_email+'","customer_name":"'+data.customer_name+'","display_name":"'+data.display_name+'","full_name":"'+data.full_name+'","privacy_1":'+chkboxArray[0]+',"privacy_2":'+chkboxArray[1]+',"privacy_3":'+chkboxArray[2]+',"privacy_4":'+chkboxArray[3]+'}';
      RestAPI.RequestData("user/preferences","put","",SignIn.SignIn_Onboarding,SignIn.SignIn_PrivacyFailedRetry,SignIn.SignIn_PrivacyFailedRetry,HasLoggedIn,setpreferences);
    };

    //Pricavy setting failed - show error
    var SignIn_PrivacyFailedRetry=function()
    {
      console.log("Privacy settings failed");
    };

    //Onboarding
    var SignIn_Onboarding=function()
    {
      backToWideView();

      Utillities.ToggleClass("#JScustomPrivacy","hide",1);
      Utillities.ToggleClass("#JSprivacyStatement","hide",1);


      setTimeout(function(){
        Lib_Carousels.OnboardingSliderInit("JSOnboardingCarouselContent");
      Utillities.ToggleClass("#JSOnboarding","hide",2);
    }, 600);
    };



  //NEED HELP -------------------------------------------------------------------------------------------------------------------------------------------------------------------
  //Need Help
  var NeedHelp=function()
  {
    $("#JSResetPassSubmit").addClass("disabled");
    //carry over company name and user name (If completed)
    $("#JSSignIn_BusinessCodeForgotPassword").val($("#JSSignIn_BusinessCode").val());
    $("#JSSignIn_UsernameForgotPassword").val($("#JSSignIn_Username").val());

    animateLoginPanel("#JSSignInLoginForm","#JSforgotPassword",1);

    NeedHelp_ValidateForgottenInput();
  };

  //Validate Input
  var NeedHelp_ValidateForgottenInput=function()
  {
    //if values are valid enable button / else disable it
    if($("#JSSignIn_BusinessCodeForgotPassword").val()!=="" && $("#JSSignIn_UsernameForgotPassword").val()!=="")
    {
      //enable LOGIN
      $("#JSResetPassSubmit").removeClass("disabled");
    }
    else
    {
      //disable LOGIN
      $("#JSResetPassSubmit").addClass("disabled");
    }
  };

  //Send Email
  var NeedHelp_EmailPassword=function()
  {
    var RecoveryBusinessCode=Validation.CleanData_GeneralTxtOnly($("#JSSignIn_BusinessCodeForgotPassword").val());
    var RecoveryUsername=Validation.CleanData_GeneralTxtOnly($("#JSSignIn_UsernameForgotPassword").val());

    if(Validation.isNotDefined(RecoveryBusinessCode)==false && Validation.isNotDefined(RecoveryUsername)==false)
    {
      //send password request - if it's not a valid account they just won't get an email
      var resetCustomer = '{"customer_code":"'+RecoveryBusinessCode+'","username":"'+RecoveryUsername+'"}';
      RestAPI.RequestData("user/help","post","",SignIn.NeedHelp_PasswordReset,SignIn.NeedHelp_PasswordReset,SignIn.NeedHelp_PasswordReset,"",resetCustomer);
    }
  };

  //Password Reset Confirmation
  var NeedHelp_PasswordReset=function()
  {
    animateLoginPanel("#JSforgotPassword","#JSforgotPasswordRequest",0);
  };

  var animateLoginPanel=function(fadeView,showView,shrink)
  {
    Utillities.ToggleClass(fadeView,"hide",1);
    Utillities.ToggleClass("#historyback","hide",1);

    if(shrink==1)
    {
      w=Utillities.GetPageWidth();

      if(w>1024)
      {
        $("#JSSignInPanel").animate({"width": '+=-600px',"margin-left":'+=300px'}, "slow");
      }
    }

    //view to show - remove hide class, and use fade to fade the block into view
    Utillities.SwapClass(showView,"hide","fade");
    Utillities.SwapClass("#animationback","hide","fade");
  };

  var backToWideView=function(viewPage)
  {
    ResetSignInPanels();
    //IF DESKTOP increase the panel width
    //if the width is resized get the new value width

    w=Utillities.GetPageWidth();
    if(w>1024 && $("#JSSignInPanel").width()<950)
    {
      $("#JSSignInPanel").animate({"width": '+=600px',"margin-left":'+=-300px'}, "slow");
    }

    //show the Login menu with the centered logo
    if(viewPage!="#Onboarding")
    {
      Utillities.SwapClass("#historyback","hide","fade");
    }

    Utillities.SwapClass("#animationback","fade","hide");
    Utillities.SwapClass(viewPage,"hide","fade");
  };

  var ResetSignInPanels=function()
  {
    Utillities.ToggleClass("#SignInAccountSelect","hide",1);
    Utillities.ToggleClass("#JSforgotPassword","hide",1);
    Utillities.ToggleClass("#SignInForgotPassword","hide",1);
    Utillities.ToggleClass("#SignInRecoverySent","hide",1);
    Utillities.ToggleClass("#JSRegisterAdvice","hide",1);
    Utillities.ToggleClass("#SignInPasswordReset","hide",1);
    Utillities.ToggleClass("#JSforgotPasswordRequest","hide",1);
    Utillities.ToggleClass("#JSSelectAccount","hide",1);
    Utillities.ToggleClass("#JSprivacyStatement","hide",1);
    Utillities.ToggleClass("#JScustomPrivacy","hide",1);
    Utillities.ToggleClass("#JSOnboarding","hide",1);
    Utillities.SwapClass("#animationback","fade","hide");
    $(".errortxt").text("");
  };

  //PAGE BINDINGS ---------------------------------------------------------------------------------------------------------------------------------------------------------------
  var PageBindings=function()
  {
    //Register Button
    $("body").on("click",".JSHowToRegister",function()
    {
      ShowRegistrationPanel();
    });

    //Sign In Button
    $("body").on("click",".JSSignIn",function(e)
    {
      //prevent the form submitting - it's not required
      e.preventDefault();
      SignInUser();
    });

    //Need Help Link
    $("body").on("click",".JSGuestAccess",function(e)
    {
      //prevent the # submitting to the URL
      //it interfere's with the back button
      e.preventDefault();

      //Force a Guest Token and continue to the homepage
      UserToken.GetGuestToken();
    });


    //Need Help Link
    $("body").on("click",".JSNeedHelp",function(e)
    {
      //prevent the # submitting to the URL
      //it interfere's with the back button
      e.preventDefault();
      NeedHelp();
    });

    //On change of input - validated automatically by Validation process, decide if button should be active or disabled
    $("#JSSignIn_BusinessCodeForgotPassword, #JSSignIn_UsernameForgotPassword").on("keydown paste change blur mouseout", function (e) {NeedHelp_ValidateForgottenInput();});

    //submit Password reset
    $("#JSResetPassSubmit").on("click", function (e) {
      NeedHelp_EmailPassword();
    });

    $("#JSReturnToSignIn").on("click",function(){backToWideView("#JSSignInLoginForm");});

    //return to Sign in from sub page
    $("body").on("click","#animationback",function(e)
    {
      //prevent the # submitting to the URL
      //it interfere's with the back button
      e.preventDefault();
      backToWideView("#JSSignInLoginForm");
    });

    $('#historyback').on('click',function (e)
    {
      e.preventDefault();
      window.history.back();
    });

    $('body').on('click','#JSAccountSelectContinue',function (e) {SignIn_AccountSelectedContinue();});

    $('body').on('click', '.JSSignInAccountSelect',function (e) {SignIn_AccountSelected($(this).attr("id"));});

    //Privacy
    //Accept all
    $('body').on('click', '#PrivacyAcceptAll',function (e)
    {
      GetCurrentPrivacySettings(SignIn.SignIn_PrivacyAcceptAll);
    });

    $('body').on('click', '#PrivacyCustomise',function (e) {
     PrivacyCustomiseView();
    });

    $('body').on('click', '#onBoardingNext',function (e){
      $("#JSOnboardingCarouselContent").slick('slickNext');
    });
};


  //return functions required by the page ***************************************************************************************************************************************
  return{
    init:init,
    NeedHelp_PasswordReset:NeedHelp_PasswordReset,
    SignIn_NotAuthorised:SignIn_NotAuthorised,
    SignIn_CheckFirstLogin:SignIn_CheckFirstLogin,
    SignIn_SelectAccount:SignIn_SelectAccount,
    SignIn_AccountSelectionFailed:SignIn_AccountSelectionFailed,
    SignIn_PrivacyAcceptAll:SignIn_PrivacyAcceptAll,
    SignIn_PrivacyFailedRetry:SignIn_PrivacyFailedRetry,
    SignIn_Onboarding:SignIn_Onboarding
  };
})();

SignIn.init();
