//Node js server has the function to identify client but doesn't have the function to swap socket whenever a client sends msg to server!

//Function to broadcast to all online users. Use this in websocket 'close' to inform everyone who logged out!
function broadcastToAll(list_client,userLO){
  var JSONmsg
  var userLOmsg=["14","lalala","192.168.1.103","8080","192.168.1.104","EchoooooMan","EchoooooMan"]
  userLOmsg[1]=userLO;
  JSONmsg=JSON.stringify(userLOmsg);
  //console.log('JSON msg is '+JSONmsg)
  //console.log('Remaining user is '+list_client[0].getUserName())
  //list_client[0].getClientWS().send(JSONmsg)

  //Get list of online users
  for(i=0;i<list_client.length;i++){
    //Get their websockets
    //ws.send to all users
  list_client[i].getClientWS().send(JSONmsg)
  
  }
}
//Function to broadcast to all online users of who sign in!
function broadcastToAllSI(list_client,userSI){
  var JSONmsg
  var userSImsg=["15","lalala","192.168.1.103","8080","192.168.1.104","EchoooooMan","EchoooooMan"]
  userSImsg[1]=userSI;
  JSONmsg=JSON.stringify(userSImsg);

  for(i=0;i<list_client.length;i++){
    //Get their websockets
    //ws.send to all users
  list_client[i].getClientWS().send(JSONmsg)
  console.log(JSONmsg)
  
  }
}

//Function to write new user to text file
var fs = require('fs');
function writeUserToFile(listmsg){
  var jointUserList=[]
  jointUserList=fs.readFileSync("userinfo.txt",'utf8').split("\n")

  if(verifyNewUser(listmsg)==2){ //for new user
      jointUserList[jointUserList.length]=listmsg
      //console.log('jointUserlist is '+jointUserList)
      //Turn jointUserList array into one user per line format
      var userListPerLine=""
      for(i=0;i<jointUserList.length;i++){
        if(i<jointUserList.length-1){
          userListPerLine+=jointUserList[i]+'\n'
        }else
        if(i==jointUserList.length-1){
          userListPerLine+=jointUserList[i]
        }
      }
      
      fs.writeFileSync('userinfo.txt',userListPerLine,'utf8');
  }
}
//Function to verify login username and password
function verifyUserNamePass(listmsg){

  var jointUserList=[]
  jointUserList=fs.readFileSync("userinfo.txt",'utf8').split("\n")
  var userInfo=JSON.parse(listmsg) //Array of user info
  var username=userInfo[2]
  var password=userInfo[3]
  //console.log('username and password are '+username+'/n'+password)
  var returnCode=2 //1-match for username&password;2-match username but not for password;3-username no match
  for(i=0;i<jointUserList.length;i++){
    var userInfoP=JSON.parse(jointUserList[i])
  
    //console.log('userInfoP is '+userInfoP)
    if(userInfoP[2]==username&&userInfoP[3]==password){
        returnCode=1
        break;
    }else
    if(userInfoP[2]==username&&userInfoP[3]!=password){
      returnCode=2
      break;
    }else
    if(userInfoP[2]!=username){
      returnCode=3
      
    }

  }
  return returnCode;
}

//Function to verify if user signing up were new user or existing user
function verifyNewUser(listmsg){
  var jointUserList=[]
  jointUserList=fs.readFileSync("userinfo.txt",'utf8').split("\n")
  //console.log(jointUserList)
  var userInfo=JSON.parse(listmsg) //Array of user info
  //console.log('UserInfo is '+userInfo)
  var username=userInfo[2]
  //console.log('username is '+username)
  var returnCode=2 //1 for found user 2 for new user

  //console.log('jointUserList length is '+jointUserList.length)
  for(i=0;i<jointUserList.length;i++){
      var userInfoP=JSON.parse(jointUserList[i])
      if(userInfoP[2]==username){
          returnCode=1
      }
  }
  return returnCode
}

//Create a client class to store client username and client websocket
class Clients{
  constructor(username,clientWS){
    this.username=username
    this.clientWS=clientWS
  }
  getUserName(){return this.username}
  getClientWS(){return this.clientWS}
}
//Create a function to create list of  UserNames
function userNameList(list_client){
  var x;
  var list_userName=[]
  for(x=0;x<list_client.length;x++){
  list_userName[x]=list_client[x].getUserName()
  }
  return list_userName
}

//Create a function to add Clients object to list
function addClientToList(clients,list_client){
  list_client.push(clients)
  return list_client
}


//Identify non-duplicate username
function IdNonDuplicate(list_client,ws){
  for(x=0;x<list_client.length;x++){
    if(list_client[x].getClientWS()==ws){
      return list_client[x].getUserName()
    }
  }
}


//Create a function to search for Client ID
function searchClientID(list_client,listmsg,ws){
  //console.log('searchClient ID function is called')
  var x;
  for(x=0;x<list_client.length;x++){
    //console.log(`For loop count is ${x}`)
    if(list_client[x]!=undefined&&list_client[x].getUserName()==listmsg[6]&&list_client[x].getClientWS()==ws){
      //console.log(`If statement is called when for loop count is ${x}`)
      return list_client[x].getClientWS()
    }else
    if(list_client[x]!=undefined&&list_client[x].getUserName()==listmsg[6]){
      //Change username to some weird name for duplicate
      listmsg[6]="!@#$%It's duplicate!!!!@#$"
      return "It's defined!"
    }
  }
}
//Function to search recipient ID
function searchRecipientID(list_client,listmsg){
  var x;
  for(x=0;x<list_client.length;x++){
    //console.log(`For loop count is ${x}`)
    if(list_client[x]!=undefined&&list_client[x].getUserName()==listmsg[5]){
      //console.log(`If statement is called when for loop count is ${x}`)
      return list_client[x].getClientWS()
    }
  }
}


var list_client=[] //Need a list to store Clients object
const WebSocket = require('ws')
var clientID;
var list_userName


const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws)=>  { 
  

  ws.on('message', message => { 
    console.log(`Received message => ${message}`)
    var listmsg=JSON.parse(message);
    clientID=searchClientID(list_client,listmsg,ws)
  
    //Add logic to isolate repeated login.
    
    if(clientID!=undefined&&listmsg[0]==11){
      
      if(verifyUserNamePass(listmsg[1])==1){
      console.log('You already logged in!')
      var instructionMsg=listmsg
        instructionMsg[0]='11'
        instructionMsg[1]='You already logged in somewhere else!'
        ws.send(JSON.stringify(instructionMsg))
      }
    }

   
    if(clientID==undefined){ //Can't find ID so client is new
    //console.log('client is undefined');
    
    /**For PotatoChat v1.03 and below */
    if(listmsg[0]==1||listmsg[0]==2){
      //console.log('Type 1 or type 2 message is received!')
    var clients=new Clients(listmsg[6],ws) //checked
    //console.log(clients.getUserName())
    list_client=addClientToList(clients,list_client)//checked
    
    clientID=searchClientID(list_client,listmsg,ws) //Search again for client ID after ws added to list
    //console.log(clientID)
    clientID.send('["1","Welcome! This is echo Server speaking!","192.168.1.103","8080","192.168.1.104","8888","EchoooooMan"]');
    }
    /** */

    /**For PotatoChat v1.04 and above */
    if(listmsg[0]==11){
      var rm11=JSON.parse(listmsg[1])
      console.log('Type 11 msg received is: '+rm11)
      //console.log(verifyUserNamePass(listmsg[1]))
      //- Read userlist from permanent text file
      //- Compare login info with read userlist to  see if match is found.
      //- If match weren't found, send message ["11", "Username doesn't exist blablabla!"]
      //- If match were found, send message ["11", "Login is successful blablabla!"]
      //- When client receives "Login is successful" instruction, build userlist, start chat!
      if(verifyUserNamePass(listmsg[1])==1){ 
        console.log('verifyUsernamePass=1')
        var clients=new Clients(listmsg[6],ws)
        list_client=addClientToList(clients,list_client) //Client signed in!
        //TODO- Broadcast to all users who signed in!
        console.log(rm11[2])
        broadcastToAllSI(list_client,rm11[2])  
        for(i=0;i<list_client.length;i++){
        console.log('list_client is '+list_client[i].getUserName())
        }  
        clientID=searchClientID(list_client,listmsg,ws) //searchClientID is used for logged-in users
        var instructionMsg=listmsg
        instructionMsg[0]='11'
        instructionMsg[1]='You have signed in successful!'
        ws.send(JSON.stringify(instructionMsg))

        //Send list of usernames to client
        var userlistmsg=["9","lalala","192.168.1.103","8080","192.168.1.104","EchoooooMan",listmsg[6]]
        //Build a list of users' names for sending to client
        list_userName=userNameList(list_client)
        userlistmsg[1]=JSON.stringify(list_userName);
        var messageUserList=JSON.stringify(userlistmsg);
        console.log('messageUserList is '+messageUserList)
        clientID.send(messageUserList);
      }else
      if(verifyUserNamePass(listmsg[1])==2){
        var instructionMsg=listmsg
        instructionMsg[0]='11'
        instructionMsg[1]='Wrong username/password!Please try again!'
        ws.send(JSON.stringify(instructionMsg))
      }else
      if(verifyUserNamePass(listmsg[1])==3){
        var instructionMsg=listmsg
        instructionMsg[0]='11'
        instructionMsg[1]=`Username doens't exist!Please try again!`
        ws.send(JSON.stringify(instructionMsg))
      }
    }else
    if(listmsg[0]==12){
      console.log("Type 12 msg received is: "+listmsg[1])
      var rm12=JSON.parse(listmsg[1])
      //console.log("Type 12 msg received is: "+rm12)
      //- Need to read userlist from permanent text file  
      //- If new signup matches userlist, return "username already exists, please choose other username"
      //- If new signup's username is available, add new user to userlist and write to text file
      //- Upon successful registration, send instruction msg ["12","Congratulations! Your new member signup is successful!"]
      //- Once client receives this instruction, build userlist, start chat!
      
      
      var returnCode=verifyNewUser(listmsg[1])
      //console.log('Return code is '+returnCode)

      if(returnCode==2){ //new user
        writeUserToFile(listmsg[1])  
        if(verifyNewUser(listmsg[1])==1){ //Verify if new user has been added to text file
        //console.log("New user has been added to list!")
        //Send instruction back to client to start chat!
        var instructionMsg=listmsg
        instructionMsg[0]='12'
        instructionMsg[1]='Your new signup is successful!'
        ws.send(JSON.stringify(instructionMsg))

        /*
        //-Recycle Clients class to keep track of online users and their most updated WS
        var clients=new Clients(listmsg[6],ws) //Client side will have to put their username into msg at position no.6
        list_client=addClientToList(clients,list_client)   //list_client will hold all the online users' websockets, considered user signed in.
        clientID=searchClientID(list_client,listmsg,ws)
        //Send list of usernames to client
        var userlistmsg=["9","lalala","192.168.1.103","8080","192.168.1.104","EchoooooMan",listmsg[6]]
        //Build a list of users' names for sending to client
        list_userName=userNameList(list_client)
        userlistmsg[1]=JSON.stringify(list_userName);
        var messageUserList=JSON.stringify(userlistmsg);
        clientID.send(messageUserList);
        */
        }
      }else
      if(returnCode==1){ //existing user
        //console.log("User already exists!")
        //Send instruction back to client to notify client username already exists
        var instructionMsg=listmsg
        instructionMsg[0]='12'
        instructionMsg[1]='Username already exists!Please choose another name!'
        ws.send(JSON.stringify(instructionMsg))
      }
    }
    /** */

    }

    if(clientID!="It's defined!"){
    
    if(clientID!=undefined)  { 
    //Build a list of users' names for sending to client
    list_userName=userNameList(list_client)
    console.log(`username list: ${list_userName}`)
    
    //listmsg[6]='EchoooooMan';
    message=JSON.stringify(listmsg);
    //Search for recipient ID and send msg when recipient different from sender
    if(listmsg[5]!=listmsg[6]&&listmsg[0]==1){  
      if(listmsg[0]==1||listmsg[0]==2){//Only divert msg for type 1 or type 2 msg 
    var recipientID=searchRecipientID(list_client,listmsg);
    recipientID.send(message);
      }
    }
    //Send list of usernames to client
    var userlistmsg=["9","lalala","192.168.1.103","8080","192.168.1.104","EchoooooMan",listmsg[6]]
    userlistmsg[1]=JSON.stringify(list_userName);
    var messageUserList=JSON.stringify(userlistmsg);
    clientID.send(messageUserList);

  }
  }
  
  })
  

  ws.on('close',()=>{
    var userLG=IdNonDuplicate(list_client,ws)
    console.log('userLG is '+userLG)
    /**PotatoChat v1.04 */
    for(i=0;i<list_client.length;i++){
      if(list_client[i].getUserName()==userLG){
        list_client.splice(i,1)
        console.log(`${userLG} logged out!`)
      }
    }
    broadcastToAll(list_client,userLG)
    /** */

/**PotatoChat v1.03 */
/*
    if(userLG!=undefined){
    for(var i=0;i<list_client.length;i++){
    if (list_client[i].getClientWS.readyState === list_client[i].getClientWS.CLOSED) {
      // WS is closed.
      console.log(`${list_client[i].getUserName()} logged out!`)
      //Remove client from list_client
      //-Got to prevent splicing away legit username when duplicate logs out!
      list_client.splice(i,1)
   }
  }
    
    wsCounter=0 //Counter will reset to zero if connection is closed.
  }
/** */


  })
  


})



