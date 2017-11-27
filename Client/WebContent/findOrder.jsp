<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import = "java.io.*,java.util.*,java.sql.*"%>
<%@ page import = "javax.servlet.http.*,javax.servlet.*" %>
<%@ page import="org.java.ojekonline.webservice.OjekData" %>
<%@ page import="org.java.ojekonline.webservice.OjekDataImplService" %>
<%@ page import="org.java.ojekonline.webservice.Babi" %>
<%@ page import="org.java.ojekonline.webservice.Profile" %>
<%@ page import="org.java.ojekonline.webservice.MapElementsArray" %>
<%@ page import="org.java.ojekonline.webservice.MapElements" %>
<%@ page import = "java.util.ArrayList"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<link rel="stylesheet" type="text/css" href="style/kepala.css">
<link rel="stylesheet" type="text/css" href="style/chat.css">
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.1/angular.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Order</title>
<script src="js/validateform.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.6.2/firebase.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js"></script>
<script src="https://cdn.rawgit.com/Luegg/angularjs-scroll-glue/master/src/scrollglue.js"></script>
<script src="javascript/chatController.js"></script>
<script src="node_modules/angularjs-scroll-glue/src/scrollglue.js"></script>
</head>
<%  
		int userid = 1;
		String 	token = (String) session.getAttribute("token"),
				expiry_time = (String) session.getAttribute("expiry_time");
		
		//create service object
		OjekDataImplService service = new OjekDataImplService();
		OjekData ps = service.getOjekDataImplPort();
		
		//validating token
		int result = ps.validateToken(token, expiry_time);
		if ((result == -2) || (result == -1)) {//token invalid
			response.setStatus(response.SC_MOVED_TEMPORARILY);
		    response.setHeader("Location", "http://localhost:8080/Client/login.jsp");
		    return;
		}
		else { //token valid, get user id
			userid = result;
		}
		
		String nameuser = ps.getNameUser(userid);
		// get profile info
		Profile profile = new Profile();
		profile = ps.getProfileInfo(userid);
	%>	
<body ng-app="chatApp" ng-controller="chatController" data-ng-init="user_sender='<%=profile.getUsername()%>';user_receiver='';init();">
	<div>
		<p id="hi_username">Hi, <b><%=profile.getUsername() %></b> !</p>
		<h1 id="logo">
			<span id="labelgreen">PR</span>-<span id="labelred">OJEK</span>
		</h1>
		<a id="logout" href="logout.jsp">Logout</a>
		<p id="extralogo">wush... wush... ngeeeeenggg...</p>
	</div>
		<table id="tableactivity">
			<tr>
				<td id="current_activity"><a href="selectdestination.jsp">ORDER</a></td>
				<td class="rest_activity"><a href="history-penumpang.jsp">HISTORY</a></td>
				<td class="rest_activity"><a href="profile.jsp">MY PROFILE</a></td>
			</tr>
		</table>
	<div id="orderforDriver" style="text-align:center;">
		<p id="lookingfororder" style="text-align:left">LOOKING FOR AN ORDER</p>
		<button id="findorder" ng-click="findOrder()" type="submit"><div class="buttontext">FIND ORDER</div></button>
		<div id="findingordertext" style="display:none;">Finding Order....</div>
		<div id="loader" style="display:none;"></div>
		<button id="cancelfinding" ng-click="cancelFinding()" style="display:none;"><div class="buttontext">CANCEL</div></button>
		<input type="hidden" id="username" value="<%= profile.getUsername()%>">
		<div id="gotanorder" class="gotanorder" style="display:none;">Got an Order!</div>
		<div id="customer" class="customer" style="display:none;">{{users.receiver}}</div>
	</div>
	<div id="chatarea" ng-model="chatarea" style="display:none;">
		<div id="chatcontainer" class="chatcontainer" scroll-glue>
			<div ng-repeat="message in messages track by $index">
				<div ng-if="((message.user_sender == '<%=profile.getUsername()%>')&&(message.user_receiver == users.receiver))">
					<div class="namesender"><%out.print(profile.getUsername()); %></div>
					<div class="chatbox sentbox">{{message.message}}</div>
				</div>
				<div ng-if="((message.user_sender == users.receiver)&&(message.user_receiver == '<%=profile.getUsername()%>'))">
					<div class="namedriver">{{users.receiver}}</div>
					<div class="chatbox recievedbox">{{message.message}}</div>
				</div>
			</div>
<!-- 			<div class="chatbox sentbox">Hallo disana apakash kalian baik-baik saja, saya sendirian disini</div> -->
<!-- 		    <div class="chatbox recievedbox">Hallo </div> -->
		</div>
		<form class="inputcontainer" ng-submit="send()">
			<input class="inputbox" ng-model="textbox" type="text"></input>
			<button class="kirimbutton" type="submit">Kirim</button>
		</form>
	</div>
</body>
</html>