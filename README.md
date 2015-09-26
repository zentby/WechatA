# WechatA

**Simple Assembla wrapper server for Wechat official account**

Help to get Assembla tickets, mentions, etc. through Wechat subscriptions.

### **Getting Started**
 Get code from https://github.com/zentby/WechatA

Fill in **config.js** for your own parameters:

    config.session
Session id for your own server

    config.assembla
Assemble API setting, set your own DEV id when IsX=true and production id when IsX=false

    config.wechat
Set your own wechat IDs accordingly.

You can also customize your wechat buttons in **api/node-wechat/ButtonSetting.json**

##  **TODOs**
* Unit Test
* Ticket(s) UI (Angular.JS)
* Notification server
* Bug Fixing
