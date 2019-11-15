//Results Panel ===================================================================================================================================================================
var ResultsPanel =(function ()
{
  //ADD BUTTONS ===========================================================================================================================================================================
  var getPanelInfo=function(elemtID,Callbackfn)
  {
    //IDs must have the format "JSPanelName_Action_itemID" for NON duplicated sections - if it has a duplicate

    var ElementIds=elemtID.split("_");
    var PanelName=ElementIds[0];
    var ElementType=ElementIds[1];
    var itemID=ElementIds[2];
    var IDdisplayversion="";
    var CaseQty=0;
    var SplitQty=0;

    if(isNaN(ElementIds[2])&&Validation.isNotDefined(ElementIds[2])==false)
    {
      //If there's a letter at the end of the item ID, there's duplicate sections on the page
      itemID=ElementIds[2].slice(0,-1);
      IDdisplayversion=ElementIds[2].charAt(ElementIds[2].length - 1);
    }

    //Get the current value from the specific version edited
    var CurrentQty=parseInt($("#"+PanelName+"_Qty_"+ElementIds[2]).val());
    var ListLine=$("#"+PanelName+"_ListLine_"+itemID).text();
    var CaseSplit=$("#"+PanelName+"_CaseSplit_"+itemID).val();

    Callbackfn(JSON.parse('{"PanelName":"'+PanelName+'","ElementType":"'+ElementType+'","itemID":"'+itemID+'","CaseSplit":"'+CaseSplit+'","CurrentQty":"'+CurrentQty+'","ListLine":"'+ListLine+'","IDdisplayversion":"'+IDdisplayversion+'"}'));
  };

  var switchCaseSplit=function(elemtID,CaseSplitVal)
  {
    var CaseSplitElementIds=elemtID.split("_");

    if(CaseSplitVal=="case")
    {
      //Offer Price
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_CasePricePrev_"+CaseSplitElementIds[2],"hide",2);
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_SplitPricePrev_"+CaseSplitElementIds[2],"hide",1);

      //Product Price
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_CasePrice_"+CaseSplitElementIds[2],"hide",2);
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_SplitPrice_"+CaseSplitElementIds[2],"hide",1);

      //Product Units
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_CaseUnitSize_"+CaseSplitElementIds[2],"hide",2);
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_SplitUnitSize_"+CaseSplitElementIds[2],"hide",1);
    }
    else
    {
      //Offer Price
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_CasePricePrev_"+CaseSplitElementIds[2],"hide",1);
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_SplitPricePrev_"+CaseSplitElementIds[2],"hide",2);

      //Product Price
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_CasePrice_"+CaseSplitElementIds[2],"hide",1);
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_SplitPrice_"+CaseSplitElementIds[2],"hide",2);

      //Product Units
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_CaseUnitSize_"+CaseSplitElementIds[2],"hide",1);
      Utillities.ToggleClass("#"+CaseSplitElementIds[0]+"_SplitUnitSize_"+CaseSplitElementIds[2],"hide",2);
    }

    getPanelInfo(elemtID,ChangeQuantityInBasket);
  };

  var AddItemtoBasket=function(data)
  {
    //console.log(data);
    var addCaseQty=0;
    var addSplitQty=0;

    //Set the Quantity to 1
    if(data.CaseSplit=="case")
    {
      addCaseQty=1;
    }
    else
    {
      addSplitQty=1;
    }

    $("#"+data.PanelName+"_Qty_"+data.itemID).val(1);

    //Show the modify buttons and hide the add button - and show the item as in basket
    Utillities.ToggleClass("#"+data.PanelName+"_JSAddFirstSection_"+data.itemID,"hide",1);
    Utillities.ToggleClass("#"+data.PanelName+"_JSModifyButtonsSection_"+data.itemID,"hide",2);
    //Utillities.ToggleClass("#"+data.PanelName+"_JSorderticked_"+data.itemID,"hide",2);


    //Add new item to the basket
    var passJSONdata='{"case_qty":'+addCaseQty+',"product_id":'+data.itemID+',"split_qty":'+addSplitQty+'}';
    var additionalParams=[data.PanelName,data.itemID,"added"];

    RestAPI.RequestData("basketitems","post","",ResultsPanel.ConfirmBasketChange,RestAPI.APIError,RestAPI.APIError,additionalParams,passJSONdata);
  };

  var IncreaseQuantityInBasket=function(data)
  {
    //Add 1 to the current applicable value
    var increaseCaseQty=0;
    var increaseSplitQty=0;
    var currentVal=parseInt(data.CurrentQty);

    //Set the Quantity to 1
    if(data.CaseSplit=="case")
    {
      increaseCaseQty=currentVal+1;
    }
    else
    {
      increaseSplitQty=currentVal+1;
    }
    $("#"+data.PanelName+"_Qty_"+data.itemID).val(currentVal+1);

    //Update the basket
    //Add new item to the basket
    var passListItemID=$("#"+data.PanelName+"_ListLine_"+data.itemID).text();
    var passJSONdata='{"case_qty":'+increaseCaseQty+',"product_id":'+data.itemID+',"split_qty":'+increaseSplitQty+'}';
    var additionalParams=[data.PanelName,data.itemID,"edited"];

    RestAPI.RequestData("basketitems/"+passListItemID,"put","",ResultsPanel.ConfirmBasketChange,RestAPI.APIError,RestAPI.APIError,additionalParams,passJSONdata);
  };

  var ChangeQuantityInBasket=function(data)
  {
    var changeCaseQty=0;
    var changeSplitQty=0;
    var currentVal=parseInt(data.CurrentQty);

    //Get the current value from the specific version edited
    if(currentVal>=1)
    {
      //set all the Quantities to the same value

      if(data.CaseSplit=="case")
      {
        changeCaseQty=currentVal;
      }
      else
      {
        changeSplitQty=currentVal;
      }

      //Update the basket
      var passListItemID=$("#"+data.PanelName+"_ListLine_"+data.itemID).text();
      var passJSONdata='{"case_qty":'+changeCaseQty+',"product_id":'+data.itemID+',"split_qty":'+changeSplitQty+'}';
      var additionalParams=[data.PanelName,data.itemID,"edited"];

      RestAPI.RequestData("basketitems/"+passListItemID,"put","",ResultsPanel.ConfirmBasketChange,RestAPI.APIError,RestAPI.APIError,additionalParams,passJSONdata);
    }
    else
    {
      //if the value 0 (or less) - remove the item from the basket
      removefromBasket(data);
    }
  };

  var ReduceQuantityInBasket=function(data)
  {
    //Get the current value from the specific version edited
    var reduceCaseQty=0;
    var reduceSplitQty=0;
    var currentVal=parseInt(data.CurrentQty);

    //Get the current value from the specific version edited
    if(currentVal>1)
    {
      //set all the Quantities to the same value

      if(data.CaseSplit=="case")
      {
        reduceCaseQty=currentVal-1;
      }
      else
      {
        reduceSplitQty=currentVal-1;
      }

      $("#"+data.PanelName+"_Qty_"+data.itemID).val(currentVal-1);

      //Update the basket
        var passListItemID=$("#"+data.PanelName+"_ListLine_"+data.itemID).text();
        var passJSONdata='{"case_qty":'+reduceCaseQty+',"product_id":'+data.itemID+',"split_qty":'+reduceSplitQty+'}';
        var additionalParams=[data.PanelName,data.itemID,"edited"];

        RestAPI.RequestData("basketitems/"+passListItemID,"put","",ResultsPanel.ConfirmBasketChange,RestAPI.APIError,RestAPI.APIError,additionalParams,passJSONdata);
      }
      else
      {
        removefromBasket(data);
      }
  };

  var removefromBasket=function(data)
  {
    //If Qty is reduced to 0, set the Qty to 0 and hide the modify controls
    $("#"+data.PanelName+"_Qty_"+data.itemID).val(0);

    //Hide the modify buttons and hide the add button, and remove the in basket indicator
    Utillities.ToggleClass("#"+data.PanelName+"_JSAddFirstSection_"+data.itemID,"hide",2);
    Utillities.ToggleClass("#"+data.PanelName+"_JSModifyButtonsSection_"+data.itemID,"hide",1);
    Utillities.ToggleClass("#"+data.PanelName+"_JSorderticked_"+data.itemID,"hide",1);

    var additionalParams=[data.PanelName,data.itemID,"removed"];

    //Remove item from the basket
    var passListItemID=$("#"+data.PanelName+"_ListLine_"+data.itemID).text();

    //If it's a valid item in the basket - remove it
    if(passListItemID!==0)
    {
      RestAPI.RequestData("basketitems/"+passListItemID,"delete","",ResultsPanel.ConfirmBasketChange,RestAPI.APIError,RestAPI.APIError,additionalParams,"");

      //Clear old list line ID
      $("#"+data.PanelName+"_ListLine_"+data.itemID).text("");

      Utillities.UpdateProductCount("",2);
    }

  };

  var RemoveitemFromBasket=function(data)
  {
    //Remove link is pressed on item
    var passBasketItemID=$("#"+data.PanelName+"_ListLine_"+data.itemID).text();
    RestAPI.RequestData("basketitems/"+passBasketItemID,"delete","",ResultsPanel.RemoveBasketItemConfirmed,RestAPI.APIError,RestAPI.APIError,"#"+data.PanelName+"_"+data.itemID,"");
  };

  var RemoveBasketItemConfirmed=function(data,_AdditionalParams)
  {
    $(_AdditionalParams).remove();
    Utillities.UpdateProductCount("",2);
  };

  var ConfirmBasketChange=function(data,_AdditionalParams)
  {
    var PanelID=_AdditionalParams[0];
    var ProductID=_AdditionalParams[1];
    var Action=_AdditionalParams[2];

    var PanelDescription=$("#"+PanelID+"_JSDescription_"+ProductID).text();
    var PanelCaseSplit=$("#"+PanelID+"_CaseSplit_"+ProductID).val();
    var PanelCaseSize=parseInt($("#"+PanelID+"_ProductUnits_"+ProductID).text());
    var PanelQty=parseInt($("#"+PanelID+"_Qty_"+ProductID).val());

    //Update List ID - so if a product was added to the basket it can be modified
    $("#"+PanelID+"_ListLine_"+ProductID).text(data.list_line_id);

    //UpdateBasketTotals
    var newlinecost=Utillities.formatPrice(data.totals.total_cost);
    var newlinecount=data.totals.line_count;

    $("#"+PanelID+"_LinePrice_"+ProductID).text(newlinecost);

    console.log(PanelQty)
    console.log(PanelCaseSize)

    switch(Action)
    {
      case "added":
      console.log("Added");
      Utillities.Toaster(PanelQty+" "+PanelCaseSplit+" ("+PanelQty*PanelCaseSize+" unit"+Utillities.GrammarCorrect(PanelQty*PanelCaseSize)+") of "+PanelDescription+", added to Order",0);
      break;

      case "edited":
      console.log("edited");
      Utillities.Toaster("Order updated to "+PanelQty+" "+PanelCaseSplit+" ("+PanelQty*PanelCaseSize+" unit"+Utillities.GrammarCorrect(PanelQty*PanelCaseSize)+") of "+PanelDescription,0);
      break;

      case "removed":
      console.log("removed");
      Utillities.Toaster(PanelDescription+", removed from Order",0);
      if($(".JSpagetype").attr("id")=="order")
      {
        //If it's the my order page - remove the row.
        RemoveBasketItemConfirmed("","#"+PanelID+"_"+ProductID);
      }
      break;
    }

    AccountNavigation.SetBasketTotal(newlinecost,newlinecount);
  };

  var AddItemToList=function(PanelID)
  {
    //Get relevant lists to select
    RestAPI.RequestData("lists","get","AddItemToExistingList",ResultsPanel.AddToList,RestAPI.APIError,ResultsPanel.CreateNewList,PanelID,"");
  };

  var AddToList=function(data,PanelID)
  {
    //Render list items
    $("#JSAddToExistingListContent").empty();
    Lib_hbsclient.RenderTemplate("JSAddToExistingListTemplate",data,"JSAddToExistingListContent");

    //Set Product // ID
    $("#SelectedExistingProductRef").text(PanelID.substring(PanelID.lastIndexOf("_")+1,PanelID.length));

    //Show List
    MicroModal.show('ModalAddItemToExistingList');

    console.log(data);
    console.log(PanelID);
  };

  var SelectListToAddTo=function(PanelID)
  {
    //get the list Id from the selection
    SelectedListID=PanelID.substring(PanelID.lastIndexOf("_")+1,PanelID.length);

    console.log("Add To List - List "+SelectedListID+" selected");
    Utillities.ToggleClass("#"+PanelID,"active");
    $("#SelectedExistingListRef").text(SelectedListID);
  };

  AddItemToSelectedList=function(PanelID)
  {
    var SelectedList=parseInt($("#SelectedExistingListRef").text());
    var SelectedProduct=parseInt($("#SelectedExistingProductRef").text());

    //Close Modal-If the request fails, the toaster will handle it
    MicroModal.close('ModalAddItemToExistingList');

    //Add Item to the selected list
    RestAPI.RequestData("lists/"+SelectedList+"/items","post","",ResultsPanel.AddedToList,RestAPI.APIError,RestAPI.APIError,PanelID,'{"product_id":'+SelectedProduct+'}');
  };

  var AddedToList=function()
  {
    //Confirm it's added to the list
    console.log("Item Added To List");
  };

  var CreateNewList=function(PanelID)
  {
    //Create a List using an item

    //Set item ref to add
    $("#JSAddListProdref").text(Utillities.getProdID(PanelID));

    //Confirm action
    MicroModal.show('ModalAddItemToCreatedList');
  };

  var CreateListWithItem=function()
  {
    //If the input value is not blank
    if($("#JSListNameCreateWithItem").val()!=="")
    {
      Utillities.ToggleClass("#JSCreateListWithItemError","hide","1");
      var ListAndItem=JSON.parse(JSON.stringify('{"list_type_id":1,"shared":false,"list_name":"'+$("#JSListNameCreateWithItem").val()+'","deleted":false,"lines":[{"product_id":'+$("#JSAddListProdref").text()+',"case_qty":0,"split_qty":0}]}'));
      RestAPI.RequestData("lists","post","",ResultsPanel.CreateListWithItemSuccess,RestAPI.CreateListWithItemFail,ResultsPanel.CreateListWithItemFail,"",ListAndItem);
    }
    else
    {
      Utillities.ToggleClass("#JSCreateListWithItemError","hide","2");
    }
  };

  var CreateListWithItemSuccess=function()
  {
    MicroModal.close("ModalAddItemToCreatedList");
    Utillities.Toaster("New list created",0);
  };

  var CreateListWithItemFail=function()
  {
    Utillities.Toaster("Error creating list - please try again",1);
  };

  var RemoveListItem=function()
  {
    //Remove Item from a list
    var PanelID=$("#JSPanelRef").text();
    RestAPI.RequestData("lists/"+$("#JSRmListListref").text()+"/items/"+$("#JSRmListProdref").text(),"delete","",ResultsPanel.RemoveListItemSuccess,RestAPI.RemoveListItemFail,ResultsPanel.RemoveListItemFail,PanelID,"");
  };

  var RemoveListItemSuccess=function(PanelID)
  {
    $("#"+PanelID).remove();
    UpdateProductCount(0,0);
    MicroModal.close("ModalAddItemToCreatedList");
    Utillities.Toaster("Item removed from list",0);
  };

  var RemoveListItemFail=function()
  {
    Utillities.Toaster("Error removing item from list - please try again",1);
  };

  //Page Bindings -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  var PageBindings=function()
  {
    //Initial add of item
    $("body").on("click",".JSAddBtn",function()
    {
      console.log("add");
      getPanelInfo($(this).attr("id"),AddItemtoBasket);
    });

    //Change (or Remove) Quantity
    $("body").on("change",".JSItemQty",function()
    {
      console.log("Change Quantity");
      getPanelInfo($(this).attr("id"),ChangeQuantityInBasket);
    });

    //Increase Quantity
    $("body").on("click",".JSPlusBtn",function()
    {
      console.log("Increase Quantity");
      getPanelInfo($(this).attr("id"),IncreaseQuantityInBasket);
    });

    //Reduce (or Remove) Quantity
    $("body").on("click",".JSMinusBtn",function()
    {
      console.log("Reduce Quantity");
      getPanelInfo($(this).attr("id"),ReduceQuantityInBasket);
    });

    //Remove Item from Basket
    $("body").on("click",".JSRemoveItem",function()
    {
      console.log("Remove Item");
      getPanelInfo($(this).attr("id"),RemoveitemFromBasket);
    });

    //Switch Case/Split selected
    $("body").on("change",".JSCaseSplit",function()
    {
      console.log("Switch Case/Split price");
      switchCaseSplit($(this).attr("id"),$(this).val());
    });

    //Add Item To List
    $("body").on("click",".JSAddtolist",function(e)
    {
      e.preventDefault();
      console.log("Add Item To List");
      AddItemToList($(this).attr("id"));
    });

    //select list to add item to
    $("body").on("click",".JSSelectListToAddItemTo",function()
    {
      SelectListToAddTo($(this).attr("id"));
    });

    $("body").on("click","#JSAddToExistingListConfirmed",function()
    {
      AddItemToSelectedList($(this).attr("id"));
    });

    $("body").on("click","#JSAddItemToCreatedList_Confirm",function()
    {
      CreateListWithItem();
    });

    $("body").on("click",".JSRemoveFromlist",function(e)
    {
      e.preventDefault();
      var PanelID=$(this).attr("id").substring($(this).attr("id").indexOf("prd"),$(this).attr("id").length);

      var ProdListID=PanelID.substring(PanelID.lastIndexOf("_")+4,PanelID.length);
      var PageListID=Utillities.getURLID();
      $("#JSPanelRef").text($(this).attr("id"));
      $("#JSRmListProdref").text(ProdListID);
      $("#JSRmListListref").text(PageListID);

      MicroModal.show("ModalRemoveItemFromList");
    });

    $("body").on("click","#JSRemoveItemFromList_Confirm",function(e)
    {
      RemoveListItem();
    });
  };

  //return functions required by the page *************************************************************************************************************************************
  return{
    PageBindings:PageBindings,
    ConfirmBasketChange:ConfirmBasketChange,
    RemoveBasketItemConfirmed:RemoveBasketItemConfirmed,
    AddToList:AddToList,
    AddedToList:AddedToList,
    CreateNewList:CreateNewList,
    CreateListWithItem:CreateListWithItem,
    CreateListWithItemSuccess:CreateListWithItemSuccess,
    CreateListWithItemFail:CreateListWithItemFail,
    RemoveListItemSuccess:RemoveListItemSuccess,
    RemoveListItemFail:RemoveListItemFail
  };
})();


ResultsPanel.PageBindings();
