//Validate input ========================================================================================================================
var Validation=(function ()
{
  //Determine if a parameter is empty --------------------------------------------------------------------------------------------------
  var isNotDefined=function(param)
  {
    if(param==null || param=="" || param==undefined || param=="null" || param=="undefined")
    {
      return true;
    }
    else
    {
      return false;
    }
  };

  //Determine if a JSON array is empty --------------------------------------------------------------------------------------------------
  var ArrayisEmpty=function(arrayNm) {
     for(var i in arrayNm) {
         return false;
     }
     return true;
  };

  //Clean General input -------------------------------------------------------------------------------------------------------------------
  var CleanData_GeneralTxtOnly=function(param)
  {
    if(isNotDefined(param)==false)
    {
      return param.replace(/[^A-Za-z0-9&\._ \,]+/gi, "");
    }
    else
    {
      return "";
    }
  };

  //Clean text input -------------------------------------------------------------------------------------------------------------------
  var CleanData_TxtOnly=function(param)
  {
    if(isNotDefined(param)==false)
    {
      return param.replace(/[^A-Za-z0-9 ]+/gi, "");
    }
    else
    {
      return "";
    }
  };

  //Clean numeric input -------------------------------------------------------------------------------------------------------------------
  var CleanData_NumOnly=function(param)
  {
    if(!isNaN(param))
    {
      return param;
    }
    else
    {
      return null;
    }
  };

  //Keypress validation (some symbols allowed) -----------------------------------------------------------------------------------------
  var BlockInvalidKeys=function(keyref,expectedkeytype)
  {
    var matchstring="";

    switch(expectedkeytype)
    {
      case 1:
      //General Text - Restricted use of symbols
      matchstring="^[A-Za-z0-9\*\_\&\-\,\@\.\'\(\) ]+$";
      break;

      case 2:
      //Only Text and whitespace
      matchstring="^[A-Za-z ]+$";
      break;

      case 3:
      //Only Text and whitespace
      matchstring="^[0-9]+$";
      break;
    }

    var r = new RegExp(matchstring),
    t = String.fromCharCode(keyref.charCode ? keyref.charCode : keyref.which);
    return !(!r.test(t) && 13 != keyref.which && 10 != keyref.which && (keyref.preventDefault(), 1));
  };

  //Validate the format of a value -----------------------------------------------------------------------------------------------------
  var ValidateParamValue=function(param,matchType)
  {
    //Make sure there's nothing dodgy in the input, that might be an attack on this regexp
    var Checkval=param;

    var RegMatch;

    //TYPE 1 : a-z and A-Z valid
    var alphaValid = /^[a-z]+$/i;

    //TYPE 2 : 0-9 integer valid
    var numValid = /^[0-9]*$/;

    //TYPE 3 : a-z, A-Z, 0-9, _
    var AlphaNumValid = /^[A-Za-z0-9\*\_\&\-\,\@\.\'\(\)\# ]*$/;

    //TYPE 4 : a-z, A-Z, 0-9, @ . etc.. (hard to validate as it could have anything in it)
    var emailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //TYPE 5 : JSON Validator
    var jsonValid = /[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/;

    //TYPE 6 : url
    var urlValid=/^[^\/]+\/[^\/].*$|^\/[^\/].*$/gmi;

    //TYPE 7 : method
    var methodValid=["get","post","put","patch","delete"];

    //TYPE 8 : is a function


    var match=false;

    if(isNotDefined(Checkval)==false)
    {
      switch (matchType)
      {
        case 1:
        //Match letters only
        if (alphaValid.test(Checkval))
        {
          match=true;
        }
        break;

        case 2:
        //match integer only
        if (!isNaN(parseInt(Checkval)))
        {
          match=true;
        }
        break;

        case 3:
        //match valid alphanumeric
        //Check if string is valid
        if (AlphaNumValid.test(Checkval))
        {
          match=true;
        }
        break;

        case 4:
        //match email
        if (emailValid.test(Checkval))
        {
          match=true;
        }
        break;

        case 5:
        //match JSON
        if (jsonValid.test(Checkval))
        {
          try {
            JSON.parse(e);
          } catch (e) {
            //failed to parse as JSON
          }
          //Matched JSON format
          match=true;
        }
        break;

        case 6:
        //match URL
        if (urlValid.test(Checkval))
        {
          match=true;
        }
        break;

        case 7:
        //match URL
        for (i = 0; i < methodValid.length; i++)
        {
          if(methodValid[i]==Checkval)
          {
            match=true;
          }
        }
        break;

        case 8:
        //match URL
        if(typeof Checkval === "function")
        {
          match=true;
        }
        break;

      }
      if(match==true)
      {
        return Checkval;
      }
      else
      {
        var mchT=["","letters","numbers","letters and numbers","email addresses","json responses","hyperlinks","methods","Arrays"];
        console.log("Fail matching "+Checkval+" ,invalid "+mchT[matchType]);
        return "";
      }
    }
    else {
      //console.log("No parameter entered to check :"+Checkval);
      return "";
    }
  };

  //Bind Actions to classes -------------------------------------------------------------------------------------------------------------
  var ValidationActions=function()
  {
    //ALL input - validation to make sure nothin dodgy is accepted in an input
    //can't over-ride in console log
    $("body").on("keypress","input",function(e)
    {
      Validation.BlockInvalidKeys(e,1);
    });

    //Clear invalid characters from pasted or changed password input
    $("body").on("paste,change","input",function()
    {
      Validation.ValidateParamValue($(this).val(),1);
    });

    //Class based - could be removed in console but, mainly covered by above
    //Text Only match
    //Block invalid characters in the password field
    $("body").on("keypress",".JSfltrT",function(e)
    {
      Validation.BlockInvalidKeys(e,2);
    });

    //Clear invalid characters from pasted or changed password input
    $("body").on("paste,change",".JSfltrT",function()
    {
      Validation.ValidateParamValue($(this).val(),2);
    });

    //Numeric Only
    //Block invalid characters in the password field
    $("body").on("keypress",".JSfltrN",function(e)
    {
      Validation.BlockInvalidKeys(e,3);
    });

    //Clear invalid characters from pasted or changed password input
    $("body").on("paste,change",".JSfltrN",function()
    {
      Validation.ValidateParamValue($(this).val(),3);
    });

    //email
    //Clear invalid characters from pasted or changed password input
    $("body").on("paste,change",".JSfltrE",function()
    {
      Validation.ValidateParamValue($(this).val(),1);
    });
  };

  var EncodeParam=function(param,type)
  {
    switch(type)
    {
      case 1:
      param=EncodeType1(param);
      break;

      case 2:
      param=EncodeType2(param);
      break;
    }

    return param;
  };

  var EncodeType1=function(param)
  {
    //clean string input before encode
    param=param.replace(/[.*+?^${}<>()|[\]\\]/g, '\\$&');

    //Hex encoding
    var conversionstr=param;
    var result = "";
    for (i=0; i<conversionstr.length; i++) {
      hex = conversionstr.charCodeAt(i).toString(16);
      result += ("000"+hex).slice(-4);
    }
    return result;
  };

  var EncodeType2=function(param)
  {
    // private property
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    //clean string input - and encode
    return encode(param.replace(/[.*+?^${}<>()|[\]\\]/g, '\\$&'),_keyStr);
  };

  // public method for encoding
  var encode = function (input,param2) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;

      input = _utf8_encode(input);

      while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
        param2.charAt(enc1) + param2.charAt(enc2) +
        param2.charAt(enc3) + param2.charAt(enc4);
      }
      return output;
    };

  // private method for UTF-8 encoding
  var _utf8_encode = function (string)
  {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";

      for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    };

  //Input Box Error Highlight -----------------------------------------------------------------------------------------------------------
  var InputErrorHighlight=function(elementID,type)
  {
    elementNm="#"+Validation.ValidateParamValue(elementID,3);
    elementErrTxt=elementNm.replace("Input","ErrorText");
    type=Validation.ValidateParamValue(type,2);

    switch(type)
    {
      //Add a class if it's not already there
      case 1:
      Utillities.ToggleClass(elementNm,"formError",1);
      Utillities.ToggleClass(elementErrTxt,"hide",2);
      break;

      //Remove a class if it's there
      case 2:
        Utillities.ToggleClass(elementNm,"formError",2);
        Utillities.ToggleClass(elementErrTxt,"hide",1);
      break;
    }
  };

  //Parse Address Data ---------------------------------------------------------------------------------------------------------------------
  var ValidateAddress=function(param)
  {
    param=Validation.ValidateParamValue(param,3);

    if(isNotDefined(param)==false && param!=="NONE")
    {
      return param+"</br>";
    }
    else
    {
      return " ";
    }
  };

  //Return functions to operate page callbacks etc. :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
  return{
    isNotDefined:isNotDefined,
    BlockInvalidKeys:BlockInvalidKeys,
    ValidateParamValue:ValidateParamValue,
    ValidationActions:ValidationActions,
    EncodeParam:EncodeParam,
    InputErrorHighlight:InputErrorHighlight,
    ValidateAddress:ValidateAddress,
    CleanData_TxtOnly:CleanData_TxtOnly,
    CleanData_GeneralTxtOnly:CleanData_GeneralTxtOnly,
    CleanData_NumOnly:CleanData_NumOnly,
    ArrayisEmpty:ArrayisEmpty
  };
})();

Validation.ValidationActions();
