//ACCOUNT NAVIGATION ==========================================================================================================================================================================
var AccountNavigation = (function ()
{
  //Menu Temporary Store
  var lvl1="";
  var lvl2="";
  var lvl3="";
  var lvl34="";

  var MenuUserType="";
  var CurrentUserType=Utillities.GetUserType();

  // INITALISE APP -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var init = function()
  {

    //Load Menu
    RestAPI.RequestData("categories?levels_down=4","get","GetMenuData",AccountNavigation.LoadComponents,RestAPI.APIError,RestAPI.APIError,"","");

    //Account MenuUserType
    GetAccountMenu();

    //Update Basket Total
    GetOrderTotal();
  };

  var LoadComponents=function(searchfilters,lvl1,lvl2,lvl3,lvl4,lvl34)
  {
    console.log(searchfilters);
    console.log(lvl1);
    console.log(lvl2);
    console.log(lvl3);
    console.log(lvl4);
    console.log(lvl34);

    RenderSearchFilters(searchfilters);
    RenderDesktopMenu(lvl1,lvl2,lvl34);
    RenderOffCanvasMenu(lvl1,lvl2,lvl3,lvl4);

    //Deeper levels are conditional - attached on hover / click, this data is stored for use in other functions

    PageBindings();
  };

  //Search Filter ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var RenderSearchFilters=function(data)
  {
    console.log(data);
    Lib_hbsclient.RenderTemplate("JSSearchFilterTemplate",data,"JSSearchFilterContent");

    SetSearchFilterandTerm();
  };

  var SetSearchFilterandTerm=function()
  {
    //Search Search Filter and Term
    if(Validation.isNotDefined(Utillities.GetUrlParameter("term"))==false)
    {
      //if there's a search term parameter passed in the URL
      //set the desktop and mobile search inputs to the parameter value

      SearchTerm=Validation.CleanData_GeneralTxtOnly(Utillities.GetUrlParameter("term"));
      $(".JSSearchInput").val(SearchTerm);
    }

    //Select Applicable Search Filter
    if(Validation.isNotDefined(Utillities.GetUrlParameter("filter"))==false)
    {
      //if there's a search filter parameter passed in the URL
      //set the desktop search filter to the parameter value
      // -- on mobile there are no search filters, default to 0 --

      SearchFilter=Validation.CleanData_NumOnly(Utillities.GetUrlParameter("filter"));

      if(SearchFilter>0 && Validation.isNotDefined(SearchFilter)==false && $("#JSSearchFilterContent option[value='"+SearchFilter+"']").length != 0)
      {
        $("#JSSearchFilterContent").val(SearchFilter.toString()).prop('selected', true);
      }
      else
      {
        $("#JSSearchFilterContent").val("0").prop('selected', true);
      }
    }
  };

  var CloseSearchFilter=function()
  {
    //Close the Dropdown selection for search filters
    $("#JSSearchFilterContent").blur();
  };

  //Search Autosuggest -----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetSearchAutoSuggest=function(term)
  {
    //Close any open menus
    CloseAllMenus();

    //Get Seach Autosuggest
    if(Validation.isNotDefined(term)==false)
    {
      var searchterm = term;
      if(searchterm.length>=2)
      {
        //get search suggestions
        RestAPI.RequestData("products?suggest="+searchterm+"&suggest_phrase=1&suggest_cat=1","get","GetSearchSuggestions",AccountNavigation.RenderSearchAutoSuggest,RestAPI.APIError,AccountNavigation.NoSuggestions,searchterm,"");
      }
    }
  };

  var RenderSearchAutoSuggest=function(AutoSuggestKeywords,AutoSuggestCategories,AutoSuggestProducts,AutoSuggestViewAll,Searchterm)
  {
    //Clear any old values
    $("#JSSearchAutoSuggestKeywordsContent").empty();
    $("#JSSearchAutoSuggestCategoriesContent").empty();
    $("#JSSearchAutoSuggestProductsContent").empty();

    //Render Keywords Section
    Lib_hbsclient.RenderTemplate("JSSearchAutoSuggestKeywordsTemplate",AutoSuggestKeywords,"JSSearchAutoSuggestKeywordsContent");

    //Render Categories Section
    Lib_hbsclient.RenderTemplate("JSSearchAutoSuggestCategoriesTemplate",AutoSuggestCategories,"JSSearchAutoSuggestCategoriesContent");

    //Render Products Section
    Lib_hbsclient.RenderTemplate("JSSearchAutoSuggestProductsTemplate",AutoSuggestProducts,"JSSearchAutoSuggestProductsContent");

    //Set View All link
    $("#JSViewAllAutosuggest").attr("href",AutoSuggestViewAll);

    //IE11 is incapable of rendering the drop down in the right place, so figure out position relative to search input
    var SearchInputOffset = document.getElementById("JSDesktopSearch");
    var searchsuggestleft=parseInt(SearchInputOffset.offsetLeft);

    //Show AutoSuggest (at the same WIDTH as the input box)- Hide All Other menus
    $("#JSSearchAutosuggest").css('left',(searchsuggestleft)+'px');
    $("#JSSearchAutosuggest").width($("#JSDesktopSearch").width()+21);
    Utillities.ToggleClass("#JSSearchAutosuggest","hide",2);
    Utillities.ToggleClass("#JSSearchOverlay","hide",2);

    //Highlight term in text returned
    HighlightAutoSuggest(Searchterm);

    //Show overlay
    Utillities.ToggleClass("#JSSearchOverlay","hide",2);

    //Timeout menu display if it's not Used
    Utillities.ExpireUnusedMenu("JSSearchAutosuggest",AccountNavigation.CloseSearchSuggestions);
  };

  var HighlightAutoSuggest=function(Searchterm)
  {
    //Handlebars shows the HTML in the data on the page (as it's HTML not innerHTML it uses)
    //so replace the text with a highlighted version
    $('.JSSearchHighlightTerm').each(function(){
      var origtxt=$(this).text();
      var otext=$(this).text().toLowerCase();
      var stext=Searchterm.toLowerCase();

      var positionofsearchtext=otext.indexOf(stext);
      var lnthSearchtxt=stext.length;

      //wrap a span around the search text - without impacting the Upper/Lowercase format of the original text
      var newtxt=origtxt;
      if(otext.indexOf(stext)!== -1)
      {
        newtxt=origtxt.slice(0,positionofsearchtext)+'<span class="searchtermhighlight">'+stext+"</span>"+origtxt.slice(positionofsearchtext+lnthSearchtxt,origtxt.length);
      }

      $(this).html(newtxt);
    });

  };

  var NoSuggestions=function()
  {
    //No Action required if there's no suggestions
  };

  var CloseSearchSuggestions=function()
  {
    Utillities.ToggleClass("#JSSearchAutosuggest","hide",1);
    Utillities.ToggleClass("#JSSearchOverlay","hide",1);
  };

  //Render Desktop Menu ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var RenderDesktopMenu=function(lvl1data,lvl2data,lvl34data)
  {
    Lib_hbsclient.RenderTemplate("JSMenuLvl1Template",lvl1data,"JSMenuLvl1Content");
    Lib_hbsclient.RenderTemplate("JSMenuLvl2Template",lvl2data,"JSMenuLvl2Content");
    Lib_hbsclient.RenderTemplate("JSMenuLvl34Template",lvl34data,"JSMenuLvl34Content");
  };

  var ShowDesktopMenu=function(lvlID)
  {
    //Close any open menus
    CloseAllMenus();

    //Open Selected MenuJSDesktopAccountTitle
    var Lvl3FilterID="";
    var Lvl3view="";

    var dlvlno=lvlID.substring(3,lvlID.indexOf("_")); //5 because all these ids are formatted JSdlvl[lvlNo]_[pid]_[categoryid]
    var dpid=lvlID.substring(lvlID.indexOf("_")+1,lvlID.lastIndexOf("_"));
    var dcatid=lvlID.substring(lvlID.lastIndexOf("_")+1,lvlID.length);

    switch(dlvlno)
    {
      case "lvl1":
      //If the selection is a level 1 category - clear the menu, and open it with the 1st category @level 2 selected, showing it's 3/4 levels
      Utillities.ToggleClass('#'+LvlID,'active',1);
      Utillities.ToggleClass(".JSdlvl2","hide",1);
      Utillities.ToggleClass(".JSdlvl2","active",2);
      Utillities.ToggleClass(".JSdlvl3","hide",1);
      Utillities.ToggleClass(".JSdlvl4","hide",1);

      //Level2
      console.log(".JSdlvl2_"+dcatid);
      Utillities.ToggleClass(".JSdlvl2_"+dcatid,"hide",2);
      $(".JSdlvl2_"+dcatid+":eq(0)").addClass("active");

      //Level 3
      if ($(".JSdlvl2_"+dcatid)[0])
      {
        Lvl3FilterID=$(".JSdlvl2_"+dcatid+":eq(0)").attr("id");
        Lvl3view=Lvl3FilterID.substring(Lvl3FilterID.lastIndexOf("_")+1,Lvl3FilterID.length);
        Utillities.ToggleClass(".JSdlvl3_"+Lvl3view,"hide",2);
        console.log(".JSdlvl3_"+Lvl3view);

        //Level 4
        if ($(".JSdlvl3_"+Lvl3view)[0])
        {
          Utillities.ToggleClass(".JSdlvl4_"+Lvl3view,"hide",2);
          console.log(".JSdlvl4_"+Lvl3view);
        }
      }
      break;

      case "lvl2":
      //If the selection is a level 2 category, the menu is open, empty level 3/4 and load the ones for the selected level 2
      //If the selection is a level 1 category - clear the menu, and open it with the 1st category @level 2 selected, showing it's 3/4 levels
      Utillities.ToggleClass(".JSdlvl2","active",2);
      Utillities.ToggleClass(".JSdlvl3","hide",1);
      Utillities.ToggleClass(".JSdlvl4","hide",1);

      //Level2
      $("#"+lvlID).addClass("active");

      //Level 3
      Lvl3FilterID=$("#"+lvlID).attr("id");
      Lvl3view=Lvl3FilterID.substring(Lvl3FilterID.lastIndexOf("_")+1,Lvl3FilterID.length);
      Utillities.ToggleClass(".JSdlvl3_"+Lvl3view,"hide",2);
      console.log(".JSdlvl3_"+Lvl3view);

      //Level 4
      if ($(".JSdlvl3_"+Lvl3view)[0])
      {
        Utillities.ToggleClass(".JSdlvl4_"+Lvl3view,"hide",2);
        console.log(".JSdlvl4_"+Lvl3view);
      }

      //Show Menu
      Utillities.ToggleClass("#JSMegaMenu_Overlay","hide",2);
      Utillities.ToggleClass("#JSDesktopMegaMenu","hide",2);
      break;

      //If it's a 3 or a 4 on the desktop menu it's a direct link to a page, no menu actions required
    }

    //Show Menu
    Utillities.ToggleClass("#JSMegaMenu_Overlay","hide",2);
    Utillities.ToggleClass("#JSDesktopMegaMenu","hide",2);

    //Timeout menu display if it's not Used
    Utillities.ExpireUnusedMenu("JSDesktopMegaMenu",AccountNavigation.CloseDesktopMenu);
  };

  var CloseDesktopMenu=function()
  {
    Utillities.ToggleClass(".JSdlvl1","active",2);
    Utillities.ToggleClass("#JSMegaMenu_Overlay","hide",1);
    Utillities.ToggleClass("#JSDesktopMegaMenu","hide",1);
  };

  //Account Menus -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetAccountMenu=function()
  {
    if(CurrentUserType!=="Guest")
    {
      //Get Account Menu Details for, the selected account - plus the Mobile switch Account section, and the Desktop Switch
      RestAPI.RequestData("user/accounts?size=4","get","GetAccountData",AccountNavigation.RenderAccountOptions,RestAPI.APIError,AccountNavigation.NoAccountData,CurrentUserType,"");

      //Get the List Selection for the Desktop Menu
      RestAPI.RequestData("lists?page=1&size=5","get","GetAccountListMenuData",AccountNavigation.RenderListOptions,RestAPI.APIError,AccountNavigation.NoListData,CurrentUserType,"");

      //Show the site links in the Footer
      Utillities.ToggleClass("#JSFooterSiteLinks","hide",2);
    }
    else
    {
      //Get the placeholder information to fill in a guest profile in the menus
      RestAPI.RequestPlaceholder(2,"",AccountNavigation.GuestProfile,AccountNavigation.GuestProfile,RestAPI.APIError,"");

      //get the placeholder information to fill in the Guest content in the footer
      RestAPI.RequestPlaceholder(0,"",AccountNavigation.RenderGuestFooter,RestAPI.APIError,RestAPI.APIError,"");

      Utillities.ToggleClass("#JSAccountSwitchDesktopContent","hide",1);
      Utillities.ToggleClass("#JSAccountListDesktopContent","hide",1);

      //Hide the site links in the Footer
      Utillities.ToggleClass("#JSFooterSiteLinks","hide",1);
    }

    //Set The Applicable Quicklinks
    //Populate Quicklinks (User to render Desktop Account menu, Off Canvas Menu & Footer site links)
    RestAPI.RequestPlaceholder(1,"GetQuicklinks",AccountNavigation.RenderQuicklinkOptions,RestAPI.APIError,RestAPI.APIError,CurrentUserType);
  };

  var GuestProfile=function(data)
  {
    //Populate Menu Guest Profile
    Lib_hbsclient.RenderTemplate("JSAccountProfileOffCanvasTemplate",data,"JSAccountProfileOffCanvasContent");

    //Populate Desktop Account Title
    Lib_hbsclient.RenderTemplate("JSAccountNameGuestDesktopTemplate",data,"JSAccountNameDesktopContent");

    //Show default menu icon
    Lib_hbsclient.RenderTemplate("JSMenuIconSwitchTemplate",JSON.parse('{"menuicon":[{"menuiconimg":"/images/menu.png"}]}'),"JSMenuIconSwitchContent");
    Lib_hbsclient.RenderTemplate("JSMenuIconSwitchTemplateSmall",JSON.parse('{"menuicon":[{"menuiconimg":"/images/menu.png"}]}'),"JSMenuIconSwitchContentSmall");

    //Hide the site links in the Footer
    Utillities.ToggleClass("#JSFooterSiteLinks","hide",1);
  };

  var RenderAccountOptions=function(ActiveAccount,AccountSwitchData,AccountUserType,AccountProfile)
  {
    //Authorised Users Only
    console.log(ActiveAccount);
    console.log(AccountSwitchData);
    console.log(AccountProfile);

    //Set User Type
    Utillities.CreateCookie("ASelct",ActiveAccount.selectedaccount[0].has_approvals+","+ActiveAccount.selectedaccount[0].can_order+","+ActiveAccount.selectedaccount[0].order_request_count);

    //Set Menu icon type
    if(ActiveAccount.selectedaccount[0].has_approvals==true && ActiveAccount.selectedaccount[0].can_order==true && ActiveAccount.selectedaccount[0].order_request_count>0)
    {
      Lib_hbsclient.RenderTemplate("JSMenuIconSwitchTemplate",JSON.parse('{"menuicon":[{"menuiconimg":"/images/menudot.png"}]}'),"JSMenuIconSwitchContent");
      Lib_hbsclient.RenderTemplate("JSMenuIconSwitchTemplateSmall",JSON.parse('{"menuicon":[{"menuiconimg":"/images/menudot.png"}]}'),"JSMenuIconSwitchContentSmall");
    }
    else
    {
      Lib_hbsclient.RenderTemplate("JSMenuIconSwitchTemplate",JSON.parse('{"menuicon":[{"menuiconimg":"/images/menu.png"}]}'),"JSMenuIconSwitchContent");
      Lib_hbsclient.RenderTemplate("JSMenuIconSwitchTemplateSmall",JSON.parse('{"menuicon":[{"menuiconimg":"/images/menu.png"}]}'),"JSMenuIconSwitchContentSmall");
    }

    //ACCOUNT SETTINGS
    //Profile Settings - Off canvas
    Lib_hbsclient.RenderTemplate("JSAccountProfileOffCanvasTemplate",AccountProfile,"JSAccountProfileOffCanvasContent");

    //Desktop Account Menu Profile
    Lib_hbsclient.RenderTemplate("JSAccountProfileDesktopTemplate",AccountProfile,"JSAccountProfileDesktopContent");

    //Account Switch - Off canvas

    var AccountsAvailableList = JSON.stringify(AccountSwitchData.AccountSwitchList);
    var AccountsAvailableCount = (AccountsAvailableList.match(/account_code/g) || []).length;

    if(AccountsAvailableCount>1)
    {
      Lib_hbsclient.RenderTemplate("JSAccountSwitchOffCanvasTemplate",AccountSwitchData,"JSAccountSwitchOffCanvasContent");
      Utillities.ToggleClass("#JSAccountSwitchDesktopContent","hide",2);

      //Desktop Account Menu, Account Swap SubMenu
      Lib_hbsclient.RenderTemplate("JSAccountSwitchDesktopTemplate",AccountSwitchData,"JSAccountSwitchDesktopContent");
    }
    else
    {
      Utillities.ToggleClass("#JSAccountSwitchDesktopContent","hide",1);
      Utillities.ToggleClass("#JSDesktopAccountSwitchMenu","hide",1);
    }

    //DESKTOP ACCOUNT MENU
    //Desktop Account Menu Title
    Lib_hbsclient.RenderTemplate("JSAccountNameDesktopTemplate",AccountProfile,"JSAccountNameDesktopContent");


    //QUICKLINK ACCOUNT FILTERS
    //If the Account is a Requestor/Approver Account, and there's Pending requests - show the count
    var PendingOrderRequests=ActiveAccount.selectedaccount[0].order_request_count;
    var CanOrder=ActiveAccount.selectedaccount[0].can_order;
    if(PendingOrderRequests>0 || CanOrder==false)
    {
      $(".JSQuickLink-OrderRequest").removeClass("hide");
      $(".JSOrderRequestCount").text(PendingOrderRequests);
    }

    //if user can order - show the order History option in Quick links
    if(CanOrder==true)
    {
      $(".JSQuickLink-OrderHistory").removeClass("hide");
    }

    //ON PAGE ACCOUNT CODE
    //Selected Account Code - could do this with handlebars, but they're single elements
    $(".JSAccount_Code").text(ActiveAccount.selectedaccount[0].account_code);

    //FOOTER ACCOUNT LINKS
    //Set the Footer About us Links & footer Contacts (Filtered on Selected Depot) - Guest Footer is handled seperately
    RestAPI.RequestPlaceholder(0,"",AccountNavigation.RenderAboutUs,RestAPI.APIError,RestAPI.APIError,ActiveAccount.selectedaccount[0].depot_name);
  };

  var RenderListOptions=function(data)
  {
    console.log(data);

    //Render Account Menu list selection
    Lib_hbsclient.RenderTemplate("JSAccountListDesktopTemplate",data,"JSAccountListDesktopContent");
    Utillities.ToggleClass("#JSAccountListDesktopContent","hide",2);
  };

  var RenderQuicklinkOptions=function(DesktopMenu,OffCanvasMenu,FooterLinks)
  {
    console.log(DesktopMenu);
    console.log(OffCanvasMenu);
    console.log(FooterLinks);

    //Off Canvas Quick Links
    Lib_hbsclient.RenderTemplate("JSOffCanvasQuicklinksTemplate",OffCanvasMenu,"JSOffCanvasQuicklinksContent");

    //Footer Quick Links
    Lib_hbsclient.RenderTemplate("JSFooterQuicklinksTemplate",FooterLinks,"JSFooterQuicklinksContent");

    //Desktop Account Menu
    Lib_hbsclient.RenderTemplate("JSAccountQuickinksDesktopTemplate",DesktopMenu,"JSAccountQuickinksDesktopContent");
  };

  var RenderAboutUs=function(data,depo)
  {
    console.log(data);

    $.each(data.Footer, function( i, value ) {
      //About us footer
      if (data.Footer[i].Depot==depo)
      {
        Lib_hbsclient.RenderTemplate("JSFooterAboutUsTemplate",data.Footer[i],"JSFooterAboutUsContent");

        Lib_hbsclient.RenderTemplate("JSFooterContactsTemplate",data.Footer[i],"JSFooterContactsContent");
      }
    });
  };

  var RenderGuestFooter=function(data,depo)
  {
    console.log(data);

    $.each(data.Footer, function( i, value ) {
      //About us footer
      if (i==0)
      {
        //About Us Links
        Lib_hbsclient.RenderTemplate("JSFooterAboutUsTemplate",data.Footer[i],"JSFooterAboutUsContent");
      }

      //Contact Links
      Lib_hbsclient.RenderTemplate("JSFooterContactsTemplate",data.Footer[i],"JSFooterContactsContent");
    });
  };

  var NoAccountData=function()
  {
    //If no account data is returned, the session is invalid - return to the login screen
    UserToken.SessionExpired();
  };

  var NoListData=function()
  {
    //No Action required
    Utillities.ToggleClass("#JSAccountListDesktopContent","hide",2);
  };

  //Off Canvas Account Menu
  var OpenOffCanvasAccountSwitchMenu=function()
  {
    //Close Menu
    Utillities.ToggleClass("#JSAccountSwitchOffCanvasContent","hide",2);
    Utillities.ToggleClass("#JSAccountSwitchMenuOverlay","hide",2);
    Utillities.ToggleClass("#JSSelectedOffCanvasAccount","open",1);
  };

  var CloseOffCanvasAccountSwitchMenu=function()
  {
    //Close Menu
    Utillities.ToggleClass("#JSAccountSwitchOffCanvasContent","hide",1);
    Utillities.ToggleClass("#JSAccountSwitchMenuOverlay","hide",1);
    Utillities.ToggleClass("#JSSelectedOffCanvasAccount","open",2);
  };

  //Desktop Account Submenus - wrap Right or Left depending on page width
  var DesktopAccountSubmenuWrap=function()
  {
    var DesktopAccMenuOffset = document.getElementById("JSDesktopAccountMenu");
    var menuleft=parseInt(DesktopAccMenuOffset.offsetLeft);
    var menuWidth =parseInt(DesktopAccMenuOffset.offsetWidth)-19;
    var DesktopAccountMenuGap=parseInt(Utillities.GetPageWidth())-(menuWidth+menuleft);

    console.log(menuWidth);
    if(DesktopAccountMenuGap<=230)
    {
      //Submenu - Left Side
      $("ul.sub-menu").css({
        'left': "-"+(menuWidth)+"px"
      });
    }
    else
    {
      //SubMenu - Right Side
      $("ul.sub-menu").css({
        'left':(menuWidth) +'px',
      });
    }
  };

  var CloseDesktopAccountMenu=function()
  {
    Utillities.ToggleClass("#JSDesktopAccountMenu","hide",1);
    Utillities.ToggleClass("#JSDesktopAccountSwitchMenu","hide",1);
    Utillities.ToggleClass("#JSDesktopAccountListMenu","hide",1);
    Utillities.ToggleClass("#JSDesktopAccountListMenu","hide",1);

    Utillities.ToggleClass("#JSDesktopAccountMenuOverlay","hide",1);
  };

  //Hide the the desktop account list/account switch submenus
  var CloseDesktopAccountSubmenus=function()
  {
      Utillities.ToggleClass("#JSDesktopAccountSwitchMenu","hide",1);
      Utillities.ToggleClass("#JSDesktopAccountListMenu","hide",1);
      Utillities.ToggleClass("#JSDesktopAccountSwitchMenu","hide",1);
      Utillities.ToggleClass("#JSDesktopAccountListMenu","hide",1);
  };

  //Desktop Account Modal Switch ------------------------------------------------------------------------------------------------------------------------------------------------------------
  var LoadModalAccountData=function()
  {
    CloseDesktopAccountMenu();
    $("#ModalAccountListContent").empty();
    RestAPI.RequestData("user/accounts?size=500","get","GetAccountData",AccountNavigation.AppendModalAccountPage,AccountNavigation.NoMoreData,AccountNavigation.NoMoreData,CurrentUserType,"");
  };

  var AppendModalAccountPage=function(ActiveAccount,AccountSwitchData,AccountUserType,AccountProfile)
  {
    Lib_hbsclient.RenderTemplate("ModalAccountListTemplate",AccountSwitchData,"ModalAccountListContent");
    $("#JSaccountswitchref").val(0);
    MicroModal.show('ModalSwitchAccount');
  };

  var NoMoreData=function()
  {
    //No Results Action required
    MicroModal.close('ModalSwitchAccount');
  };


  //Render Off Canvas Menu -------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var RenderOffCanvasMenu=function(lvl1data,lvl2data,lvl3data,lvl4data)
  {
    // Level 1 categories
    Lib_hbsclient.RenderTemplate("JSOffCanvasLvl1Template",lvl1data,"JSOffCanvasLvl1Content");

    // Level 2 categories
    Lib_hbsclient.RenderTemplate("JSOffCanvasLvl2Template",lvl2data,"JSOffCanvasLvl2Content");

    // Level 3 categories
    Lib_hbsclient.RenderTemplate("JSOffCanvasLvl3Template",lvl3data,"JSOffCanvasLvl3Content");

    // Level 4 categories
    Lib_hbsclient.RenderTemplate("JSOffCanvasLvl4Template",lvl4data,"JSOffCanvasLvl4Content");
  };

  //Update the Order Totals (Top Right) ------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetOrderTotal=function()
  {
    //Get the Order Totals(RequestURL,RequestMethod,DataType,RequestSuccessCallback,RequestFailCallback,RequestNoResultsCallback,AdditionalParams,RequestjsonData)
    RestAPI.RequestData("basketitems","get","",AccountNavigation.RenderOrderTotal,RestAPI.APIError,RestAPI.APIError,"","");
  };

  var RenderOrderTotal=function(data)
  {
    console.log(data);
    SetBasketTotal(Utillities.formatPrice(data.total_cost),data.product_count);
  };

  var SetBasketTotal=function(TotalCost,LineCount)
  {
    var DisplayTotal=TotalCost;
    var LinesTotal=LineCount;

    if(Validation.isNotDefined(TotalCost)||isNaN(TotalCost))
    {
      DisplayTotal="0.00";
    }

    if(Validation.isNotDefined(LinesTotal)||isNaN(LinesTotal))
    {
      LinesTotal="0";
    }

    //As the Basket layout is defined and not repeated, just enter the values - there is a desktop / mobile duplicate value so use classes.
    $(".JSNavBasketLinesLarge").text(LinesTotal+" Line"+Utillities.GrammarCorrect(LinesTotal));
    $(".JSNavBasketLinesSmall").text(LinesTotal);

    $(".JSNavBasketTotal").text("£"+DisplayTotal.toString());

    if($(".JSpagetype").attr("id")=="order")
    {
      //If it's the my order page - update the total summary cost too.
      BasketView.UpdateOrderSummaryTotal(DisplayTotal.toString());
      $("#MyOrderSummaryTotal").text(DisplayTotal.toString());
    }

    //Update off canvas counter
    $(".JSOrderCount").text(LinesTotal);
  };

  var UpdateRequestCount=function(param)
  {
    //Update requests pending Counter
    var RequestCount=parseInt(param);

    if(Validation.isNotDefined(RequestCount)==false && RequestCount>0)
    {
      //If it's invalid and not 0 - show the request counter and set them both to the new value
      Utillities.ToggleClass(".JSOrderRequestCount","hide",2);
      $("#JSPageProductCount").text(RequestCount);
      $(".JSOrderRequestCount").each(function()
      {
        $( this ).text(RequestCount);
      });
    }
    else
    {
      //If it's invalid or 0 - hide the request counter and set them both to 0
      Utillities.ToggleClass(".JSOrderRequestCount","hide",1);
      $("#JSPageProductCount").text("0");
      $(".JSOrderRequestCount").each(function()
      {
        $(this).text("0");
      });
    }
  };

  //Off Canvas Menu ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var OpenLeftOffCanvas=function()
  {
    //Close any open menus
    CloseAllMenus();

    //Open Left Off Canvas
    document.getElementById("offcanvasleft").style.left = "0px";
    Utillities.ToggleClass("#offcanvas-accountslist","hide",1);
    Utillities.ToggleClass("#JSOffCanvas_Overlay_left","hide",2);
  };

  var closeLeftOffCanvas=function()
  {
    //Close the off canvas account menu
    Utillities.ToggleClass("#JSAccountSwitchOffCanvasContent","hide",1);
    Utillities.ToggleClass("#JSAccountSwitchMenuOverlay","hide",1);
    
    //Close the off canvas on the left
    Utillities.ToggleClass("#offcanvas-accountslist","hide",1);

    //Slide out from the left & show overlay
    document.getElementById("offcanvasleft").style.left = "-350px";
    Utillities.ToggleClass("#JSOffCanvas_Overlay_left","hide",1);
  };

  //Off Canvas Menu ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var closeRightOffCanvas=function()
  {
    //Slide out from the left & show overlay
    document.getElementById("offcanvasfilter").style.right = "-350px";
    Utillities.ToggleClass("#JSOffCanvas_Overlay_right","hide",1);
  };


  //Menu Management -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

  //Close ALL menus
  var CloseAllMenus=function()
  {
    CloseSearchFilter();
    CloseSearchSuggestions();
    CloseDesktopMenu();
    CloseDesktopAccountMenu();
  };


  //Page Bindings --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var PageBindings=function()
  {
    //If width resizes - used to change from Grid to List View
    var width = Utillities.GetPageWidth();
    //If the page WIDTH is resized, reload as it needs to swap 'Grid' to 'row'
    $(window).resize(function(){

      //As the menu switches at different sizes, and the search suggestions width adjusts
      //Close all the menus on resize of the screen
      closeRightOffCanvas();
      closeLeftOffCanvas();
      CloseAllMenus();

      //If the Screen size has changed, update the width placeholder and reload if it's the results page
      if ($(window).width() != width) {
        // Only action on screen width change
        width = Utillities.GetPageWidth();

        //If it's the results page ONLY
        //Reload to force it to change from grid to row (view_1, browse - view_2, search - view_3, list items)
        if($("#main").hasClass("view_1")||$("#main").hasClass("view_2")||$("#main").hasClass("view_3"))
        {
          location.reload();
        }
      }
    });


    //Desktop Menu
    var MenuEnterTimeout="";
    $("body").on("click",".JSdlvl1",function()
    {
      //Open Desktop MegaMenu
      Utillities.ToggleClass('.JSdlvl1','active',2);
      LvlID=$(this).attr("id");

      ShowDesktopMenu(LvlID);

    });

    //Hover Intent
    $("body").on("mouseover",".JSdlvl1",function()
    {
      Utillities.ToggleClass('.JSdlvl1','active',2);
      LvlID=$(this).attr("id");

      timer = setTimeout(function () {
        ShowDesktopMenu(LvlID);
      }, 150);
    });


    $("body").on("mouseout",".JSdlvl1",function()
    {
      clearTimeout(timer);
    });


    $("body").on("mouseenter",".mainheader",function()
    {
      CloseDesktopMenu();
    });


    $("body").on("click",".JSdlvl2",function()
    {
      LvlID=$(this).attr("id");
      ShowDesktopMenu(LvlID);
    });

    //Hover Intent
    $("body").on("mouseover",".JSdlvl2",function()
    {
      Utillities.ToggleClass('.JSdlvl2','active',2);
      LvlID=$(this).attr("id");

      timer2 = setTimeout(function () {
        ShowDesktopMenu(LvlID);
      }, 100);
    });

    $("body").on("mouseout",".JSdlvl2",function()
    {
      clearTimeout(timer2);
    });

    $("#JSMegaMenu_Overlay").click(function(){
      $('.JSdlvl1').removeClass('active');
    });

    //Search
    $("#JSSearchFilterContent").change(function()
    {
      SearchTerm=Validation.CleanData_GeneralTxtOnly($("#JSDesktopSearch").val());
      SearchFilter=Validation.CleanData_NumOnly($("#JSSearchFilterContent").val());

      if(Validation.isNotDefined(SearchTerm)==false)
      {
        if(SearchFilter==0)
        {
          Utillities.Redirect("/search?term="+SearchTerm);
        }
        else
        {
          Utillities.Redirect("/search?term="+SearchTerm+"&filter="+SearchFilter);
        }
      }
    });

    //Autosuggest - on pause in typing, show suggestions
    var typingTimer; //timer identifier
    var doneTypingInterval = 900;  //time in ms (5 seconds)
    var myInput = document.getElementById("JSDesktopSearch"); //
    $("#JSDesktopSearch").on('keyup', function (e) {
      if(e.which==13 || e.which==10)
      {
        //applysearch();
      }
      else
      {
        myInput.value=myInput.value; //prevent non-alpha numberic entries
        clearTimeout(typingTimer);
        if (myInput.value) {
          Utillities.ToggleClass("#JSSearchAutosuggest","hide",1);
          Utillities.ToggleClass("#JSSearchOverlay","hide",1);

          typingTimer = setTimeout(GetSearchAutoSuggest(myInput.value), doneTypingInterval);
        }
      }
    });

    //On focus on the search box - if it's not blank, load the autosuggest
    $("#JSDesktopSearch").on("focus",function()
    {
      if(Validation.isNotDefined($("#JSDesktopSearch").val())==false)
      {
        GetSearchAutoSuggest($("#JSDesktopSearch").val());
      }
    });

    //Hide the menu if the mouse leaves - after a mo
    var hideTimer = null;
    $("#JSSearchAutosuggest").bind('mouseleave', function() {
      hideTimer = setTimeout(function() {
        CloseSearchSuggestions();
      }, 500);

      //take the focus off the input, so the user can trigger the autosuggest again on going back to it
      $('#JSDesktopSearch').blur();
    });

    //keeps the menu open if the user hovers back on the menu after leaving the space
    $("#JSSearchAutosuggest").bind('mouseover', function() {
      if (hideTimer !== null) {
        clearTimeout(hideTimer);
      }
    });

    //There are 2 search term inputs / 2 forms - which is visible (desktop or mobile) is governed by css,
    //so keep both the same to ensure the correct search term is searched on
    $('#JSDesktopSearch').bind('keypress keyup blur onchange onpaste', function() {
      $('#JSMobileSearch').val($(this).val());
    });

    $('#JSMobileSearch').bind('keypress keyup blur', function() {
      $('#JSDesktopSearch').val($(this).val());
    });

    // Show / Hide off canvas menu ==============================================================================================

    $("body").on('click','.openbtn', function (e)
    {
      //Open off canvas left menu
      e.preventDefault();
      OpenLeftOffCanvas();
    });

    $(".closeoffcanvasleft").on('click', function (e)
    {
      //Close the off canvas on the left
      e.preventDefault();
      closeLeftOffCanvas();
    });

    $("body").on('click',"#JSOffCanvas_Overlay_left", function (e)
    {
      e.preventDefault();
      closeLeftOffCanvas();
    });

    //toggle off canvas filters on the right ------------------------------------------------------------------------
    $("#JSopenfilterpanel").on('click', function (e)
    {
      //Close any open menus
      CloseAllMenus();

      //Open right filter menu
      e.preventDefault();
      document.getElementById("offcanvasfilter").style.right = "0px";
      Utillities.ToggleClass("#JSOffCanvas_Overlay_right","hide",2);
    });

    $("#rightfilterclose").on('click', function (e)
    {
      e.preventDefault();
      closeRightOffCanvas();
    });

    $("body").on('click',"#JSOffCanvas_Overlay_right",function (e)
    {
      e.preventDefault();
      closeRightOffCanvas();
    });

    //Desktop Account Menu --------------------
    $("body").on("click","#JSMegaMenu_Overlay",function()
    {
      CloseDesktopMenu();
    });

    $("body").on("click , mouseover","#JSDesktopAccountTitle",function()
    {
      if($("#JSDesktopAccountMenu").hasClass("hide"))
      {
        //Close any open menus
        CloseAllMenus();

        //Open Account Menu
        Utillities.ToggleClass("#JSDesktopAccountMenu","hide",2);
        Utillities.ToggleClass("#JSDesktopAccountMenuOverlay","hide",2);

        //Timeout menu display if it's not Used
        Utillities.ExpireUnusedMenu("JSDesktopAccountMenu",AccountNavigation.CloseDesktopAccountMenu);

        DesktopAccountSubmenuWrap();
      }
      else
      {
        CloseDesktopAccountMenu();
      }
    });



    //Off Canvas Menu Option Selected ----------
    //on click of menu - show next level / hide levels -----------------------------------------------------------------------------
    $(".JSOffCanvasGroup").on("click",function(e){
      //Prefix of JSmlvl or JSdlvl
      var menulevelselected=parseInt($(this).attr("id").substring(6,$(this).attr("id").indexOf("_")));
      var parentID=parseInt($(this).attr("id").substring($(this).attr("id").indexOf("_")+1,$(this).attr("id").lastIndexOf("_")));
      var selectedID=Utillities.getProdID($(this).attr("id"));

      if($(this).hasClass("selectedmenuitem"))
      {
        //If the menu is active - remove highlight, show siblings and hide next level
        $(this).removeClass("selectedmenuitem");

        for (i = (menulevelselected+1); i <= 4; i++)
        {
          $(".JSmlvl"+i).removeClass("selectedmenuitem");
          $(".JSmlvl"+i).addClass("hide");
        }

        if(menulevelselected==1)
        {
          $(this).siblings().removeClass("hide");
        }
        else
        {
          //Show the filtered siblings for level 2-4
          $(".JSmlvl"+menulevelselected+"_"+parentID).removeClass("hide");
        }
      }
      else
      {
        //highlight item selected, hide siblings & show next level
        $(this).addClass("selectedmenuitem");
        $(this).siblings().addClass("hide");
        $(".JSmlvl"+(menulevelselected+1)+"_"+selectedID).removeClass("hide");
      }
    });

    //Quicklinks
    $("body").on("click",".JSQuickLink-List",function(){
      Utillities.Redirect("/lists");
    });

    $("body").on("click",".JSQuickLink-OrderRequest",function()
    {
      Utillities.Redirect("/orderrequests");
    });

    $("body").on("click",".JSQuickLink-OrderHistory",function()
    {
      Utillities.Redirect("/orderhistory");
    });

    $("body").on("click",".JSQuickLink-Home",function()
    {
      Utillities.Redirect("/");
    });

    $("body").on("click",".JSQuickLink-MyPreferences",function()
    {
      Utillities.Redirect("/preferences");
    });

    $("body").on("click",".JSQuickLink-SignOut",function(){
      UserToken.SignOut();
    });

    $("body").on("click","#JSSelectedOffCanvasAccount",function(){
      if($("#JSAccountSwitchOffCanvasContent").is(':empty')==false)
      {
        if($(this).hasClass("open"))
        {
          //Close Menu
          CloseOffCanvasAccountSwitchMenu();
        }
        else
        {
          //Open Menu
          OpenOffCanvasAccountSwitchMenu();
        }
      }
    });

    $("body").on("click","#JSAccountSwitchOffCanvasX",function()
    {
      CloseOffCanvasAccountSwitchMenu();
    });

    $("body").on("click","#JSAccountSwitchMenuOverlay",function()
    {
      CloseOffCanvasAccountSwitchMenu();
    });

    $("body").on("mouseover","#JSDesktopAccountSubMenu",function()
    {
        Utillities.ToggleClass("#JSDesktopAccountSwitchMenu","hide",2);
        Utillities.ToggleClass("#JSDesktopAccountListMenu","hide",1);
    });

    $("body").on("mouseover","#JSDesktopAccountListSubMenu",function()
    {
        Utillities.ToggleClass("#JSDesktopAccountSwitchMenu","hide",1);
        Utillities.ToggleClass("#JSDesktopAccountListMenu","hide",2);
    });

    $("body").on("mouseover","#JSAccountQuickinksDesktopContent, #JSAccountProfileDesktopContent",function()
    {
      CloseDesktopAccountSubmenus();
    });

    $("body").on("click","#JSDesktopAccountMenuOverlay",function()
    {
      CloseDesktopAccountMenu();
    });

    $("body").on("click",".JSAccountSwap,.JSOCAccountSwap",function()
    {
      AccID=$(this).attr("id").substring($(this).attr("id").lastIndexOf("_")+1,$(this).attr("id").length);
      UserToken.SwitchUserAccount(AccID);
    });

    $("body").on("click","#JSDesktopAccountSwitchViewAll",function()
    {
      LoadModalAccountData();
    });

    $("body").on("click","#JSOffCanvasAccountSwitchViewAll",function()
    {
      closeLeftOffCanvas();
      LoadModalAccountData();
    });

    $("body").on("click",".JSaccountswapmodal",function(e)
    {
      e.preventDefault();
      AccID=$(this).attr("id").substring($(this).attr("id").lastIndexOf("_")+1,$(this).attr("id").length);
      $("#JSaccountswitchref").text(AccID);
      $(".JSaccountswapmodal").removeClass("active");
      Utillities.ToggleClass("#"+$(this).attr("id"),"active",1);
      Utillities.ToggleClass("#JSSwitchAccountContinue","disabled",2);
    });

    $("body").on("click","#JSSwitchAccountContinue",function()
    {
      MicroModal.close('ModalSwitchAccount');
      var AccId=Validation.CleanData_NumOnly(parseInt($("#JSaccountswitchref").text()));

      if(Validation.isNotDefined(AccId)==false)
      {
        UserToken.SwitchUserAccount(AccId);
      }
      else
      {
        Utillities.Toaster("Unable to Switch to Selected Account - Please Try Again",1);
      }
    });

  };

  //Retun to make process accessible to trigger page load ---------------------------------------------------------------------------------------------------------------------------------
  return {
    init: init,
    LoadComponents:LoadComponents,
    RenderAccountOptions:RenderAccountOptions,
    RenderListOptions:RenderListOptions,
    RenderQuicklinkOptions:RenderQuicklinkOptions,
    NoAccountData:NoAccountData,
    RenderOrderTotal:RenderOrderTotal,
    GetOrderTotal:GetOrderTotal,
    SetBasketTotal:SetBasketTotal,
    UpdateRequestCount:UpdateRequestCount,
    GuestProfile:GuestProfile,
    OpenLeftOffCanvas:OpenLeftOffCanvas,
    closeLeftOffCanvas:closeLeftOffCanvas,
    closeRightOffCanvas:closeRightOffCanvas,
    RenderAboutUs:RenderAboutUs,
    RenderGuestFooter:RenderGuestFooter,
    NoListData:NoListData,
    GetSearchAutoSuggest:GetSearchAutoSuggest,
    RenderSearchAutoSuggest:RenderSearchAutoSuggest,
    NoSuggestions:NoSuggestions,
    ShowDesktopMenu:ShowDesktopMenu,
    CloseDesktopMenu:CloseDesktopMenu,
    CloseDesktopAccountMenu:CloseDesktopAccountMenu,
    CloseSearchFilter:CloseSearchFilter,
    CloseAllMenus:CloseAllMenus,
    CloseSearchSuggestions:CloseSearchSuggestions,
    LoadModalAccountData:LoadModalAccountData,
    AppendModalAccountPage:AppendModalAccountPage,
    NoMoreData:NoMoreData
  };
})();

AccountNavigation.init();
