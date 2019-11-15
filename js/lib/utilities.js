//Utilities ==================================================================================================================================================================================
var Utillities=(function ()
{
  //Base64
  //GLOBAL Settings
  !function(r){for(var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="",o=[256],u=[256],e=0,a=function(r){return r.replace(/[\u0080-\u07ff]/g,function(r){var e=r.charCodeAt(0);return String.fromCharCode(192|e>>6,128|63&e)}).replace(/[\u0800-\uffff]/g,function(r){var e=r.charCodeAt(0);return String.fromCharCode(224|e>>12,128|e>>6&63,128|63&e)})},f=function(r){return r.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,function(r){var e=(15&r.charCodeAt(0))<<12|(63&r.charCodeAt(1))<<6|63&r.charCodeAt(2);return String.fromCharCode(e)}).replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,function(r){var e=(31&r.charCodeAt(0))<<6|63&r.charCodeAt(1);return String.fromCharCode(e)})};e<256;){var c=String.fromCharCode(e);t+=c,u[e]=e,o[e]=n.indexOf(c),++e}function i(r,e,n,t,o,u){for(var a=0,f=0,c=(r=String(r)).length,i="",d=0;f<c;){var h=r.charCodeAt(f);for(a=(a<<o)+(h=h<256?n[h]:-1),d+=o;u<=d;){var C=a>>(d-=u);i+=t.charAt(C),a^=C<<d}++f}return!e&&0<d&&(i+=t.charAt(a<<u-d)),i}var d=r.base64=function(r,e,n){return e?d[r](e,n):r?null:this};d.btoa=d.encode=function(r,e){return(r=i(r=!1===d.raw||d.utf8encode||e?a(r):r,!1,u,n,8,6))+"====".slice(r.length%4||4)},d.atob=d.decode=function(r,e){for(var n=(r=String(r).split("=")).length;r[--n]=i(r[n],!0,o,t,6,8),0<n;);return r=r.join(""),!1===d.raw||d.utf8decode||e?f(r):r}}(jQuery);

    //Set Cookie ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var CreateCookie=function(cname, cvalue, exdays)
    {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;secure;SameSite=strict;";
    };

    //Get Cookie ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var ReadCookie=function(cname)
    {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return null;
    };

    //Delete Cookie ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var DeleteCookie=function(cname)
    {
        document.cookie = cname+'="";expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;secure;SameSite=strict;';
    };

    //Get Active Account from a list ----------------------------------------------------------------------------------------------------------------------------------------------------------
    var GetActiveAccount=function(AccountList)
    {
      var selectedAcc="";
      $.each(AccountList, function (i, val) {
      if(AccountList[i].active==true)
      {
        selectedAcc=JSON.stringify(val);
      }
      });

      return JSON.parse('{"selectedaccount":['+selectedAcc+']}');
    };

    //Type of user ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var GetUserType=function()
    {
      var userToken=Utillities.ReadCookie("tkn");

      if(Validation.isNotDefined(userToken)==false)
      {
        var nau=($.base64('decode',userToken.substring(userToken.indexOf("\.")+1,userToken.lastIndexOf("\.")))).toString();
        if(nau.indexOf("nau")>0 )
        {
          UserType="Guest";
        }
        else {
          UserType="Authorised";
        }
      }
      else
      {
        UserType=undefined;
      }

      return UserType;
    };

    var GetAccountType=function()
    {
      return "Approval";
    };

    //If the session has expired or a user logs out - clear the cookies -----------------------------------------------------------------------------------------------------------------------
    var SessionExpired=function()
    {
      Utillities.DeleteCookie("sid");
      Utillities.DeleteCookie("tkn");
      Utillities.DeleteCookie("ttm");
      Utillities.DeleteCookie("stm");
    };

    //Generate current UTC Timestamp ----------------------------------------------------------------------------------------------------------------------------------------------------------
    var Timestamp=function()
    {
      var now = new Date();
      var utc_timestamp = Date.UTC(now.getFullYear(),now.getMonth(), now.getDate() ,
            now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

      return utc_timestamp;
    };

    //Generate UTC Timestamp + 10min for cookie -----------------------------------------------------------------------------------------------------------------------------------------------
    var CookieTimeStamp=function()
    {
      var cookie_utc_timestamp = Date.now()+720000;

      return cookie_utc_timestamp;
    };

    //Get a parameter from the current URL (expects parameter name to be passed in - i.e "term") ----------------------------------------------------------------------------------------------
    var GetUrlParameter=function(urlparam)
    {
      urlparam = urlparam.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + urlparam + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    var getURLID=function()
    {
      //Get information from URL on Type of page and ID/ search term & filter to use ------------------------
      var _currentUrl=String(window.location.href);

      if (_currentUrl.indexOf("#")>0)
      {
        {_currentUrl=_currentUrl.substring(0,_currentUrl.indexOf("#"));}
      }

      if (_currentUrl.indexOf("?")>0)
      {
        {_currentUrl=_currentUrl.substring(0,_currentUrl.indexOf("?"));}
      }
       return parseInt(_currentUrl.substring(_currentUrl.indexOf("/_/")+3,_currentUrl.length));
    };

    var getProdID=function(ElementID)
    {
      //Get product Row ID from an element ------------------------
      return parseInt(ElementID.substring(ElementID.lastIndexOf("_")+1,ElementID.length));
    };

    //Back button -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var GoBackToPreviousView=function()
    {
      window.history.back();
    };

    //Toggle Class ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var ToggleClass=function(elemtnm,classnm,type)
    {
      elemtnm=Validation.ValidateParamValue(elemtnm,3);
      classnm=Validation.ValidateParamValue(classnm,3);
      type=Validation.ValidateParamValue(type,2);

      if (elemtnm.substr(0,1)=="#")
      {
        //If the element is an ID
        switch(type)
        {
          //Add a class if it's not already there
          case 1:
          if(!$(elemtnm).hasClass(classnm))
          {
            $(elemtnm).addClass(classnm);

            //temporary need display none out of individual css elements - hide class to be used instead.
            if(classnm=="hide")
            {
              $(elemtnm).hide();
            }
          }
          break;

          //Remove a class if it's there
          case 2:
          if($(elemtnm).hasClass(classnm))
          {
            $(elemtnm).removeClass(classnm);

            if(classnm=="hide")
            {
              $(elemtnm).show();
            }
          }
          break;
        }
      }
      else
      {
        //If the element is a CLASS
        $(elemtnm).each(function(){
        switch(type)
        {
          //Add a class if it's not already there
          case 1:
          if(!$(this).hasClass(classnm))
          {
            $(this).addClass(classnm);

            //temporary need display none out of individual css elements - hide class to be used instead.
            if(classnm=="hide")
            {
              $(this).hide();
            }
          }
          break;

          //Remove a class if it's there
          case 2:
          if($(this).hasClass(classnm))
          {
            $(this).removeClass(classnm);

            if(classnm=="hide")
            {
              $(this).show();
            }
          }
          break;
        }
        });
      }
    };

    //Toggle Class ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var SwapClass=function(elemtnm,classnmfrom,classnmto)
    {
      elemtnm=Validation.ValidateParamValue(elemtnm,3);
      classnmfrom=Validation.ValidateParamValue(classnmfrom,3);
      classnmto=Validation.ValidateParamValue(classnmto,3);

      if(classnmfrom=="hide")
      {
        $(elemtnm).show();
      }
      if(classnmto=="hide")
      {
        $(elemtnm).hide();
      }

      if($(elemtnm).hasClass(classnmfrom))
        {
          $(elemtnm).removeClass(classnmfrom);

          if(!$(elemtnm).hasClass(classnmto))
          {
           $(elemtnm).addClass(classnmto);
          }
        }
    };

    //Fade Out Element ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var hideElemt=function(elemtName)
    {
      $(elemtName).fadeOut();
    };

    //Set Page Product Count ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var UpdateProductCount=function(prodcount,type)
    {
      var countr=0;

      if(type==1)
      {
        countr=Validation.CleanData_NumOnly(prodcount);
        if(countr!==null)
        {
          $("#JSPageProductCount").text(countr);
        }
      }
      else
      {
        countr=parseInt($("#JSPageProductCount").text());
        if(countr!==null)
        {
          if(countr-1>0)
          {
            $("#JSPageProductCount").text(countr-1);
          }
          else
          {
            $("#JSPageProductCount").text(0);
          }
        }

        AccountNavigation.GetOrderTotal();
      }
    };

    //Redirect URL ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var Redirect=function(urlpath)
    {
      window.location.href=urlpath;
    };

    //SLUGIFY A URL ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
      //makes the URL string like-this-in-the-code-returned
      //expects string for conversion

      var slugify=function(urlstr) {
        if(Validation.isNotDefined(urlstr)==false)
        {
          return urlstr.toString().trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
        }
        else
        {
          return "";
        }
      };

      var unslug=function(urlstr) {
        if(Validation.isNotDefined(urlstr)==false)
        {
        return urlstr.replace(/-/g, " ");
      }
      else
      {
        return "";
      }
      };

    //Encoding -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //HEX ENCODE String
    var convertToHex=function(param)
    {
      var conversionstr=param;
      var result = "";
        for (i=0; i<conversionstr.length; i++) {
            hex = conversionstr.charCodeAt(i).toString(16);
            result += ("000"+hex).slice(-4);
        }
        return result;
      };

    var convertFromHex=function(s)
    {
      var escaped = "";
      var hex = "";
      if(s.length%4 > 0) {
        for (i = 0; i < (4 - (s.length % 4)); i++) {
          hex += "0";
        }
      }
      hex += s;
      for (var i = 0; i < hex.length; i += 4) {
        escaped += "%u" + hex.charAt(i) + hex.charAt(i + 1) + hex.charAt(i + 2) + hex.charAt(i + 3);
      }
      return unescape(escaped).split(unescape("%00")).join("");
  };

    //Convert price into currency format -----------------------------------------------------------------------------------------------------------------------------------------------------
    var formatPrice=function(RawPrice)
    {
      var newprice="0.00";
      if(RawPrice!==0)
      {
        newprice=(parseFloat(RawPrice)/100).toFixed(2);
      }

      return newprice.toString();
    };

    //Parse Date Format ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var  parseUTCDateFormat=function(isoDt,type)
    {
      var d = new Date(isoDt);
      var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var dateString="";

      switch(type)
      {
        case 1:
          //Set user visible value
          dateString=days[d.getUTCDay()]+" "+d.getUTCDate()+" "+months[d.getUTCMonth()]+" "+d.getUTCFullYear();
          break;

        case 2:
          //Set filename date value [DayMonthDDYYYY]
          dateString=days[d.getUTCDay()]+months[d.getUTCMonth()]+d.getUTCFullYear();
          break;

        default:
          //Set Selected Value for Json
          var currentDay = d.getUTCDate();
          if (currentDay < 10) {currentDay = '0' + d.getUTCDate();}

          var FixMonth = parseInt(d.getUTCMonth())+1;
          if (FixMonth < 10)
          {
            currentMonth = '0' + parseInt(FixMonth);
          }
          else
          {
            currentMonth=FixMonth;
          }

          dateString=d.getUTCFullYear()+"-"+currentMonth+"-"+currentDay;
      }

      return dateString;
    };

    //Grammar correction for line(s) etc -----------------------------------------------------------------------------------------------------------------------------------------------------
    var GrammarCorrect=function(noOfItems)
    {
      var grammarfix="";
      if(noOfItems!==1)
      {
        grammarfix="s";
      }

      return grammarfix;
    };

    var Toaster=function(TMsg,Msgtype)
    {
      var bar;

      switch(Msgtype)
      {
        case 1:
          //Error
          bar = new $.peekABar({
          cssClass: 'toast-error',
          position: 'bottom',
          html: TMsg,
          autohide: true
        });
        break;

        case 2:
          //warning
          bar = new $.peekABar({
          cssClass: 'toast-warning',
          position: 'bottom',
          html: TMsg,
          autohide: true
        });
        break;

        default:
          //Success
          bar = new $.peekABar({
          cssClass: 'toast-success',
          position: 'bottom',
          html: TMsg,
          autohide: true
        });
        break;
      }

      bar.show();
    };

    var OrderFilename=function(SelectedAccountCode)
    {
      var accountCd=Validation.CleanData_GeneralTxtOnly(SelectedAccountCode);
      return accountCd+"_order_"+parseUTCDateFormat(Date.now(),2)+"_file".replace(" ","_");
    };

    //Page Dimensions ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var GetPageWidth=function() {
      return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
      );
    };

    var GetPageHeight=function() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
      );
    };

    //Modal Stages -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

      var ModalStatus=function(ModalName,ModalStatus)
      {
        //Hide all sections
        ToggleClass("#"+ModalName+"_Question","hide",1);
        ToggleClass("#"+ModalName+"_Success","hide",1);
        ToggleClass("#"+ModalName+"_Fail","hide",1);

        //Show Applicable section ONLY
        switch(ModalStatus)
        {
          case 0:
          ToggleClass("#"+ModalName+"_Question","hide",2);
          break;

          case 1:
          ToggleClass("#"+ModalName+"_Success","hide",2);
          break;

          case 2:
          ToggleClass("#"+ModalName+"_Fail","hide",2);
          break;
        }
      };

      var CloseAllModals=function()
      {
        $(".is-open").each(function() {
            MicroModal.close($(this).attr("id"));
        });
      };

    //Page Bindings -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var PageUtilities=function()
    {
      //Go Back to a previous page
      $("body").on("click",".JSGoBack",function(e)
      {
        e.preventDefault(); //Some elements are in a form - this is to stop them overriding the below command
        GoBackToPreviousView();
      });
    };

    // GENERATE PDF -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    GeneratePDF=function(title,ContentTableName,filenm)
    {
      var doc = new jsPDF('l', 'pt');

      doc.setFontSize(18);
      doc.text(title, 40, 50);

      var elem = document.getElementById(ContentTableName);
      var res = doc.autoTableHtmlToJson(elem);
      doc.autoTable(res.columns, res.data, {startY: 65});

      doc.save(filenm);
    };

    //Distance from right margin ----------------------------------------------------------------------------------------------------------------------------------------------------------
    //Account Sub Menu Direction (Left or Right side)
    var DistanceFromRight=function(elemtID,elemtWidth)
    {
      return $(window).width() - ($('#'+elemtID).offset().left + $('#'+elemtID).width());
    };

    //Requestor Approver accounts --------------------------------------------------------------------------------------------------------------------------------------------------------
    var UserSubType=function(type)
    {
      var Uattribt=ReadCookie("ASelct");
      var retval ="";

      if(Validation.isNotDefined(Uattribt)==false)
      {
        var AtrNo=Uattribt.split(",");
        switch(type)
        {
          case 1:
          //Has Approvals
          retval=AtrNo[0];
          break;

          case 2:
          //Can Order
          retval=AtrNo[1];
          break;

          case 3:
          //Orders Outstanding
          retval=AtrNo[3];
          break;

          case 4:
          //Type of Account
          if(AtrNo[0]=="true" && AtrNo[1]=="true")
          {
            retval="Approver";
          }
          if(AtrNo[0]=="true" && AtrNo[1]=="false")
          {
            retval="Requestor";
          }
          if(AtrNo[0]=="false" && AtrNo[1]=="true")
          {
            retval="Not Split";
          }
          break;
        }
      }

      return retval;
    };

  //Return functions to operate page callbacks etc. :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  return{
    CreateCookie:CreateCookie,
    ReadCookie:ReadCookie,
    DeleteCookie:DeleteCookie,
    GetUserType:GetUserType,
    GetUrlParameter:GetUrlParameter,
    getURLID:getURLID,
    getProdID:getProdID,
    Timestamp:Timestamp,
    CookieTimeStamp:CookieTimeStamp,
    ToggleClass:ToggleClass,
    SwapClass:SwapClass,
    slugify:slugify,
    unslug:unslug,
    Redirect:Redirect,
    PageUtilities:PageUtilities,
    convertToHex:convertToHex,
    convertFromHex:convertFromHex,
    hideElemt:hideElemt,
    formatPrice:formatPrice,
    parseUTCDateFormat:parseUTCDateFormat,
    GrammarCorrect:GrammarCorrect,
    OrderFilename:OrderFilename,
    Toaster:Toaster,
    GetPageWidth:GetPageWidth,
    GetPageHeight:GetPageHeight,
    SessionExpired:SessionExpired,
    GetActiveAccount:GetActiveAccount,
    GeneratePDF:GeneratePDF,
    ModalStatus:ModalStatus,
    CloseAllModals:CloseAllModals,
    UpdateProductCount:UpdateProductCount,
    GetAccountType:GetAccountType,
    DistanceFromRight:DistanceFromRight,
    UserSubType:UserSubType
  };
})();

Utillities.PageUtilities();
