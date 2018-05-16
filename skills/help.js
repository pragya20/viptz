function getResponseFromViptela(startDateStr, endDateStr, counter,callback){

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  //var data1=require('/help.js');
  var request = require('request'),
    username = "admin",
    password = "admin",
    countStr = "&&count=" +String(counter);
    
  var url = "https://198.18.1.10/dataservice/data/device/statistics/alarm?startDate="+startDateStr+"&endDate="+endDateStr+"&"+countStr,
   auth = "Basic " + new Buffer(username + ":" + password).toString("base64");

  
  var resData;
  var req = request(
    { 
        url : url,
        headers : {
            "Authorization" : auth
        }
    },
    function (error, response, body) {
      var creticalIssuesList = [];
      var jsonData = JSON.parse(body);
      date1= Date(jsonData.data[0].entry_time);
      
      console.log(date1);
      for(var i in jsonData.data){

        if(jsonData.data[i].severity=="Critical"){

          //console.log(jsonData.data[i].severity);
          //console.log(jsonData.data[i].message);
          
          var currentDate =  Date(jsonData.data[i].entry_time);

          criticalIssueContext = {"severity": jsonData.data[i].severity, "message": jsonData.data[i].message, "date": currentDate,};
          
          creticalIssuesList.push(criticalIssueContext);
          
        }
      }

      //console.log(creticalIssuesList);
      //console.log("this is end of request");
      console.log("this is start of request");
      return callback( creticalIssuesList);
  
    }
  )
  //console.log(req);

  //  req.on('end', function(){

  //   console.log("this is end of request");
  //  });
}
getResponseFromViptela("2018-05-14T00:00:00","2018-05-15T00:00:00",1000,function(response)
{
  //console.log(response);
  var Criticalresponselist=response;
  console.log("--------------------------------------------------------");
  console.log(Criticalresponselist);
});


module.exports = function(controller) {

  controller.hears(['Network status', 'network status', 'Network', 'network','What is my network status'], 'direct_message,direct_mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {
        convo.say("Here is a list of Critical network alarms in last 24 hours ::");
        
        getResponseFromViptela("2018-05-14T00:00:00","2018-05-15T00:00:00",100,function(response)
        {
          var criticalAlerts=response;
         
          var j=0;
          for(var i in criticalAlerts)
          {
             j=j+1;
            convo.say("Alarm "+ j);
            convo.say("severity = "+ criticalAlerts[i].severity);
            convo.say("message = "+ criticalAlerts[i].message);
            convo.say("------------------------------------------------------------------------------------------------------------------");
          } 
          //console.log(criticalAlerts);
          //return criticalAlerts;
        });

        
       
        

         
        

        
        /*
        for(i in critical Alerts){
          console.log("Occurance Time : "+criticalAlerts[i].date);
          convo.say("Occurance Time : "+criticalAlerts[i].date);
        }*/
    });
  });
}