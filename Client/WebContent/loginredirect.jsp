<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="ISO-8859-1"%>
<%@ page import="javax.xml.namespace.QName" %>
<%@ page import="javax.xml.ws.Service" %>
<%@ page import="java.net.URL" %>
<%@ page import = "java.io.*,java.util.*,java.sql.*"%>
<%@ page import="org.java.ojekonline.webservice.OjekData" %>
<%@ page import="org.java.ojekonline.webservice.OjekDataImplService" %>
<%@ page import="org.java.ojekonline.webservice.Profile" %>
<%@ page import="org.java.ojekonline.webservice.Babi" %>
<%@ page import="org.java.ojekonline.webservice.MapElementsArray" %>
<%@ page import="org.java.ojekonline.webservice.MapElements" %>
<%@ page import = "java.util.ArrayList"%>
<%@ taglib uri = "http://java.sun.com/jsp/jstl/core" prefix = "c" %>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Ngo-Jek - Ojek Online Clone Website">
    <meta name="author" content="Taufan Mahaputra, Erfandi Suryo Putro, Gianfranco F.H">

    <!-- Properties Title -->
    <link rel="shortcut icon" href="" />
    <title>Ngo-Jek</title>

   
    <!-- Custom CSS -->
    <link href="style/main.css" rel="stylesheet" type='text/css'/>
    <link href="style/profile.css" rel="stylesheet" type='text/css'/>
    <!-- Custom Fonts -->
    <link href="style/font-awesome.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Patua+One" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Oswald:400,500,600" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet">
    <!-- Script -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    
</head>
<body>
	<%
		int id_user = 1;
		String token = (String) session.getAttribute("token"),
				expiry_time = (String) session.getAttribute("expiry_time");
	
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
			id_user = result;
		}
		Profile profile = new Profile();
		profile = ps.getProfileInfo(id_user);

        
		String tokenFCM = (String) session.getAttribute("tokenFCM");
	%>
    <script> 
    console.log("TEST");
    function submitNewLogin(currentUsername, currentToken) {
   	 // Send token to REST Service
   	$.ajax({
   		type: "POST",
   		url: "http://localhost:3000/online",
   		data: {
   			username: currentUsername,
   			tokenFCM: currentToken
   			},
   		datatype: "json",
   		success : function(data, status){
   			    console.log("Akhirnya masuk");
   		},
   		error: function(err) {
   			console.log(err);
   		}
   	});
   }
    submitNewLogin("<%= profile.getUsername() %>","<%= tokenFCM %>");
    window.location = "http://localhost:8080/selectdestination.jsp";
    </script>
</body>
</html>
