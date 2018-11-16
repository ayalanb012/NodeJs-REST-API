const StatsEntry = require("../modules/statsEntry");
const PrevIP = require("../modules/prevIP");
var getIP = require('ipware')().get_ip;

exports.get_prev_count = (req, res) => {
  StatsEntry.find({requestType: 'PREV'})
  .select("counter")
  .exec()
  .then(docs => {
     var totalRequests = 0;
     docs.forEach(doc => {
        totalRequests = totalRequests + doc.counter
      })
    updateStats('TOTAL',getIP(req).clientIp);
    res.status(200).json({ "Total PREV requests": totalRequests});
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err.message
    });
  });
};


exports.get_stats = (req, res) => {
  StatsEntry.find()
  .select("requestType clientIP counter")
  .exec()
  .then(docs => {
    var totalRequests = 0;
    const stats = {stats: docs.map(doc => {
        totalRequests = totalRequests + doc.counter
        return {
          requestType: doc.requestType,
          clientIP: doc.clientIP,
          counter: doc.counter
        };
      })
    };
    updateStats('STATS',getIP(req).clientIp);
    res.status(200).json({ "Total requests": totalRequests, stats});
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
};


exports.get_prev_ip = (req, res) => {
  const ip =  getIP(req).clientIp;
   PrevIP.findOne().exec(function (err, prevIP){    
    if (err || prevIP == null){
      const prev = new PrevIP({
        clientIP: ip
      });
      prev.save();
      updateStats('PREV',ip);
      res.status(200).json("This is the first request! no previous IP.");
    } else{
      PrevIP.findOneAndUpdate({clientIP:ip});
      updateStats('PREV',ip);
      res.status(200).json("previous IP:" + prevIP.clientIP);
    }
  });
}


function updateStats(type,ip){

  StatsEntry.findOne({'requestType': type, 'clientIP': ip }, function (err, entry){
    if (err || entry == null){
      console.log("entry not found - creating new entry");
      const statsEntry = new StatsEntry({
        requestType:type,
        clientIP: ip,
        counter: 1
      });
      statsEntry.save().then(result => {
          console.log(result);
        })
    } else {
    var currentCounter = entry.counter;
    entry.counter = currentCounter + 1 ;
    entry.save();
    }
  });
}
