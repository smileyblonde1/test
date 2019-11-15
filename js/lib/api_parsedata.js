//API Data =============================================================================================================================================================================================
var ParseAPIData =(function ()
{
  var SessionUserAuthType   = "";
  var SelectedAccountType   = "";

  //PROCESS DATA ====================================================================================================================================================================================
  var IdentifyProcessType=function(rawdata,DataType,RequestSuccessCallback,RequestFailCallback,RequestNoResultsCallback,AdditionalParams)
  {
    SessionUserAuthType   = Utillities.GetUserType();
    SelectedAccountType   = Utillities.GetAccountType();

    //Cases with UserType as a prefix allow logged in users and guests to get different responses from handlebars
    switch(DataType)
    {
      //Default
      case "":
      RequestSuccessCallback(rawdata,AdditionalParams);
      break;

      //User Account Selected
      case "GetSelectedAccount":
      GetSelectedAccount(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Sign In
      case "SignInAccounts":
      SignInAccounts(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Selected a valid account - check login process
      case "SignInAccountSelected":
      SignInAccountSelected(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Get Account Menu Data
      case "GetAccountData":
      GetAccountData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Get Account Menu Lists
      case "GetAccountListMenuData":
      GetAccountListMenuData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Main Menu Categories
      case "GetMenuData":
      GetMenuData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Main Menu Categories
      case "GetSearchSuggestions":
      GetSearchSuggestions(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Main Menu Categories
      case "GetQuicklinks":
      GetQuicklinks(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Breadcrumb value
      case "GetBrowseBreadcrumb":
      GetBrowseBreadcrumb(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Order Totals
      case SessionUserAuthType+"GetBasketTotal":
      Authorised_GetBasketTotal(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Hero Carousel
      case "GetHeroData":
      GetHeroData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Highlights
      case "GetHighlightsData":
      GetHighlightsData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Promotions carousel and New Product Carousel
      case "GetPromotionResultsPanelData":
      GetPromotionResultsPanelData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Breadcrumb Results Data
      case "GetBreadcrumbData":
      GetBreadcrumbData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Browse Results Data
      case "GetBrowseData":
      GetBrowseData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Search Results Data
      case "GetSearchData":
      GetSearchData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //List Data
      case "GetListData":
      GetListData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //List Download Data
      case "GetListDownloadData":
      GetListDownloadData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //List Item Data
      case "GetListItemData":
      GetListItemData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Product Data
      case "GetProductData":
      GetProductData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Order History Row Results Data
      case "GetOrderHistoryData":
      GetOrderHistoryData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Order Request Data Row Results
      case "GetOrderRequestData":
      GetOrderRequestData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Order Request Data Summary Results
      case "GetOrderSummaryData":
      GetOrderSummaryData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Basket Data
      case "GetBasketData":
      GetBasketData(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Checkout Data
      //Out of stock content
      case "GetALLCheckoutdata":
      GetALLCheckoutdata(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Erudus Data
      case "GetCheckoutItemErudusData":
      GetCheckoutErudusData(rawdata,DataType,RequestSuccessCallback,RequestNoResultsCallback,AdditionalParams);
      break;

      //Confirm Checkout
      case "GetCheckoutStock":
      GetCheckoutStock(_rawdata,_DataType,_RequestSuccessCallback,_NoDataCallback,_AdditionalParams);
      break;

      //Add Item To a List
      case "AddItemToExistingList":
      AddItemToExistingList(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;

      //Get Footer Links
      case "GetFooterLinks":
      GetFooterLinks(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback);
      break;
    }
  };

  //ACCOUNT SELECTED ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetSelectedAccount=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    var AccountType="";
    var CheckoutType="";
    var RequestCount=0;

    //send back  the raw data and the process to callback the data to
    var accountselect=JSON.parse('{"selectedaccount":'+JSON.stringify(data)+'}');

    //is it an Approver Requestor account?
    if(accountselect.selectedaccount[0].has_approvals==true)
    {
      console.log("Approver / requestor Account");
    }
    else
    {
      console.log("Standard Account");
    }

    //Is the User a Requestor or approver?
    if(accountselect.selectedaccount[0].can_order==true)
    {
      CheckoutType="Place Order";
    }
    else
    {
      CheckoutType="Request Order";
    }

    if(accountselect.selectedaccount[0].is_approver==true)
    {
      AccountType="Approver";
    }
    else
    {
      AccountType="Requestor";
    }

    RequestCount=accountselect.selectedaccount[0].order_request_count;

    console.log(AccountType);
    console.log(CheckoutType);
    console.log(RequestCount);

    RequestSuccessCallback(rawdata,AccountType,CheckoutType,RequestCount,AdditionalParams);
  };

  //SIGN IN -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var SignInAccounts=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    var AccountsApplicable=rawdata;
    var ActiveAccounts=rawdata.accounts;

    //If successfully recieved a token, store to use with this session ------------------------------------
    var firstLogin=AccountsApplicable.has_logged_in; //flag if it's the users's first login, this is changed by the API.

    //Set a temporary token - to allow the user to select an account
    UserToken.SetToken(AccountsApplicable.token,AccountsApplicable.session_key,Utillities.CookieTimeStamp());

    //Account - PEOPLE WHO ONLY HAVE 1 ACCOUNT WILL RETURN 'UNDEFINED'
    if(ActiveAccounts==undefined)
    {
      //Only 1 account found
      RequestSuccessCallback (firstLogin,"");
    }
    else
    {
      //Select from multiple accounts
      RequestSuccessCallback (firstLogin,JSON.parse('{"AccountList":'+JSON.stringify(ActiveAccounts)+'}'));
    }
  };

  var SignInAccountSelected=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    //No data required - pass back flag to determine if user is logging in for the first time
    Utillities.CreateCookie("tkn",rawdata.token,1);
    RequestSuccessCallback(AdditionalParams);
  };


  //NAVIGATION
  //Menu & Search Filter -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetMenuData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    //Parse the categories into the format to display
    var SearchFilter="";
    var SearchFilterActive=0;

    //Is there an actively selected filter?
    if(Validation.isNotDefined(Global.SearchFilterSelection)==false && isNaN(Global.SearchFilterSelection)==false)
    {
      SearchFilterActive=Global.SearchFilterSelection;
    }

    //Placeholder if there's no selection
    if(SearchFilterActive==0)
    {
      SearchFilter=SearchFilter+'{"search_filter_id":0,"search_filter_selected":"selected","search_filter_text":"Search All"},';
    }
    else
    {
      SearchFilter=SearchFilter+'{"search_filter_id":0,"search_filter_selected":"","search_filter_text":"Search All"},';
    }

    var Menulvl1JSON="";  //Desktop menu, mobile menu
    var Menulvl2JSON="";  //Desktop menu, mobile menu

    var Menulvl3JSON="";  //Mobile Menu only
    var Menulvl4JSON="";  //Mobile Menu only

    var Menulvl34JSON="";  //Desktop Menu only

    var menulvl1="";
    var menulvl2="";
    var menulvl3="";
    var menulvl4="";

    //Identify the top level category ids - to establish the heirarchy for the Hrefs
    menulvl1 = rawdata.filter( function(element) { return element.parent_id ==0; });

    $.each(menulvl1, function( a, val )
    {
      //Set Level 1 Menu vales
      if(menulvl1[a].product_count>0)
      {
        var ActiveFilter;
        if(SearchFilterActive==menulvl1[a].category_id)
        {ActiveFilter="selected";}
        else
        {ActiveFilter="";}
        SearchFilter=SearchFilter+'{"search_filter_id":'+menulvl1[a].category_id+',"search_filter_selected":"'+ActiveFilter+'","search_filter_text":"'+menulvl1[a].category_name+'"},';
        Menulvl1JSON=Menulvl1JSON+'{"menulvl":"lvl1","menulvl_categoryID":"lvl1_'+menulvl1[a].parent_id+'_'+menulvl1[a].category_id+'","menulvl_pid":"menuitempid_'+menulvl1[a].parent_id+'","menulvl_linkref":"#","menulvl_categoryname":"'+menulvl1[a].category_name+'"},';

        //Set level 2 values
        menulvl2 = rawdata.filter( function(element) { return element.parent_id ==menulvl1[a].category_id; });
        $.each(menulvl2, function( b, val )
        {
          if(menulvl2[b].product_count>0)
          {
            Menulvl2JSON=Menulvl2JSON+'{"menulvl":"lvl2","menulvl_categoryID":"lvl2_'+menulvl2[b].parent_id+'_'+menulvl2[b].category_id+'","menulvl_pid":'+menulvl2[b].parent_id+',"menulvl_linkref":"#","menulvl_categoryname":"'+menulvl2[b].category_name+'","menulvl_productcount":'+menulvl2[b].product_count+'},';

            //Set level 3 values
            menulvl3 = rawdata.filter( function(element) { return element.parent_id ==menulvl2[b].category_id; });
            $.each(menulvl3, function( c, val )
            {
              if(menulvl3[c].product_count>0)
              {
                Menulvl3JSON=Menulvl3JSON+'{"menulvl":"lvl3","menulvl_categoryID":"lvl3_'+menulvl3[c].parent_id+'_'+menulvl3[c].category_id+'","menulvl_pid":'+menulvl3[c].parent_id+',"menulvl_linkref":"#","menulvl_categoryname":"'+menulvl3[c].category_name+'","menulvl_productcount":'+menulvl3[c].product_count+'},';
                Menulvl34JSON=Menulvl34JSON+'{"menulvl":"lvl3","menulvl_categoryID":"lvl34_'+menulvl3[c].parent_id+'_'+menulvl3[c].category_id+'","menulvl_pid":'+menulvl3[c].parent_id+',"menulvl_linkref":"/category/'+Utillities.slugify(menulvl1[a].category_name)+"/"+Utillities.slugify(menulvl2[b].category_name)+"/"+Utillities.slugify(menulvl3[c].category_name)+"/_/"+menulvl3[c].category_id+'","menulvl_categoryname":"'+menulvl3[c].category_name+'","menulvl_productcount":'+menulvl3[c].product_count+'},';

                //View all option @ level 4
                Menulvl4JSON=Menulvl4JSON+'{"menulvl":"lvl4","menulvl_categoryID":"lvl4_'+menulvl3[c].category_id+'_0","menulvl_pid":'+menulvl3[c].category_id+',"menulvl_linkref":"/category/'+Utillities.slugify(menulvl1[a].category_name)+"/"+Utillities.slugify(menulvl2[b].category_name)+"/"+Utillities.slugify(menulvl3[c].category_name)+"/_/"+menulvl3[c].category_id+'","menulvl_categoryname":"View All","menulvl_productcount":'+menulvl3[c].product_count+'},';

              //Set level 4 values
                menulvl4 = rawdata.filter( function(element) { return element.parent_id ==menulvl3[c].category_id; });
                $.each(menulvl4, function( d, val )
                {
                  if(menulvl4[d].product_count>0)
                  {
                    Menulvl4JSON=Menulvl4JSON+'{"menulvl":"lvl4","menulvl_categoryID":"lvl4_'+menulvl4[d].parent_id+'_'+menulvl4[d].category_id+'","menulvl_pid":'+menulvl4[d].parent_id+',"menulvl_linkref":"/category/'+Utillities.slugify(menulvl1[a].category_name)+"/"+Utillities.slugify(menulvl2[b].category_name)+"/"+Utillities.slugify(menulvl3[c].category_name)+"/"+Utillities.slugify(menulvl4[d].category_name)+"/_/"+menulvl4[d].category_id+'","menulvl_categoryname":"'+menulvl4[d].category_name+'","menulvl_productcount":'+menulvl4[d].product_count+'},';
                    Menulvl34JSON=Menulvl34JSON+'{"menulvl":"lvl4","menulvl_categoryID":"lvl4_'+menulvl4[d].parent_id+'_'+menulvl4[d].category_id+'","menulvl_pid":'+menulvl3[c].parent_id+',"menulvl_linkref":"/category/'+Utillities.slugify(menulvl1[a].category_name)+"/"+Utillities.slugify(menulvl2[b].category_name)+"/"+Utillities.slugify(menulvl3[c].category_name)+"/"+Utillities.slugify(menulvl4[d].category_name)+"/_/"+menulvl4[d].category_id+'","menulvl_categoryname":"'+menulvl4[d].category_name+'","menulvl_productcount":'+menulvl4[d].product_count+'},';
                  }
                });
              }
            });
          }
        });
      }
    });

    //Search Filter Data

    //Return Data
    RequestSuccessCallback(JSON.parse('{"searchfilter":['+SearchFilter.substring(0,SearchFilter.length-1)+']}'),JSON.parse('{"lvl1":['+Menulvl1JSON.substring(0,Menulvl1JSON.length-1)+']}'),JSON.parse('{"lvl2":['+Menulvl2JSON.substring(0,Menulvl2JSON.length-1)+']}'),JSON.parse('{"lvl3":['+Menulvl3JSON.substring(0,Menulvl3JSON.length-1)+']}'),JSON.parse('{"lvl4":['+Menulvl4JSON.substring(0,Menulvl4JSON.length-1)+']}'),JSON.parse('{"lvl3_4":['+Menulvl34JSON.substring(0,Menulvl34JSON.length-1)+']}'),AdditionalParams);
  };

  //Search AutoSuggest --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetSearchSuggestions=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    var SearchTerm=AdditionalParams;

    //Suggested Keywords
    var SuggestKeywds=rawdata.phrases;
    var keywdsList="";
    var KeywdsFinal="";

    if(Validation.isNotDefined(SuggestKeywds)==false)
    {
      $.each(SuggestKeywds, function( i, value )
      {
        keywdsList=keywdsList+'{"keywdlink":"/search?filter=0&term='+SuggestKeywds[i].text+'","keywd":"'+SuggestKeywds[i].text+'"},';
      });

      KeywdsFinal=JSON.parse('{"SuggestedKeywords":['+keywdsList.slice(0,-1)+']}');
    }

    //Suggested Categories
    var SuggestCateg=rawdata.categories;
    var categList="";
    var categFinal="";

    if(Validation.isNotDefined(SuggestCateg)==false)
    {
      $.each(SuggestCateg, function( i, value )
      {
        categList=categList+'{"categlink":"/category/'+Utillities.slugify(SuggestCateg[i].category_name)+'/_/'+SuggestCateg[i].category_id+'","categname":"'+SuggestCateg[i].category_name+'"},';
      });

      categFinal=JSON.parse('{"SuggestedCategories":['+categList.slice(0,-1)+']}');
    }

    //Suggested Products
    var SuggestProd=rawdata.products;
    var ProdList="";
    var ProdFinal="";

    if(Validation.isNotDefined(SuggestProd)==false)
    {
      $.each(SuggestProd, function( i, value )
      {
        var sprodimg;
        if(Validation.isNotDefined(SuggestProd[i].srch_image)==false)
        {
          //if there's an image show it
          sprodimg=Global.imageDir+Global.imageSubFolder[3]+"/"+SuggestProd[i].srch_image;
        }
        else
        {
          //if there's no image show the placeholder
          sprodimg=imagePlaceholder;
        }

        ProdList=ProdList+'{"Prodlink":"/product/'+Utillities.slugify(SuggestProd[i].product_name)+'/_/'+SuggestProd[i].product_id+'","ProdImg":"'+sprodimg+'","Prodname":"'+SuggestProd[i].product_name+'"},';
      });

      ProdFinal=JSON.parse('{"SuggestedProducts":['+ProdList.slice(0,-1)+']}');
    }

    //View All
    var ViewAll="/search?filter=0&term="+SearchTerm;

    RequestSuccessCallback(KeywdsFinal,categFinal,ProdFinal,ViewAll,SearchTerm);
  };

  //Quicklinks ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  GetQuicklinks=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    //Quicklink content
    var data=rawdata.quicklinks;
    var DesktopMenuQL="";
    var OffCanvasMenuQL="";
    var FooterQL="";

    $.each(data, function( i, value )
    {
      if(data[i].quicklink_usertype==AdditionalParams||data[i].quicklink_usertype=="All")
      {
        //Desktop Account menu links
        if(data[i].quicklink_accountmenu!==false)
        {
          DesktopMenuQL=DesktopMenuQL+'{"quicklinktext":"'+data[i].quicklink_title+'","quicklinkhref":"'+data[i].quicklink_href+'","quicklinkclass":"'+data[i].quicklink_class+'","quicklinkicon":"'+data[i].quicklink_icon+'","quicklinkcounter":"'+data[i].quicklink_counter+'","quicklinkcounterclassnm":"'+data[i].quicklink_counterid+'","quicklinkaccounttype":"'+data[i].quicklink_accounttype+'"},';
        }

        //Off Canvas Links
        if(data[i].quicklink_offcanvasmenu!==false)
        {
          OffCanvasMenuQL=OffCanvasMenuQL+'{"quicklinktext":"'+data[i].quicklink_title+'","quicklinkhref":"'+data[i].quicklink_href+'","quicklinkclass":"'+data[i].quicklink_class+'","quicklinkicon":"'+data[i].quicklink_icon+'","quicklinkcounter":"'+data[i].quicklink_counter+'","quicklinkcounterclassnm":"'+data[i].quicklink_counterid+'","quicklinkaccounttype":"'+data[i].quicklink_accounttype+'"},';
        }

        //Footer Site Links
        if(data[i].quicklink_footer!==false)
        {
          FooterQL=FooterQL+'{"quicklinktext":"'+data[i].quicklink_title+'","quicklinkhref":"'+data[i].quicklink_href+'","quicklinkclass":"'+data[i].quicklink_class+'","quicklinkicon":"'+data[i].quicklink_icon+'","quicklinkcounter":"'+data[i].quicklink_counter+'","quicklinkcounterclassnm":"'+data[i].quicklink_counterid+'","quicklinkaccounttype":"'+data[i].quicklink_accounttype+'"},';
        }
      }
    });

    var AccMenuQL=JSON.parse('{"DesktopMenuQL":['+DesktopMenuQL.slice(0,-1)+']}');
    var OffCanvMenuQL=JSON.parse('{"OffCanvasMenuQL":['+OffCanvasMenuQL.slice(0,-1)+']}');
    var FooterMenuQL=JSON.parse('{"FooterQL":['+FooterQL.slice(0,-1)+']}');

    RequestSuccessCallback(AccMenuQL,OffCanvMenuQL,FooterMenuQL);
  };

  //Accounts ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetAccountData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    //Only called by Authorised Accounts - Guest doesn't do this
    var validaccounts=0;
    if(rawdata.length)
    {
      validaccounts=rawdata.length;
    }
    var AccountSwitchData=(JSON.parse('{"AccountSwitchList":'+JSON.stringify(rawdata)+'}'));
    var ActiveAccount=Utillities.GetActiveAccount(rawdata);
    var AccountUserType=AdditionalParams;

    //return Auth user profile
    var Profile=ActiveAccount.selectedaccount[0];
    var AccountProfile="";
    AccountProfile=JSON.parse('{"accountprofile":[{"profilepic":"/images/user2.png","profiledisplayname":"'+Profile.display_name+'","profileaccountname":"'+Profile.account_name+'","profilerequestcount":"'+Profile.order_request_count+'","profileuserapprover":"'+Profile.is_approver+'","accountsavailable":"'+validaccounts+'"}]}');

    RequestSuccessCallback(ActiveAccount,AccountSwitchData,AccountUserType,AccountProfile);
  };

  //Desktop Account Menu Lists
  var GetAccountListMenuData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    //List Items products are in an array called lines, with the actual product detail in a sub section called product_card - reformat it to parse the data the same way.
    var listmenuinfo="";
    $.each(rawdata.lists, function( i, val )
    {
      //The List line Id - required to modify the quantity in the basket, is not in the product card - append it to each row.
      listmenuinfo=listmenuinfo+'{"listname":"'+rawdata.lists[i].list_name+'","listpath":"'+Utillities.slugify(rawdata.lists[i].list_name)+'","listid":'+rawdata.lists[i].list_id+',"listowner":"'+rawdata.lists[i].owner_name+'","listitems":"'+rawdata.lists[i].line_count+' item'+Utillities.GrammarCorrect(rawdata.lists[i].line_count)+'"},';
    });

    var listitems=JSON.parse('{"accountlistlinks":['+listmenuinfo.slice(0,-1)+']}');

    RequestSuccessCallback(listitems);
  };

  //Breadcrumb
  var GetBrowseBreadcrumb=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    var data=rawdata.breadcrumb.split(">");
    var browsebreadcrumb="";

    $.each(data, function( index, value ) {
      browsebreadcrumb=browsebreadcrumb+'{"breadcrumbtext":"'+value.trim()+'"},';
    });

    RequestSuccessCallback(JSON.parse('{"browsebreadcrumb":['+browsebreadcrumb.slice(0,-1)+']}'));
  };

  //Search Autosuggest ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


  //Order Totals ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var Authorised_GetBasketTotal=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    var LineCount=0;
    var LineTxt="Lines";
    var TotalCost="0.00";

    if(Validation.isNotDefined(rawdata.product_count)==true)
    {
      //If no data recieved
      throw Error('No Data Recieved By Order Totals');
    }
    else
    {
      var ordertotal="";

      //Count of lines in the basket
      LineCount=rawdata.product_count;

      //Get Line Text Grammar
      var Linetxt="";
      if(LineCount==1)
      {
        Linetxt="Lines";
      }
      else
      {
        Linetxt="Line";
      }

      //get Total Cost
      TotalCost=(parseFloat(rawdata.total_cost)/100).toFixed(2);

      RequestSuccessCallback(JSON.parse('{"ordertotal":[{"OrderlineCount":'+LineCount+',"orderlinetxt":"'+Linetxt+'","orderlinecost":"'+TotalCost+'"}]}'),AdditionalParams);
    }
  };

  //HOMEPAGE
  //Hero Carousel -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetHeroData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.album)==true)
    {
      //If no data recieved
      throw Error('No Data Recieved By Hero Component');
    }
    else
    {
      var heroRAW=rawdata.album;

      var herodata="";
      //Format recurring list data for template
      $.each(heroRAW, function( i, val )
      {
        var urlpath="";

        //Choose the action to take
        switch(heroRAW[i].link_type)
        {
          case "url":
          urlpath=heroRAW[i].link_url;
          break;

          case "product_id":
          urlpath="/product/"+Utillities.slugify(heroRAW[i].caption)+"/_/"+heroRAW[i].link_product_id;
          break;

          case "list_id":
          urlpath="/listitems/"+Utillities.slugify(heroRAW[i].caption)+"/_/"+heroRAW[i].link_list_id;
          break;
        }

        herodata=herodata+
        '{"hero_id":"V'+rawdata.delivery_id+'_H'+heroRAW[i].image_set_id+
        '","hero_image_large":"'+Global.imageDir+heroRAW[i].image_large+
        '","hero_image_medium":"'+Global.imageDir+heroRAW[i].image_medium+
        '","hero_image_small":"'+Global.imageDir+heroRAW[i].image_small+
        '","hero_caption":"'+heroRAW[i].caption+
        '","hero_link":"'+urlpath+'"},';
      });

      RequestSuccessCallback(JSON.parse('{"hero":['+herodata.slice(0, -1)+']}'),AdditionalParams);

      herodata="";
      heroRAW="";
    }
  };

  //Highlights Data Carousel --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetHighlightsData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata[0].album[0])==true)
    {
      //If no data recieved
      throw Error('No Data Recieved By Highlight Component');
    }
    else
    {
      var highlightLeft=JSON.stringify(rawdata[0].album[0]);
      var HighlightRight=JSON.stringify(rawdata[1].album[0]);

      var leftDeliveryID='{"delivery_id":"'+rawdata[0].delivery_id+'",'+highlightLeft.substring(1,highlightLeft.length);
      var rightDeliveryID='{"delivery_id":"'+rawdata[1].delivery_id+'",'+HighlightRight.substring(1,HighlightRight.length);

      var HighlightWithDeliveryID=JSON.parse('{"highlights":['+leftDeliveryID+','+rightDeliveryID+']}');

      var HighlightRAW=HighlightWithDeliveryID.highlights;

      var Highlightdata="";
      var highlightplural="";
      var urlplural="";
      var urlpath="";
      var urltargt="";

      //Format recurring list data for template
      $.each(HighlightRAW, function( i, val )
      {
        var urlpath="";

        //Choose the action to take
        switch(HighlightRAW[i].link_type)
        {
          case "url":
          urlpath=HighlightRAW[i].link_url;
          highlightplural="";
          break;

          case "product_id":
          urlpath="/product/"+Utillities.slugify(HighlightRAW[i].caption)+"/_/"+HighlightRAW[i].link_product_id;
          highlightplural="s";
          break;

          case "list_id":
          urlpath="/listitems/"+Utillities.slugify(HighlightRAW[i].caption)+"/_/"+HighlightRAW[i].link_list_id;
          highlightplural="s";
          break;
        }

        //CSS Position class
        var positn="";
        if(i==0)
        {
          positn="Left";
        }
        else {
          positn="right";
        }

        Highlightdata=Highlightdata+
        '{"highlight_id":"V'+HighlightRAW[i].delivery_id+'_M'+HighlightRAW[i].image_set_id+
        '","highlight_image_large":"'+Global.imageDir+HighlightRAW[i].image_large+
        '","highlight_image_medium":"'+Global.imageDir+HighlightRAW[i].image_medium+
        '","highlight_image_small":"'+Global.imageDir+HighlightRAW[i].image_small+
        '","highlight_title":"'+HighlightRAW[i].caption+
        '","highlight_description":"'+HighlightRAW[i].additional_text+
        '","highlight_caption":"'+HighlightRAW[i].additional_text+
        '","highlight_position":"'+positn+
        '","highlight_plural":"'+highlightplural+
        '","highlight_link":"'+urlpath+'"},';
      });

      RequestSuccessCallback(JSON.parse('{"highlight":['+Highlightdata.slice(0, -1)+']}'),AdditionalParams);

      //Clear Vars to prevent memory leaks
      HighlightRAW="";
      Highlightdata="";
      highlightplural="";
      urlplural="";
      urlpath="";
      urltargt="";
    }
  };

  //Promotions Carousel Data --------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetPromotionResultsPanelData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.products)==true)
    {
      //If no data recieved
      throw Error('No Data Recieved By '+DataType+' Component');
    }
    else
    {
      var ResultsRAW=rawdata.products;
      ParseResultsPanelData(JSON.parse('{"products":'+JSON.stringify(ResultsRAW)+',"delivery_id":'+rawdata.delivery_id+'}'),"Grid","add",true,RequestSuccessCallback,AdditionalParams,"");
    }
  };


  //RESULTS
  //Browse Results Data -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetBrowseData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.products)==true)
    {
      //If no data recieved
      RequestNoResultsCallback(AdditionalParams);
    }
    else
    {
      var ResultsRAW=rawdata;
      ParseResultsPanelData(ResultsRAW,AdditionalParams[1],"add",false,RequestSuccessCallback,AdditionalParams[0],"");
    }
  };

  //Search Results Data -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetSearchData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.products)==true)
    {
      //If no data recieved
      RequestNoResultsCallback(AdditionalParams);
    }
    else
    {
      var ResultsRAW=rawdata;
      ParseResultsPanelData(ResultsRAW,AdditionalParams[1],"add",false,RequestSuccessCallback,AdditionalParams[0],"");
    }
  };

  var GetListItemData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.lines)==true)
    {
      //If no data recieved
      RequestNoResultsCallback(AdditionalParams);
    }
    else
    {
      //List Items products are in an array called lines, with the actual product detail in a sub section called product_card - reformat it to parse the data the same way.
      var productinfo="";
      $.each(rawdata.lines, function( i, val )
      {
        //The List line Id - required to modify the quantity in the basket, is not in the product card - append it to each row.
        productinfo=productinfo+(JSON.stringify(rawdata.lines[i].product_card).slice(0,-1))+',"list_line_id":'+rawdata.lines[i].list_line_id+',"list_created_ts":"'+rawdata.lines[i].created_ts+'"},';
      });

      var reformattedProducts=JSON.parse('{"products":['+productinfo.slice(0,-1)+'],"product_count":'+rawdata.line_count+',"total_cost":'+rawdata.total_cost+',"breadcrumb_text":"'+rawdata.list_name+'"}');
      var ResultsRAW=reformattedProducts;

      ParseResultsPanelData(ResultsRAW,AdditionalParams[1],"remove",false,RequestSuccessCallback,AdditionalParams[0],rawdata.list_name);
    }
  };


  //PARSE RESULTS PLANEL DATA
  //Case Split Parsing -----------------------------------------------------------------------------------------------------------------------------------------------------------------
  var CaseSplitInputType=function(casePrice,splitPrice)
  {
    var selection="";
    if(casePrice>0 && splitPrice==0)
    {
      selection="case only";
    }

    if(splitPrice>0 && casePrice==0)
    {
      selection="split only";
    }

    if(splitPrice>0 && casePrice>0)
    {
      selection="both";
    }

    return selection;
  };

  var CaseSplitSelected=function(caseQuantity,splitQuantity,casePrice,split_price)
  {
    var selection="";

    //IF there's no quantity selected go by price
    if(split_price==0 && casePrice>0)
    {
      selection="case";
    }
    else
    {
      selection="split";
    }

    //If there's a quantity selected - use that
    if(caseQuantity>0 && splitQuantity==0)
    {
      selection="case";
    }

    if(splitQuantity>0 && caseQuantity==0)
    {
      selection="split";
    }

    return selection;
  };

  var ResultsQuantity=function(caseQuantity,splitQuantity,casePrice)
  {
    var prodQuantity="";
    if(caseQuantity>0 && splitQuantity>0 && casePrice>0)
    {
      prodQuantity=caseQuantity;
    }
    else
    {
      prodQuantity=splitQuantity;
    }

    if(caseQuantity>0 && splitQuantity==0)
    {
      prodQuantity=caseQuantity;
    }

    if(splitQuantity>0 && caseQuantity==0)
    {
      prodQuantity=splitQuantity;
    }

    return prodQuantity;
  };

  var ParseResultsPanelData=function(ProductInfoRAW,ViewType,ListOption,PromotionInfo,RequestSuccessCallback,AdditionalParams,ListName)
  {
    //Process Results Panel Information for use in Promotions, New Products, List Items, Browse, Search & Basket
    var Facets=ProductInfoRAW.facets;
    var ProductCount=ProductInfoRAW.product_count;
    var TotalCost=ProductInfoRAW.total_cost;
    var ResultsPanelInfoRAW=ProductInfoRAW.products;
    var ProductData="";
    var CaseSplitElementSelection="";
    var CaseSplitElementType="";

    //Format recurring list data for template
    $.each(ResultsPanelInfoRAW, function( i, val )
    {
      //The format of the product card changes depending on the page - standardise it, and validate the data

      //ON PROMOTION
      var onPromotion="";
      if(ResultsPanelInfoRAW[i].promo_type==1)
      {
        onPromotion="promoted";
      }

      //BASKET LINE
      var InBasket="basket";
      var basket_line_id=0;

      //IF there's a basket_line_id parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].basket_line_id)==false)
      {
        basket_line_id=ResultsPanelInfoRAW[i].basket_line_id;
      }

      //CASE PRICE
      var case_price=0.00;

      //IF there's a case_price parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].case_price)==false)
      {
        case_price=Utillities.formatPrice(ResultsPanelInfoRAW[i].case_price);
      }

      //PROMOTION CASE PRICE
      var promo_case_price=0.00;

      //IF there's a case_price parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].case_price_prev)==false)
      {
        promo_case_price=Utillities.formatPrice(ResultsPanelInfoRAW[i].case_price_prev);
      }

      //CASE QTY
      var case_qty=0;

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].case_qty)==false)
      {
        case_qty=ResultsPanelInfoRAW[i].case_qty;
      }

      //CASE SIZE
      var case_size=0;

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].case_size)==false)
      {
        case_size=ResultsPanelInfoRAW[i].case_size;
      }

      //CASE_UNIT_QTY
      var case_unit_qty="";

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(case_qty)==false)
      {
        case_unit_qty=+case_qty+' case'+Utillities.GrammarCorrect(case_qty);
      }

      //DESCRIPTION
      var description="";

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].description)==false)
      {
        description=Validation.CleanData_GeneralTxtOnly(ResultsPanelInfoRAW[i].description);
      }

      //DESCRIPTION
      var delivery_id=0;
      var adID="";
      var adClass="";
      var promotionstracking="";

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].delivery_id)==false)
      {
        delivery_id=ResultsPanelInfoRAW[i].delivery_id;

        //advertisting
        //If delivery_id exists
        adID="JSDelv"+ProductInfoRAW.delivery_id+'_Pnl'+ResultsPanelInfoRAW[i].product_id;
        adClass="JSPromotionPanel";

        //if Promoted Products - include trackers
        promotionstracking='","product_ad_id":"'+adID+'","product_ad_class":"'+adClass;
      }

      //GRID IMAGE
      var grid_image="/images/placeholder.png";

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].grid_image)==false)
      {
        grid_image=Global.imageDir+Global.imageSubFolder[0]+"/"+ResultsPanelInfoRAW[i].grid_image;
      }

      //LINE PRICE
      var line_cost=0.00;

      //IF there's a case_price parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].line_cost)==false)
      {
        line_cost=Utillities.formatPrice(ResultsPanelInfoRAW[i].line_cost);
      }

      //LIST IMAGE
      var list_image="/images/placeholder.png";
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].list_image)==false)
      {
        list_image=Global.imageDir+Global.imageSubFolder[1]+"/"+ResultsPanelInfoRAW[i].list_image;
      }

      //LIST LINE
      var list_line_id=0;

      //IF there's a basket_line_id parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].list_line_id)==false)
      {
        list_line_id=ResultsPanelInfoRAW[i].list_line_id;
      }
      else
      {
        //If the list line is null but there's a BasketID - use that instead
        list_line_id=basket_line_id;
      }

      //PRODUCT CODE
      var product_code="";

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].product_code)==false)
      {
        product_code=ResultsPanelInfoRAW[i].product_code;
      }

      //PRODUCT ID
      var product_id=0;

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].product_id)==false)
      {
        product_id=ResultsPanelInfoRAW[i].product_id;
      }


      //PRODUCT NAME
      var product_name="";

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].product_name)==false)
      {
        product_name=Validation.CleanData_GeneralTxtOnly(ResultsPanelInfoRAW[i].product_name);
      }

      //PRODUCT LINK
      var product_link="";

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].product_name)==false)
      {
        product_link="/product/"+Utillities.slugify(Validation.CleanData_GeneralTxtOnly(ResultsPanelInfoRAW[i].product_name))+"/_/"+ResultsPanelInfoRAW[i].product_id;
      }

      //SPLIT PRICE
      var split_price=0.00;

      //IF there's a case_price parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].split_price)==false)
      {
        split_price=Utillities.formatPrice(ResultsPanelInfoRAW[i].split_price);
      }

      //PROMOTION SPLIT PRICE
      var promo_split_price=0.00;

      //IF there's a case_price parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].split_price_prev)==false)
      {
        promo_split_price=Utillities.formatPrice(ResultsPanelInfoRAW[i].split_price_prev);
      }

      //SPLIT QTY
      var split_qty=0;

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].split_qty)==false)
      {
        split_qty=ResultsPanelInfoRAW[i].split_qty;
      }

      //Split Unit Quantity
      var product_split_unit_qty="";
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].split_qty)==false)
      {
        product_split_unit_qty=split_qty+' split'+Utillities.GrammarCorrect(split_qty);
      }


      //UNIT SIZE
      var unit_size="";

      //IF there's a case_qty parameter - fill it in
      if(Validation.isNotDefined(ResultsPanelInfoRAW[i].unit_size)==false)
      {
        unit_size=ResultsPanelInfoRAW[i].unit_size;
      }

      //case Split Selection
      CaseSplitElementSelection=CaseSplitInputType(case_price,split_price);
      CaseSplitElementType=CaseSplitSelected(case_qty,split_qty,case_price,split_price);
      var ProdQty=ResultsQuantity(case_qty,split_qty,case_price);

      var InStockText="";
      if(case_qty>0 && split_qty>0)
      {
        //Show Case AND split combination
        InStockText=case_unit_qty+" ("+(case_qty*case_size)+" units) @ £"+case_price+" each, and "+product_split_unit_qty+" ("+split_qty+" units) @ £"+split_price+" each";
      }
      else
      {
        //Show the selected Case or Split text
        switch(CaseSplitElementType)
        {
          case "split":
          InStockText=product_split_unit_qty+" ("+split_qty+" units) @ £"+split_price+" each";
          break;

          case "case":
          InStockText=case_unit_qty+" ("+(case_qty*case_size)+" units) @ £"+case_price+" each";
          break;
        }
      }


      //Add to List, Remove From List or Hide List Link - depending on ListOption parameter passed
      var ListOptionClass="";
      var ListOptionText="";

      switch(ListOption)
      {
        case "add":
        ListOptionClass="JSAddtolist";
        ListOptionText="Add To List";
        break;

        case "remove":
        ListOptionClass="JSRemoveFromlist";
        ListOptionText="Remove From List";
        break;

        default:
        ListOptionClass="none";
        ListOptionText="none";
        break;
      }

      //Add a parameter if the user is authorised so the buttons will show
      var authline="";
      if (SessionUserAuthType=="Authorised")
      authline='","product_withactions":"'+SessionUserAuthType;

      //Is the item in the basket?
      var productinorder="";
      if(case_qty>0 || split_qty>0)
      {
        productinorder="inOrder";
      }

      //As the results panel is used multiple times on the same page - auto generate a unique ID for the Panel
      //So the right details are picked up when processing (i.e the promoted panel and the new prod panel might BOTH have product 1 - this won't work as it will duplicate the ids)
      var uniqueID=(Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();

      //Response Data Output
      ProductData=ProductData+
      '{"product_code":"'+product_code+
      '","product_id":'+product_id+
      ',"product_resultspaneluniqueid":"'+uniqueID+
      '","product_name":"'+product_name+
      '","product_link":"'+product_link+
      '","product_description":"'+description+
      '","product_itemqty":"'+ProdQty+
      '","product_grid_image":"'+grid_image+
      '","product_list_image":"'+list_image+
      '","product_unit_size":"'+unit_size+
      '","product_case_unit_size":"'+case_size+' x '+unit_size+
      '","product_case_unit_qty":"'+case_unit_qty+
      '","product_case_size":"'+case_size+
      '","product_case_price":"'+case_price+
      '","product_promo_case_price":"'+promo_case_price+
      '","product_case_qty":"'+case_qty+
      promotionstracking+
      '","product_split_unit_size":"1 x '+unit_size+
      '","product_split_price":"'+split_price+
      '","product_promo_split_price":"'+promo_split_price+
      '","product_split_unit_qty":"'+product_split_unit_qty+
      '","product_split_qty":"'+split_qty+
      '","product_casesplit_type":"'+CaseSplitElementSelection+
      '","product_casesplit_selection":"'+CaseSplitElementType+
      '","product_addbtn_qty":"'+ProdQty+
      '","product_list_line_id":"'+list_line_id+
      '","product_basket_line_id":"'+basket_line_id+
      '","product_basket_line_cost":"'+line_cost+
      '","product_list_option_class":"'+ListOptionClass+
      '","product_list_option_text":"'+ListOptionText+
      '","product_instockqty_text":"'+InStockText+
      '","product_line_cost":"'+line_cost+
      '","product_in_current_order":"'+productinorder+
      '","product_on_promotion":"'+onPromotion+
      authline+
      '","product_basketclass":"'+InBasket+'"},';
    });

    //Return Data
    var jsongroupname="";
    switch(ViewType)
    {
      case "Checkout_InStock":
      jsongroupname="InStock";
      break;

      case "Checkout_OutOfStock":
      jsongroupname="OutOfStock";
      break;

      case "CheckoutRecommendations":
      jsongroupname="recommendations";
      break;

      default:
      jsongroupname="products";
      break;
    }
    var ParsedProductData=JSON.parse('{"'+jsongroupname+'":['+ProductData.slice(0, -1)+']}');

    var FormattedTotalCost="0.00";
    if(Validation.isNotDefined(TotalCost)==false)
    {
      FormattedTotalCost=Utillities.formatPrice(TotalCost);
    }

    //If there are valid facets - load them
    ParseResultsFilters(ParsedProductData,Facets,ViewType,RequestSuccessCallback,AdditionalParams,ProductCount,FormattedTotalCost,ListName);
  };

  var AddItemToExistingList=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    var ListItems="";
    var ListData=rawdata.lists;

    if(Validation.isNotDefined(rawdata.lists)==false)
    {
      $.each(ListData, function( i, val )
      {
        var shared="";
        if(shared==true)
        {
          shared=" (Shared)";
        }

        if(ListData[i].read_only==false)
        {
          ListItems=ListItems+'{"ListID":"'+ListData[i].list_id+'","ListName":"'+ListData[i].list_name+shared+'","ListItemCount":"'+ListData[i].line_count+' item'+Utillities.GrammarCorrect(ListData[i].line_count)+'","Owner":"'+ListData[i].owner_name+'"},';
        }
      });

      //Formatted List content for Add Items List
      RequestSuccessCallback(JSON.parse('{"addtolistselection":['+ListItems.slice(0,-1)+']}'),AdditionalParams);
    }

    if(ListItems==""||Validation.isNotDefined(rawdata.lists)==true)
    {
      //If there's no lists - create one
      RequestNoResultsCallback(AdditionalParams);
    }
  };

  //Desktop and Mobile Filter information ----------------------------------------------------------------------------------------------------------------------------------------------
  var ParseResultsFilters=function(ParsedProductData,Facets,ViewType,RequestSuccessCallback,AdditionalParams,ProductCount,FormattedTotalCost,ListName)
  {
    var finalfilter="";
    var ParsedFilters="";
    var FilterData="";
    var FilterList=["cat_level4","brand_name","dietary"];
    var FilterListName=["Category","Brand","Allergens"];
    var CookieFilter=Utillities.ReadCookie("fltr");

    if(Validation.isNotDefined(Facets)==false)
    {
      //For each section - get the list of filters
      $.each( FilterList, function( i, val )
      {
        //Get Filters Applicable
        $.each(Facets[val], function( x, value )
        {
          var uniquefilterKey=Utillities.convertToHex("&facet_key="+encodeURIComponent(FilterList[i])+"&facet_value="+encodeURIComponent(Facets[val][x].key));

          //If the filter is in the fltr cookie - selected, if not it's inactive
          var filterselected="";
          if(Validation.isNotDefined(CookieFilter)==false)
          {
            //if the filter isn't already in the list - add it
            if(CookieFilter.includes(uniquefilterKey)==true)
            {
              filterselected="active";
            }
          }

          //Response Data
          //Encode into hex the category name and filter name for the URL, convert the values to URL format to pass through to APIError
          //Utillities decodes it to send the data to the API.
          FilterData=FilterData+'{"filter_HexID":"'+FilterListName[i]+"_"+uniquefilterKey+'","filtername_filtergroupname":"'+FilterListName[i]+'","filtername_filtername":"'+Facets[val][x].key+'","filterselected":"'+filterselected+'"},';
        });

        //if there's no data - don't submit it, if there is add it to the Json returned
        if(FilterData!=="")
        {
          ParsedFilters=ParsedFilters+'{"filterTitle":"'+FilterListName[i]+'","filterCheckboxes":['+FilterData.slice(0, -1)+']},';

          //reset filter for next loop
          FilterData="";
        }
      });

      finalfilters=JSON.parse('{"filters":['+ParsedFilters.slice(0, -1)+']}');
    }
    else
    {
      //Results found - but no facets (List Items view)
      finalfilters=JSON.parse('{"filters":[{"filterTitle":"Category"},{"filterTitle":"Brand"},{"filterTitle":"Allergens"}]}');
    }

    RequestSuccessCallback(ParsedProductData,finalfilters,ViewType,AdditionalParams,ProductCount,FormattedTotalCost,ListName);
  };

  //PRODUCTS
  //Product Data -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetProductData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback,ListName)
  {
    if(Validation.isNotDefined(rawdata.product_id)==false)
    {
      var data=rawdata;
      var ProductCardInfo=JSON.parse('{"products":[{"basket_line_id":"'+rawdata.basket_line_id+'","case_price":"'+rawdata.case_price+'","case_price_prev":"'+rawdata.case_price_prev+'","case_qty":"'+rawdata.case_qty+'","case_size":"'+rawdata.case_size+'","description":"'+rawdata.description+'","grid_image":"'+rawdata.cover_image+'","list_image":"'+rawdata.cover_image+'","line_cost":"0","product_code":"'+rawdata.product_code+'","product_id":"'+rawdata.product_id+'","product_name":"'+rawdata.product_name+'","promo_type":"'+rawdata.promo_type+'","split_price":"'+rawdata.split_price+'","split_price_prev":"'+rawdata.split_price_prev+'","split_qty":"'+rawdata.split_qty+'","unit_size":"'+rawdata.unit_size+'"}]}');

      //parse values and return product data
      ParseResultsPanelData(ProductCardInfo,"Grid","add",false,ProductView.RenderProductView,AdditionalParams,"");

      //Image Slider
      var productslide="";
      var productslider="";

      //if there's a cover image put it in the first slot on the sider
      if(Validation.isNotDefined(data.cover_image)==false)
      {
        //If there's an image on the results page - make that the first slide
        productslide='{"productslide_image":"'+Global.imageDir+Global.imageSubFolder[2]+"/"+data.cover_image+'","productslide_caption":"'+Validation.CleanData_GeneralTxtOnly(data.product_name)+'"},';
      }

      //If there's alternate images add them to the slider
      if(Validation.ArrayisEmpty(data.alt_images)==false)
      {
        //If there's alternate images load them into the slider
        //Format recurring list data for template
        $.each(data.alt_images, function( i, val )
        {
          productslide=productslide+'{"productslide_image":"'+Global.imageDir+Global.imageSubFolder[2]+"/"+val+'","productslide_caption":"'+Validation.CleanData_GeneralTxtOnly(data.product_name)+'"},';
        });
      }
      else
      {
        //If there's neither - show the static placeholder
        if(Validation.isNotDefined(data.cover_image)==true)
        {
          productslide='{"productslide_image":"'+Global.imagePlaceholder+'","productslide_caption":"'+Validation.CleanData_GeneralTxtOnly(data.product_name)+'"},';
        }
      }
      productslider=JSON.parse('{"product_slider":['+productslide.slice(0,-1)+']}');

      //erudus icons
      //if there's a cover image put it in the first slot on the sider
      var Erudusicons=GetErudusIconList(rawdata);

      //Tab Panels
      var TabPanels=GetTabData(rawdata);

      RequestSuccessCallback(productslider,Erudusicons,TabPanels);
    }
  };

  var GetErudusIconList=function(rawdata)
  {
    if(Validation.isNotDefined(rawdata.detail.erudusiconset)==true)
    {
      //If no data recieved
      console.warn("No Data Recieved By erudus Component");
      return "";
    }
    else
    {
      var ErudusRAW=rawdata.detail.erudusiconset;
      var ErudusItems="";

      if(ErudusRAW.lablist.length)
      {
        $.each(ErudusRAW.lablist, function( i, val )
        {
          ErudusItems=ErudusItems+'{"Erudusicon":"/images/allergens/circle-'+ErudusRAW.vallist[i]+'.svg","ErudusName":"'+ErudusRAW.lablist[i]+'"},';
        });

        return(JSON.parse('{"erudus":['+ErudusItems.slice(0,-1)+']}'));
      }
      else
      {
        return "";
      }
    }
  };

  var GetTabData=function(rawdata)
  {
    if(Validation.isNotDefined(rawdata.detail)==true)
    {
      //If no data recieved
      console.warn("No Data Recieved By Tabs Component");
      return "";
    }
    else
    {
      var TabListRaw=rawdata.detail;
      var TabTitles=[];

      var Ingredients=[];
      var Nutrients="";
      var Allergens="";
      var Suitablility="";
      var Accreditations="";
      var Handling=[];
      var Packaging=[];

      //Ingredients
      if(Validation.isNotDefined(TabListRaw.ingredients)==false)
      {
        TabTitles.push("Ingredients");
        Ingredients='[{"ingredientlist":"'+Validation.CleanData_GeneralTxtOnly(TabListRaw.ingredients)+'"}]';
      }

      //Nutrients
      var NutrientValues=[];
      if(Validation.isNotDefined(TabListRaw.nutrients)==false)
      {
        TabTitles.push("Nutrients");
        if(Validation.isNotDefined(TabListRaw.nutrients.lablist)==false)
        {

          $.each(TabListRaw.nutrients.lablist, function( i, val )
          {
            NutrientValues=NutrientValues+'{"nutrientname":"'+Validation.CleanData_GeneralTxtOnly(TabListRaw.nutrients.lablist[i])+'","nutrientvalue":"'+Validation.CleanData_GeneralTxtOnly(TabListRaw.nutrients.vallist[i])+'"},';
          });

          Nutrients='['+NutrientValues.slice(0,-1)+']';
        }
      }

      //Allergens - Contains / Artificial Sweetners
      var allergenValues=[];
      var SuitablilityValues="";
      if(Validation.isNotDefined(TabListRaw.allergens)==false || Validation.isNotDefined(TabListRaw.artificial)==false || Validation.isNotDefined(TabListRaw.dietary)==false)
      {
        TabTitles.push("Allergens");

        if(Validation.isNotDefined(TabListRaw.allergens)==false)
        {
          //Contains
          $.each(TabListRaw.allergens.lablist, function( i, val )
          {
            allergenValues=allergenValues+'{"allergen":"'+Validation.CleanData_GeneralTxtOnly(TabListRaw.allergens.lablist[i])+'","Suitable":"'+Validation.CleanData_GeneralTxtOnly(TabListRaw.allergens.vallist[i])+'"},';
          });

          Allergens='['+allergenValues.slice(0,-1)+']';
        }

        //Artificial Sweetners
        if(Validation.isNotDefined(TabListRaw.artificial)==false)
        {
          $.each(TabListRaw.artificial, function( key, val )
          {
            allergenValues=allergenValues+'{"allergen":"'+Validation.CleanData_GeneralTxtOnly(key)+'","Suitable":"'+Validation.CleanData_GeneralTxtOnly(val)+'"},';
          });

          Allergens='['+allergenValues.slice(0,-1)+']';
        }

        //Allergens - Suitibility
        if(Validation.isNotDefined(TabListRaw.dietary)==false)
        {

          $.each(TabListRaw.dietary, function( key, val )
          {
            SuitablilityValues=SuitablilityValues+'{"allergen":"'+Validation.CleanData_GeneralTxtOnly(key)+'","Suitablility":"'+Validation.CleanData_GeneralTxtOnly(val)+'"},';
          });

          Suitablility='['+SuitablilityValues.slice(0,-1)+']';
        }
      }

      //Accreditations
      var AccreditationValues=[];
      if(Validation.isNotDefined(TabListRaw.accreditations)==false)
      {
        TabTitles.push("Accreditations");


        $.each(TabListRaw.accreditations.lablist, function( i, val )
        {
          AccreditationValues=AccreditationValues+'{"accreditationicon":"'+Validation.CleanData_GeneralTxtOnly(TabListRaw.accreditations.icons[i])+'","accreditationvalue":"'+Validation.CleanData_GeneralTxtOnly(TabListRaw.accreditations.list[i])+'"},';
        });

        Accreditations='['+AccreditationValues.slice(0,-1)+']';
      }

      //Handling & Cooking
      if(Validation.isNotDefined(TabListRaw.handling)==false)
      {
        TabTitles.push("Handling & Cooking");
        Handling='[{"directions":"'+Validation.CleanData_GeneralTxtOnly(TabListRaw.handling["Directions For Use"])+'","storage":"'+Validation.CleanData_GeneralTxtOnly(TabListRaw.handling["Storage Instructions"])+'"}]';
      }

      //Packaging
      var PackagingValues=[];
      if(Validation.isNotDefined(TabListRaw.inner)==false)
      {
        TabTitles.push("Packaging");

        $.each(TabListRaw.inner, function( key, val )
        {
          PackagingValues=PackagingValues+'{"pkname":"'+Validation.CleanData_GeneralTxtOnly(key)+'","pkval":"'+Validation.CleanData_GeneralTxtOnly(val)+'"},';
        });

        Packaging='['+PackagingValues.slice(0,-1)+']';
      }

      //Pdf
      var erudusPDF=[];
      if(Validation.isNotDefined(TabListRaw.pdf)==false)
      {
        erudusPDF='[{"eruduspdf":"'+Global.pdfDir+Validation.CleanData_GeneralTxtOnly(TabListRaw.pdf)+'"}]';
      }

      //Process Titles
      var TitleData="";
      var TabActive="N";
      $.each(TabTitles, function( i, val )
      {
        if(i==0)
        {
          TabActive="Y";
        }
        else {
          TabActive="N";
        }

        TitleData=TitleData+'{"tabname":"'+Validation.CleanData_GeneralTxtOnly(TabTitles[i])+'","tabvalue":"'+i+'","tabactive":"'+TabActive+'"},';
      });

      var Titles='['+TitleData.slice(0,-1)+']';

      //Convert all sections into JSON
      var TabData=JSON.parse('{"tabdata":[{"tabtitles":'+Titles+'},{"Ingredients":'+Ingredients+'},{"Nutrients":'+Nutrients+'},{"dietary":[{"Allergens":'+Allergens+'},{"Suitablility":'+Suitablility+'},{"Accreditations":'+Accreditations+'}]},{"Handling":'+Handling+'},{"Packaging":'+Packaging+'},{"epdf":'+erudusPDF+'}]}');
      return(TabData);
    }
  };

  //LISTS --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetListData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.lists)==true||rawdata.list_count==0)
    {
      //If no data recieved
      RequestNoResultsCallback();
    }
    else
    {
      var listdata=rawdata.lists;
      var parsedList="";

      $.each(listdata, function( i, val )
      {
        var LastModifiedTimeAgo=$.timeago(listdata[i].updated_ts);
        parsedList=parsedList+'{"list_id":"'+listdata[i].list_id+'","list_name":"'+listdata[i].list_name+'","list_owner":"'+listdata[i].owner_name+'","list_line_count":"'+listdata[i].line_count+'","list_modified":"'+LastModifiedTimeAgo+'"},';
      });

      RequestSuccessCallback(JSON.parse('{"lists":['+parsedList.slice(0,-1)+']}'),AdditionalParams[0],rawdata.list_count);
    }
  };

  var GetListDownloadData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.lines)==true||rawdata.line_count==0)
    {
      //If no data recieved
      RequestNoResultsCallback();
    }
    else
    {
      var listdownloaddata=rawdata.lines;
      var parseddownloadList="";

      $.each(listdownloaddata, function( i, val )
      {
        parseddownloadList=parseddownloadList+'{"product_name":"'+listdownloaddata[i].product_card.product_name+'"},';
      });

      RequestSuccessCallback(JSON.parse('{"listdetailsdownload":['+parseddownloadList.slice(0,-1)+']}'),rawdata.list_name);
    }
  };


  //ORDER HISTORY -------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetOrderHistoryData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.orders)==true||rawdata.order_count==0)
    {
      //If no data recieved
      RequestNoResultsCallback();
    }
    else
    {
      var orderhistrow=rawdata.orders;
      var parsedOrder="";

      $.each(orderhistrow, function( i, val )
      {
        var SubmittedDate=Utillities.parseUTCDateFormat(orderhistrow[i].order_written_ts,1);
        var DeliveredDate=Utillities.parseUTCDateFormat(orderhistrow[i].delivery_date,1);
        var totalcost=Utillities.formatPrice(orderhistrow[i].total_cost);
        parsedOrder=parsedOrder+'{"order_customer_id":"'+orderhistrow[i].customer_order_id+'","order_list_id":"'+orderhistrow[i].list_id+'","order_owner":"'+orderhistrow[i].owner_name+'","order_submitted":"'+SubmittedDate+'","order_delivery":"'+DeliveredDate+'","order_lines":'+orderhistrow[i].product_count+',"order_total":"'+totalcost+'"},';
      });

      RequestSuccessCallback(JSON.parse('{"orderhistory":['+parsedOrder.slice(0,-1)+']}'),AdditionalParams[0],rawdata.order_count);
    }
  };

  //ORDER REQUEST -------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetOrderRequestData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    //If the user is an approver show the add button
    if(Validation.isNotDefined(rawdata.requests)==true||rawdata.request_count==0)
    {
      //If no data recieved
      RequestNoResultsCallback();
    }
    else
    {
      var orderreqrow=rawdata.requests;
      var parsedOrder="";

      $.each(orderreqrow, function( i, val )
      {
        var SubmittedDate=Utillities.parseUTCDateFormat(orderreqrow[i].requested_ts,1);
        var totalcost=Utillities.formatPrice(orderreqrow[i].total_cost);
        parsedOrder=parsedOrder+'{"order_customer_id":"'+orderreqrow[i].list_id+'","order_list_id":"'+orderreqrow[i].list_id+'","order_owner":"'+orderreqrow[i].owner_name+'","order_submitted":"'+SubmittedDate+'","order_status":"'+orderreqrow[i].request_status+'","order_lines":'+orderreqrow[i].line_count+',"order_total":"'+totalcost+'"},';
      });

      RequestSuccessCallback(JSON.parse('{"orderrequest":['+parsedOrder.slice(0,-1)+']}'),AdditionalParams[0],rawdata.request_count,Utillities.UserSubType(2));
    }
  };

  var GetOrderSummaryData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.lines)==true||rawdata.product_count==0)
    {
      //If no data recieved
      RequestNoResultsCallback();
    }
    else
    {
      var ordersummary=rawdata.lines;
      var parsedOrderSummary="";
      var lineprice="";
      var totalcost=Utillities.formatPrice(rawdata.total_cost);

      $.each(ordersummary, function( i, val )
      {
        //Order ID list_id
        //Order Title list_name / product_count
        //Order Total total_cost

        var totalQty="";
        if(ordersummary[i].case_qty>0 && ordersummary[i].split_qty>0)
        {
          totalQty=ordersummary[i].case_qty+" Case"+Utillities.GrammarCorrect(ordersummary[i].case_qty)+", "+ordersummary[i].split_qty+" Split"+Utillities.GrammarCorrect(ordersummary[i].split_qty);
        }

        if(ordersummary[i].case_qty>0 && ordersummary[i].split_qty==0)
        {
          totalQty=ordersummary[i].case_qty+" Case"+Utillities.GrammarCorrect(ordersummary[i].case_qty);
        }

        if(ordersummary[i].case_qty==0 && ordersummary[i].split_qty>0)
        {
          totalQty=ordersummary[i].split_qty+" Split"+Utillities.GrammarCorrect(ordersummary[i].split_qty);
        }

        lineprice=Utillities.formatPrice(ordersummary[i].line_cost);

        parsedOrderSummary=parsedOrderSummary+'{"product_name":"'+ordersummary[i].product_name+'","product_code":"'+ordersummary[i].product_code+'","product_category":"'+ordersummary[i].category_name_full+'","product_qty":"'+totalQty+'","product_row_price":"'+lineprice+'"},';
      });


      //Last Row MUST to append the Total Cost for the PDF download - temporary solution.
      parsedOrderSummary=parsedOrderSummary+'{"product_name":"","product_code":"","product_category":"","product_qty":"Total","product_row_price":"'+totalcost+'"},';

      RequestSuccessCallback(JSON.parse('{"orderdetails":['+parsedOrderSummary.slice(0,-1)+']}'),rawdata.list_name,rawdata.product_count);
    }
  };

  //BASKET
  //Parse Basket Data -------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetBasketData=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    if(Validation.isNotDefined(rawdata.products)==true)
    {
      //If no data recieved
      console.warn('No Data Recieved By basket Component');
      RequestNoResultsCallback();
    }
    else
    {
      //Basket products are in an array called product, with the actual product detail in a sub section called product_card - reformat it to parse the data the same way.
      var productinfo="";
      $.each(rawdata.products, function( i, val )
      {
        //The List line Id - required to modify the quantity in the basket, is not in the product card - append it to each row.
        productinfo=productinfo+(JSON.stringify(rawdata.products[i].product_card).slice(0,-1))+',"list_line_id":'+rawdata.products[i].list_line_id+'},';
      });

      var reformattedProducts=JSON.parse('{"products":['+productinfo.slice(0,-1)+'],"product_count":'+rawdata.product_count+',"total_cost":'+rawdata.total_cost+'}');

      var ResultsRAW=reformattedProducts;
      ParseResultsPanelData(ResultsRAW,"Row","add",false,RequestSuccessCallback,AdditionalParams,"");
    }
  };


  //CHECKOUT
  //Checkout data -----------------------------------------------------------------------------------------------------------------------------------------------------------------------

  var GetALLCheckoutdata=function(rawdata,DataType,RequestSuccessCallback,NoDataCallback,AdditionalParams)
  {
    if(Validation.isNotDefined(rawdata.order_lines)==true)
    {
      Checkout.BasketEmpty();
    }
    else
    {
      GetCheckoutDeliveryDates(rawdata);
      GetCheckoutOutOfStock(rawdata,DataType,Checkout.RenderOutOfStock,Checkout.NoOutOfStockResults,AdditionalParams);
      GetCheckoutDelistedStock(rawdata,DataType,Checkout.RenderDelistedItems,Checkout.NoDelistedResults,AdditionalParams);
      GetCheckoutOutOfRange(rawdata,DataType,Checkout.RenderOutOfRangeItems,Checkout.NoOutOfRangeResults,AdditionalParams);
      GetCheckoutRecommendations(rawdata,DataType,Checkout.RenderReccomendations,Checkout.NoReccommendedResults,AdditionalParams);
      GetCheckoutInStock(rawdata,DataType,Checkout.RenderInStock,Checkout.NoInStockResults,AdditionalParams);
    }
  };

  //Parse Out Of Stock Data ------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetCheckoutOutOfStock=function(rawdata,DataType,RequestSuccessCallback,NoDataCallback,AdditionalParams)
  {
    if(Validation.isNotDefined(rawdata.out_of_stock)==true)
    {
      //If no data recieved
      console.warn('No Data Recieved By Out Of Stock Component');
      NoDataCallback();
    }
    else
    {
      var OutOfStockProductsRAW=rawdata.out_of_stock;
      var OutOfStockProducts=JSON.stringify(OutOfStockProductsRAW);

      ParseResultsPanelData(JSON.parse('{"products":'+OutOfStockProducts+'}'),"Checkout_OutOfStock","",false,RequestSuccessCallback,AdditionalParams,"");
    }
  };

  //Parse Out Of Stock Data ------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetCheckoutDelistedStock=function(rawdata,DataType,RequestSuccessCallback,NoDataCallback,AdditionalParams)
  {
    if(Validation.isNotDefined(rawdata.delisted)==true)
    {
      //If no data recieved
      console.warn('No Data Recieved By Delisted Component');
      NoDataCallback();
    }
    else
    {
      var DelistedProductsRAW=rawdata.delisted;
      var DelistedProducts=JSON.stringify(DelistedProductsRAW);

      ParseResultsPanelData(JSON.parse('{"products":'+DelistedProducts+'}'),"Checkout_Delisted","",false,RequestSuccessCallback,AdditionalParams,"");
    }
  };

  //Parse Out Of Stock Data ------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetCheckoutOutOfRange=function(rawdata,DataType,RequestSuccessCallback,NoDataCallback,AdditionalParams)
  {
    if(Validation.isNotDefined(rawdata.out_of_range)==true)
    {
      //If no data recieved
      console.warn('No Data Recieved By Out Of Range Component');
      NoDataCallback();
    }
    else
    {
      var OutOfRangeProductsRAW=rawdata.out_of_range;
      var OutOfRangeProducts=JSON.stringify(OutOfRangeProductsRAW);

      ParseResultsPanelData(JSON.parse('{"products":'+OutOfRangeProducts+'}'),"Checkout_OutOfRange","",false,RequestSuccessCallback,AdditionalParams,"");
    }
  };

  //Parse Recommendations Data ---------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetCheckoutRecommendations=function(rawdata,DataType,RequestSuccessCallback,NoDataCallback,AdditionalParams)
  {
    if(Validation.isNotDefined(rawdata.products)==true)
    {
      //If no data recieved
      //NoDataCallback();
    }
    else
    {
      var RecommendationsRAWProducts=rawdata.products;
      var RecommendedItems="";

      $.each(RecommendationsRAWProducts, function( i, val )
      {
        RecommendedItems=RecommendedItems+JSON.stringify(RecommendationsRAWProducts[i].product_card)+",";
      });

      ParseResultsPanelData(JSON.parse('{"products":['+RecommendedItems.slice(0,-1)+'],"products_available":'+rawdata.product_count+'}'),"Checkout_Recommendations","",false,RequestSuccessCallback,AdditionalParams,"");
    }
  };

  var GetCheckoutErudusData=function(rawdata,DataType,RequestSuccessCallback,NoDataCallback,AdditionalParams)
  {
    if(Validation.isNotDefined(rawdata.detail.erudusiconset)==true)
    {
      //If no data recieved
      NoDataCallback("No Data Recieved By "+DataType+" Component");
    }
    else
    {
      var ErudusRAW=rawdata.detail.erudusiconset;
      var ErudusItems="";

      if(ErudusRAW.lablist.length)
      {
        $.each(ErudusRAW.lablist, function( i, val )
        {
          ErudusItems=ErudusItems+'{"Erudusicon":"'+ErudusRAW.lablist[i]+'","ErudusClass":"'+ErudusRAW.vallist[i]+'"},';
        });

        RequestSuccessCallback(JSON.parse('{"erudus":['+ErudusItems.slice(0,-1)+']}'),rawdata.detail.description,AdditionalParams);
      }
    }
  };

  //Parse In Stock Data ----------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetCheckoutInStock=function(rawdata,DataType,RequestSuccessCallback,NoDataCallback,AdditionalParams)
  {
    var InStockData;
    if(Validation.isNotDefined(rawdata.order_lines)==true)
    {
      //If no data recieved
      console.warn('No Data Recieved By in stock Component');
      NoDataCallback();
    }
    else
    {
      var ResultsRAWProducts=rawdata.order_lines;
      var InStockProducts=JSON.stringify(ResultsRAWProducts);

      ParseResultsPanelData(JSON.parse('{"products":'+InStockProducts+'}'),"Checkout_InStock","",false,RequestSuccessCallback,AdditionalParams,"");
    }
  };

  //Parse In Stock Data ----------------------------------------------------------------------------------------------------------------------------------------------------------------
  var GetCheckoutDeliveryDates=function(rawdata)
  {
    if(Validation.isNotDefined(rawdata.delivery_dates)==true)
    {
      //If no data recieved by this - checkout can't work, critical error
      console.warn('No Data Recieved By shipping dates Component');
    }
    else
    {
      var ResultsRAWDeliveryDates=rawdata.delivery_dates;
      var DeliverySelect="";

      var orderref="N";
      if(rawdata.order_ref_required)
      {
        orderref="Y";
      }

      //Parse Shipping Dates Available
      $.each(ResultsRAWDeliveryDates, function( i, val )
      {
        var SelectVal="";
        var SelectText="";

        //identify row thats selected by default
        var selectedRow="";
        if(val==rawdata.default_delivery_date)
        {
          selectedRow="selected";
        }

        //Parse date into display version & Value version for select boxes
        SelectVal=Utillities.parseUTCDateFormat(val,0); //YYY-MM-DD
        SelectText=Utillities.parseUTCDateFormat(val,1); //Friday 10 May 2019

        //return in JSON format
        DeliverySelect=DeliverySelect+'{"deliverydateval":"'+SelectVal+'","deliverydatetext":"'+SelectText+'","selected":"'+selectedRow+'"},';
      });

      //Total Cost
      var total_cost=Utillities.formatPrice(0);
      if(Validation.isNotDefined(rawdata.summary.total_cost)==false)
      {
        total_cost=Utillities.formatPrice(parseInt(rawdata.summary.total_cost));
      }

      Checkout.RenderDeliveryDates(JSON.parse('{"summary":[{"deliverydates":['+DeliverySelect.slice(0,-1)+'],"total_cost":"'+total_cost+'","puchaseorderreq":"'+orderref+'"}]}'));
    }
  };

  //Checkout --
  var GetCheckoutStock=function(_rawdata,_DataType,_RequestSuccessCallback,_NoDataCallback,_AdditionalParams)
  {
    //Flag to determine if there's still out of stock items in the basket
    var OutOfStockItems=false;
    if( _rawdata.out_of_stock.length)
    {
      OutOfStockItems=true;
    }

    //Flag to determine if there's Out of range items still in the basket
    var OutOfRangeItems=false;
    if( _rawdata.out_of_range.length)
    {
      OutOfRangeItems=true;
    }

    //Flag to determine if there's delisted items still in the basket
    var DelistedItems=false;
    if( _rawdata.delisted.length)
    {
      DelistedItems=true;
    }

    //Flag to determine if purchase order must be filled in

    var PurchaseOrderReq=false;
    if(_rawdata.order_ref_required)
    {
      PurchaseOrderReq=_rawdata.order_ref_required;
    }

    _RequestSuccessCallback(OutOfStockItems,OutOfRangeItems,DelistedItems,PurchaseOrderReq,_AdditionalParams);

  };

  //Footer
  var GetFooterLinks=function(rawdata,DataType,AdditionalParams,RequestNoResultsCallback,RequestSuccessCallback)
  {
    console.log(rawdata);
  };

  //return functions required by the page ***********************************************************************************************************************************************
  return{
    IdentifyProcessType:IdentifyProcessType
  };
})();
