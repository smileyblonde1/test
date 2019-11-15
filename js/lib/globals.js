var Global =(function ()
{
  //Site Global Variables
  var APIDir                 = "/api/v1/";
  var SearchFilterSelection = Utillities.ReadCookie("searchfilterselected");
  var siteNm                = window.location.origin;
  var awsimgs               = "https://443ai.s3.eu-west-2.amazonaws.com";
  var imageDir              = awsimgs+"/savona/img/";
  var pdfDir                = awsimgs+"/savona/pdf/";
  var imagePlaceholder      = "/images/placeholder.png";
  var imageSubFolder        = ["p.grid","p.list","p.page","p.thumb"];

  //return functions required by the page ***************************************************************************************************************************************************
  return {
    APIDir:APIDir,
    SearchFilterSelection:SearchFilterSelection,
    siteNm:siteNm,
    imageDir:imageDir,
    pdfDir:pdfDir,
    imagePlaceholder:imagePlaceholder,
    imageSubFolder:imageSubFolder,
  };
})();
