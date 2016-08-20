# ysfserver
七鱼数据服务代理平台

## 命令行启动
> ysfserver config.json

```javascript
  Usage:  ysfserver [options...]

  Options:
    -i,--init     初始化ysfserver目录
    -c,--config   配置文件
    -h,--help     help list
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
         "/" : "app"
       },
   	"port": 8001,
       "viewRoot"  : "./views",
   	"engine": "ejs"
   }
```
