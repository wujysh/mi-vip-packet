var request = require('request').defaults({jar: true});
var iconv  = require('iconv-lite');
const querystring = require('querystring');

var packetStatus = [];
interval = 10000;
headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; U; Android 6.0.1; zh-cn; Mi Note 2 Build/MXB48T) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.146 Mobile Safari/537.36 XiaoMi/MiuiBrowser/8.4.6',
    'Cookie': 'Hm_lvt_3c5ef0d4b3098aba138e8ff4e86f1329=1453799023; __utma=230417408.82463735.1450956446.1454317509.1454321350.9; serviceToken=kWQVDa4937WR471G/2ks9RLiIMBhpybwTSv2rZdk92FLUrCGJmFiEdpjaPsZ1wkay5nD+A1AXGv0dzlBLT2UVcQvCojyedWNqopv+tC7fJo08Yycq59cBsk6UUL/GiWejkKblZm/C8gWx0BDvXja4OMeamzvyzzetm5V+aWRVGMfMLjQfqWNrT3eqtCz1v1zjsgLIf3hduxL9zJixRsjiI/dUWCTNNxpmUAQXOyWBVY=; browseract_slh=IYgcPg3raCuqhB/2V5NwseHaqIg=; browseract_ph=hvCYq2ickOwfZXPE4ii1CQ==; userId=8790860',
    'Referer': 'https://act.browser.miui.com/hd20170126/',
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, sdch, br',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,en-US;q=0.4',
    'Connection': 'keep-alive',
    'X-Requested-With': 'XMLHttpRequest'
};

function grabLottery() {
    request(
        { encoding: null, url: 'https://act.browser.miui.com/api/springfestival/lottery/interactive', headers: headers, gzip:true },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var utf8String = iconv.decode(body, "gb2312");
                //var info = JSON.parse(utf8String);
                console.log(utf8String);
            }
        }
    );
}

grabLottery();
setInterval(grabLottery, interval);


