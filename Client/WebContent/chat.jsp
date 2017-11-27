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
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Order</title>
<script src="js/validateform.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.6.2/firebase.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js"></script>
<script src="https://cdn.rawgit.com/Luegg/angularjs-scroll-glue/master/src/scrollglue.js"></script>
<script src="node_modules/angularjs-scroll-glue/src/scrollglue.js"></script>
</head>
<%  
		int userid = 1;
		String pick = request.getParameter("pick"), 
				dest = request.getParameter("dest"),
				token = (String) session.getAttribute("token"),
				expiry_time = (String) session.getAttribute("expiry_time");
		
		int driverid =  Integer.parseInt(request.getParameter("driverid"));
		
		//create service object
		OjekDataImplService service = new OjekDataImplService();
		OjekData ps = service.getOjekDataImplPort();
		
		//validating token
		int result = ps.validateToken(token, expiry_time);
		if ((result == -2) || (result == -1)) {//token invalid
			response.setStatus(response.SC_MOVED_TEMPORARILY);
		    response.setHeader("Location", "http://localhost:8080/login.jsp");
		    return;
		}
		else { //token valid, get user id
			userid = result;
		}
		
		String nameuser = ps.getNameUser(userid);
		// get profile info
		Profile profile = new Profile();
		profile = ps.getProfileInfo(userid);
		Profile driver = new Profile();
		driver = ps.getProfileInfo(driverid);
	%>	
<body ng-app="chatApp" ng-controller="chatController" data-ng-init="user_sender='<%=profile.getUsername()%>';user_receiver='<%=driver.getUsername()%>';init();">
	<div>
		<p id="hi_username">Hi, <b></b> !</p>
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
	
	<div id="activity">
		<p id="makeanorder">MAKE AN ORDER</p>
			
		<table class="tableorder">
			<tr>
				<td><div class="circle">1</div></td>
				<td class="titleorder">Select<br>Destination</td>
			</tr>
		</table>
	
		<table class="tableorder">
			<tr>
				<td><div class="circle">2</div></td>
				<td class="titleorder">Select a<br>Driver</td>
			</tr>
		</table>
		<table class="tableorder">
			<tr id="current_order">
				<td><div class="circle">3</div></td>
				<td class="titleorder">Chat<br>Driver</td>
			</tr>
		</table>
		<table class="tableorder">
			<tr>
				<td><div class="circle">4</div></td>
				<td class="titleorder">Complete<br>your Order</td>
			</tr>
		</table>
		<p id="makeanorder" >MAKE AN ORDER</p>
	</div>
	<input type="hidden" id="username" value="<%= profile.getUsername()%>">
	<div id="chatarea" ng-model="chatarea">
		<div id="chatcontainer" class="chatcontainer" scroll-glue>
			<div ng-repeat="message in messages track by $index">
				<div ng-if="((message.user_sender == '<%=profile.getUsername()%>')&&(message.user_receiver == '<%=driver.getUsername()%>'))">
					<div class="namesender"><%out.print(profile.getUsername()); %></div>
					<div class="chatbox sentbox">{{message.message}}</div>
				</div>
				<div ng-if="((message.user_sender == '<%=driver.getUsername()%>')&&(message.user_receiver == '<%=profile.getUsername()%>'))">
					<div class="namedriver"><%=(driver.getUsername()) %></div>
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
	<form action='completeorder.jsp' method='POST' style="text-align:center;">
			<button name='driverid' value="<%=driverid%>" id="closebutton" ng-click="closechat()"> <div class="buttontext">CLOSE</div></button>
	</form>
	<script src="javascript/chatController.js"></script>
</body>
</html>