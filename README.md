Game Zhajinhua API
===
---
      _____   _            __   _         _                      
     |  ___| | |  _   _   / _| (_)  ___  | |__                   
     | |_    | | | | | | | |_  | | / __| | '_ \                  
     |  _|   | | | |_| | |  _| | | \__ \ | | | |                 
     | |     |_|  \__, | |_|   |_| |___/ |_| |_|                 
     |_|          |___/                                          
                                                                 


---
###gate 服务器地址： 192.168.1.86:4015
---
####客户端请求超时的情况下 服务器返回信息格式为：
```
{
    code: 401,
    data: {
        msg: ''
    }
}
```
---

###1. gate 入口查询服务器  [stable]

####*gate.gateHandler.queryEntry*

连接服务器入口查询函数[返回一个可用的connector服务器host和port]
``` 
@param msg = {
	cid : ''  // @type string client id
}
@return
{
    code: '',            //状态码
    data: {
        host: '',        //连接服务器地址
        port: ''         //连接服务器端口
    }
}
```
---
### 2. connector 连接服务器  [stable]

####*connector.authHandler.login*
用户登陆 
```
@param msg
          {username: '', password: '', reconnect:''}
@param session
@param next
@param reconnect 表示是否重连， reconnect == 1则会清除已有状态
@return 登陆成功时返回用户的基本信息
{
    code: 3000,
    data : {
        info: {
            money,              //金钱
            email,              //邮箱
            userid,             //用户id
            username,           //用户名
            avatar              //头像 [default-x : 程序内置 ; http://xxx url自定义]
        },
        msg : ''  //失败时返回描述信息
    }

}
```
####*connector.authHandler.logout*

用户注销
```
    @return {
	    code: '',
	    data: {
            msg: ''
	    }
	}
```
####*connector.authHandler.register*
用户注册
```
	@param msg
	  { 
	       username : '', 
	       nickname : '', 
	       password: '', 
	       email: '', 
	       gender: ''
	   }
```
####*connector.authHandler.reconnect*
客户端掉线之后重连。客户端掉线之后，服务器端会保存玩家的信息在内存中，由zhajinhua全局服务器负责。
```
    @param msg
            { username: ''}

    @return { 
        code: '', 
        data : { 
            info: '', 
            areaID: '', 
            deskID: '' } 
        }
    //如果重连成功那么data中将会包括玩家所在的areaID和deskID， 可依此发送同步信息的请求
```
---
###3. zhajinhua 全局数据服务器  [stable]
####*zhajinhua.zhajinhuaHandler.queryCasinoInfo*
查询所有场的信息
```
   @return  {
        code:'',
        data: {
            info: {
                  basicMoney,             //底注
                  maxMoney,               //最高注
                  playerCountLimit        //加入的玩家数目限制
                  name,                   //场的名字
                  id,
                  currentPlayerCount      //当前玩家数目
            }
        }
   }
```
####*zhajinhua.zhajinhuaHandler.queryPlayerBasicInfo*
查询用户的信息 
```
   @param msg
        { uid: ''} //要查询的用户id

   @return
        {
            code: '',
            data: {
                info : {}             //用户基本信息
            }
        }
```

####*zhajinhua.zhajinhuaHandler.updatePlayerInfo*
   修改玩家信息的接口,更新的字段可以是：
*   [基础信息] email, money, avatar, gender, nickname
*   [zhajinhua游戏] gameMoney
```
   @param msg
   {
        username: '',
             updateParam: {
                  gender: ''          //需要修改什么属性，就加在updateParam里面
             }
         }
   }
```

####*zhajinhua.zhajinhuaHandler.exchangeMoneyToZhajinhua*
玩家兑换钱币接口 
```
   @param msg {
             money: ''           //兑换的钱数（将money数量的钱兑换成zhajinhua中的钱）
        }

   @return {
             code: '',          //OK, FAIL
             data: {
                        money,
                        zhajinhua_money,
                        changeMoney,
                        rate
                   }
        }
```
---
## 4. area 场景服务器

####*area.areaHandler.enterArea*
* 进入一个场
```
@param msg
	{ areaID: '' }
@return {
    code: '',
    data: {
        msg: ''
    }
}
```
* 产生广播信息： ```"zhajinhua.user.area.join"```  [广播范围：该游戏场内]

```
广播数据格式： 
{
    data : {
        info: {},  //玩家信息
        msg : ''
    }
}
```
	
###*area.areaHandler.leaveArea*
* 离开一个场   
```
	@param msg
		{ areaID: ''}
    @return {
        code : '',
        data : {
            msg: ''
        }
    }
```
* 产生广播信息: ``` "zhajinhua.user.area.leave" ``` [广播范围：该游戏场内]
	广播数据格式： 
    {
        data : {
            info: {},  //玩家信息
            msg : ''
        }
    }


####*area.areaHandler.queryAreaInfo*
* 查询场的信息,返回一个场内所有游戏桌的最新信息，每张桌子的信息包括游戏状态和游戏玩家基本信息
```
@return {
    code : '',
    data : {
        info: {}
    }
}
```

* area游戏场内游戏桌信息的更新广播： ```"zhajinhua.area.update"```
	广播数据格式： 
```
    {
        data: {
            info: {}             // 例如： { 'desk1': {}, 'desk2': {} }
        }
	}
```
####*area.deskHandler.queryDeskInfo*
	查询桌的信息 
```
	@param msg
		{ areaID: '', deskID: ''}
    @return {
        code : '',
        data : {
            info: {
                playerList: [
                    {
                        seatNumber: '',           //座位号
                        username: '',             //用户名
                        email : '',               //邮箱
                        money: '',                //钱
                        avatar: ''                //头像
                    }
                ],
                deskID:'',
                gameStatus: '',
                playerNumber: ''
            }
        }
    }
```
####*area.deskHandler.queryDeskGameInfo*
查询游戏桌当前的游戏信息（玩家列表，观战者列表等）
```
    @param msg
        { areaID: '', deskID:'' }
    @return {
        code : ''
        data: {
            gameInfo: {
                playerList: [
                    {
                        userid     : '',
                        username   : '',
                        avatar     : '',
                        gameMoney  : '',
                        type       : '',
                        isReady    : '',
                        seatNumber : '',
                        hasToken   : '',
                        isActive   : '',
                        isLook     : ''
                    }
                ],
                basicMoney:'', //底注
                currentBasicMoney:'',  //当前底注
                totalMoney: ''         //当前的赌桌金额
            },
            deskInfo: {
                 playerList: [
                                    {
                                        seatNumber: '',           //座位号
                                        username: '',             //用户名
                                        email : '',               //邮箱
                                        money: '',                //钱
                                        avatar: ''                //头像
                                    }
                                ],
                                deskID:'',
                                gameStatus: '',
                                playerNumber: ''
            }
        }
    }
```

####*area.deskHandler.enterDesk*
* 进入一个游戏桌   
```
	@param msg
		{ areaID: '', deskID: '', type:''}
        @type 表示游戏玩家参与的角色：是玩家[1]还是观战者[2]
    @return {
        code :'',
        data : {
            msg: '',
            type: ''               //进入游戏桌之后的type
        }
    }
```

* 产生广播信息： ```"zhajinhua.user.desk.join"```  [广播范围：该游戏桌内]
广播数据格式： 
```
{
    data : {
        info: {},  //玩家信息
        msg : ''
    }
}
```

####*area.deskHandler.leaveDesk*
* 离开一个游戏桌   
```
	@param msg
		{ areaID: '', deskID: ''}
    @return {
        code : '',
        data : {
            msg : ''
        }
    }
```
* 产生广播信息:  ```"zhajinhua.user.desk.leave"```  [广播范围：该游戏桌内]
	广播数据格式： 
```    
@broadcast {
    data : {
        info: {},  //玩家信息
        msg : ''
    }
}
```

####*area.deskHandler.changePlayerType*
* 切换玩家的类型
```
	@param msg
	    {areaID:'', deskID: '', type: ''}
	@return {
        code : '',
        data : {
             msg : ''
        }
	}
```
* 产生广播信息： ```" zhajinhua.user.desk.logic"```  [广播范围：该游戏桌内]
	广播数据格式：
```
@msg {
    action:'',
    data: {
        info: {},             //玩家信息
        isReady:''
    }
}
```
```msg.action : onPlayerTypeChange``` 游戏玩家类型变化

####*area.deskHandler.ready*
* 切换玩家游戏准备状态
```
    @param msg
        {
            areaID:'', 
            deskID:'', 
            //1表示准备， 0取消准备
            isReady:''              
        }
    @return {
        code : '',
        data : {
            msg: '',
            ready: ''
        }
    }
```
* 产生广播信息： ```" zhajinhua.user.desk.logic"```
    广播数据格式：
```
@broadcast {
    action:'',
    data: {
        info: {},             //玩家信息
        isReady:''
    }
}
```
``` msg.action : onReadyStateChange``` 游戏玩家类型变化

---
 ###炸金花游戏过程中的处理 *area.gameHandler.play*
 ```
    @param msg {uid, action, param}
```
msg.action说明:

*   follow 跟牌
*   look   看牌
*   append 加注 param = {appendMoney:''}
*   compare 比牌  param = {tid(被比牌玩家的username)}
*   drop   弃牌
*   compareAll 所有剩余玩家比牌

```
@return {
       code : '',
       data : {
            msg:''
       }
}
```
---
###游戏过程中，推送给客户端的游戏信息
* 游戏逻辑相关信息```"route: zhajinhua.game"```
```
    @msg {
      action:'',
      data:{}
    }
```

    * 1.action:  onToken 某个用户获得了Token
    ```
   data  : {
        id: userid
    }
    ```
    * 2.action:  onFollow 某个用户跟牌
    ```
   data  : {
        id: userid,
        followMoney: money, //玩家跟了多少钱
        money: ''           //玩家还剩多少钱
   }
    ```
    * 3.action: onLook    用户看牌
    ```
        data  : {id: userid}
    ```
    * 4.action: onAppend   用户加注
    ```
   data  : {
        id: userid,
        appendMoney: money, //玩家加注跟了多少钱
        money: ''           //玩家还剩多少钱
        basicMoney: ''      //加注之后的底注
   }
   ```

    * 5.action: onCompare   用户比牌
    ```
   data  : {
        sid: userid (requester),   //比牌的发起者
        tid: userid,               //比牌的对象
        result:{
            winnerId: '',           //赢的玩家id
            loserId : '',           //输的玩家id
            costMoney: '',          //比牌发起者付出的钱
            leftMoney: '',          //比牌发起者剩余的钱
            winnerHand: '',        //赢家的手牌
            loserHand: '',          //输家的手牌
        }
   }
   ```
    * 6.action: onDrop    用户弃牌
    ```
    data  : {id: userid}
    
    ```
    * 7.action: onStart   游戏开始
    * 8.action: onEnd     游戏结束
    * 9.action: onCompareAll 所有剩余用户进行比牌
    ```
    data:{
        sid: userid (requester)
        result: {
            winnerId: ''
            winnerHand: '',
            loserHands: ['', '']    //输家的手牌（数组）
        }
    }
    ```
    * 10.action : onSyncInfo 同步场内游戏信息
    ```
    data : {
        playerList: [
            {
                username:'',
                tmpGameMoney:'',   //游戏过程中的动态金钱
                hasToken:'',
                isActive:'',
                isLook:''
            }
        ],
        basicMoney: "",
        currentBasicMoney: "",  //当前的底注
        totalMoney: ""          //当前总共的注额
    }
   ```
