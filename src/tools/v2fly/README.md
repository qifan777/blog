# V2fly内网穿透

```shell
docker run -d --name v2ray -v /home/v2ray/config.json:/etc/v2ray/config.json -p 9990:9990 -p 80:80 v2fly/v2fly-core run -c /etc/v2ray/config.json 
```
