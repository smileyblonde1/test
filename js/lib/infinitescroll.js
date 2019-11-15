//INFINITE SCROLL =========================================================================================================================
var InfiniteScroll =(function ()
{
  //To prevent the same page loading twice, ignore requests for a page already submitted
  //this happens because sometimes it's quick scrolling down and doesn't update before it runs
  CurrentPage=0;

  var ScrollingTrigger=function(NextPage,CallbackNm,ProductCount,PageSize)
  {
    //Trigger Infinite Scroll 75% down the page
    var PageHeight=parseInt(Utillities.GetPageHeight());
    var TriggerHeight=PageHeight-(PageHeight*0.75);

    //Trigger Load of Next Page
    $(window).scroll(function()
    {
      if($(window).scrollTop() + $(window).height() >= TriggerHeight) {
        LoadMore(NextPage,CallbackNm,ProductCount,PageSize);
      }
    });
  };

  var LoadMore=function(NextPage,CallbackNm,ProductCount,PageSize)
  {
    if(NextPage>CurrentPage)
    {
      var MaxPage=Math.ceil(ProductCount/PageSize); //round up fractions to integer

      //Load a MAX of 20 pages of products
      if(NextPage<20 && NextPage<=MaxPage)
      {
        //Load in next set of results
        CallbackNm(NextPage);
        CurrentPage=NextPage;
      }
    }
  };

  //return functions required by the page ****************************************************************************************************
  return{
    ScrollingTrigger:ScrollingTrigger,
    LoadMore:LoadMore
  };
})();
