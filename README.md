# ysfserver
七鱼数据服务代理平台

## 命令行启动
> ysfserver config.json

```javascript
  ysfserver -h
```

## config.json文件

```json
    {
    	"apiRoute": {
    		"get" : [
              "api/list"
            ],
            "post" : [
              "api/form"
            ]
    	},
        "viewRoute" : {
          "/" : "index.ejs"
        },
    	"port": 8001,
        "viewRoot"  : "./views",
    	"engine": "ejs"
    }
```
