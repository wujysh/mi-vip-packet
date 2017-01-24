var request = require('request').defaults({jar: true});
const querystring = require('querystring');

var packetStatus = [];
interval = 10000;
headers = {
    'User-Agent': 'Mozilla/5.0 (Linux; U; Android 6.0.1; zh-cn; Mi Note 2 Build/MXB48T) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.146 Mobile Safari/537.36 XiaoMi/MiuiBrowser/8.4.6',
    'Cookie': 'Hm_lvt_3c5ef0d4b3098aba138e8ff4e86f1329=1453799023; __utma=230417408.82463735.1450956446.1454317509.1454321350.9; serviceToken=gVvk3FEZ8N5JqrHMJFGfWuw58SSZ0+wDLM+tUS+T8qhTdLlvywtkjeWpeIFAr79CmxH7tDP9Jzz870bW8UFE7Ku2+9PW/XDF1Z8lW3im4RLyT4Da+XViKabGHjVdSjwbAluG2eur7CThg+GGzcaOCx/4LDQzQBTqeY79XiCw01zQ5wMCsxYKyPMHcvZV83p9lmqQrgLvzIVFX6vbc5vagsNMP8+dMWbhvqp5Zglvqa4=; userId=8790860; miui_vip_w_slh=9lt6vjTNi/fnZO0jK1+T5BzdWL8=; miui_vip_w_ph=rP6nyQBPwLhxt7zgjG9Amw==; hongbao_record={%228790860%22:{%22182%22:1322279%2C%22186%22:1322276%2C%22date%22:1485228604698}%2C%22795745772%22:{}}; hongbao_status=true',
    'Referer': 'https://web.vip.miui.com/page/packet2017?' + querystring.stringify({ showLatest: 'true', userId: '8790860' }),
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Encoding': 'gzip, deflate, sdch, br',
    'Accept-Language': 'zh-CN,zh;q=0.8,en;q=0.6,en-US;q=0.4',
    'Connection': 'keep-alive',
    'X-Requested-With': 'XMLHttpRequest'
};

function grabPacket(pid, sid) {
    console.log("[ Grab ] PID: " + pid + " - SID: " + sid + " - Time: " + new Date(Date.now()));
    request(
        { url: 'https://web.vip.miui.com/api/packet/grab?' + querystring.stringify({ pid: pid, sid: sid }), headers: headers },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                packetStatus[pid] = info.status;
                console.log("[Result] PID: " + pid + " - SID: " + sid + " - Status: " + info.status + " - Message: " + info.errMsg + (info.status == 8 ? " [Retry]" : ""));
                if (info.status == 8) {  // SERVER_BUSY
                    grabPacket(pid, sid);
                }
            }
        }
    );
}

function grabPacketDelay(pid, sid, time) {
    setTimeout(function () {
        grabPacket(pid, sid);
    }, time);
}

function getPacketList() {
    request(
        { url: 'https://web.vip.miui.com/api/packet/list', headers: headers },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log("[ Time ] " + new Date(Date.now()));
                console.log("[ User ] ID: " + info.id + " - Level: " + info.userLevel);
                for (var i = 0; i < info.packets.length; i++) {
                    if (info.userLevel < info.packets[i].level) continue;
                    if (packetStatus[info.packets[i].packetId] == 6 || packetStatus[info.packets[i].packetId] == 0) continue;  // OVER_DAILY_LIMIT or OK

                    var remainTime = info.packets[i].startTime - Date.now();
                    console.log("[Packet] PID: " + info.packets[i].packetId + " - SID: " + info.packets[i].id + ' - Level: ' + info.packets[i].level + ' - Remain: ' + remainTime + " ms" + ((remainTime <= interval && remainTime >= 0) ? " [ Grab ]" : ""));
                    if (remainTime <= interval && remainTime >= 0) {
                        grabPacketDelay(info.packets[i].packetId, info.packets[i].id, remainTime);
                    }
                }
            }
        }
    );
}

getPacketList();
setInterval(getPacketList, interval);


