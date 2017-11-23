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
<script src="javascript/chatController.js"></script>
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
<body ng-app="chatApp" ng-controller="chatController">
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
	
	<div id="orderforDriver" style="text-align:center;">
		<p id="lookingfororder">LOOKING FOR AN ORDER</p>
		<button id="findorder" onclick="findOrder()"><div class="buttontext">FIND ORDER</div></button>
		<div id="findingordertext" style="display:none;">Finding Order....</div>
		<div id="loader" style="display:none;"></div>
		<button id="cancelfinding" style="display:none;"onclick="cancelFinding()"><div class="buttontext">CANCEL</div></button>
	</div>
	<div id="chatarea" ng-model="chatarea" style="display:none;">
		<div class="chatcontainer">
			<div ng-repeat="message in messages track by $index">
				<div ng-if="message.sender == '<%=profile.getUsername()%>'">
					<div class="namesender"><%out.print(profile.getUsername()); %></div>
					<div class="chatbox sentbox">{{message.body}}</div>
				</div>
				<div ng-if="message.sender != '<%=profile.getUsername()%>'">
					<div class="namedriver"><%out.print("cuks"); %></div>
					<div class="chatbox recievedbox">{{message.body}}</div>
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