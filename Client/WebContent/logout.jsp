<%@ page import = "java.net.*, java.io.*, org.json.JSONObject" %>
<%@ page import="org.java.ojekonline.webservice.OjekData" %>
<%@ page import="org.java.ojekonline.webservice.OjekDataImplService" %>
<%@ page import="org.java.ojekonline.webservice.Profile" %>
<html>
<head>
<!-- Script -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
</head>
<%
		String token = (String) session.getAttribute("token"),
				 expiry_time = (String) session.getAttribute("expiry_time");

		//create service object
		OjekDataImplService service = new OjekDataImplService();
		OjekData ps = service.getOjekDataImplPort();
		//validating token
		int result = ps.validateToken(token, expiry_time);
		
		 Profile profile = new Profile();
		 profile = ps.getProfileInfo(result);
		
		//make json object
		JSONObject account = new JSONObject();
		account.put("token", token);
		String sendme = account.toString();
		
		//send post request
		String query = "http://localhost:8081/IdentityService/logout";
		URL url = new URL(query);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
		conn.setDoOutput(true);
		conn.setDoInput(true);
		conn.setRequestMethod("POST");
		OutputStream os = conn.getOutputStream();
		os.write(sendme.getBytes("UTF-8"));
		os.close();
		
		int HttpResult = conn.getResponseCode(); 
		if (HttpResult == HttpURLConnection.HTTP_OK) {
			//redirect
	        response.setStatus(response.SC_MOVED_TEMPORARILY);
			%>
			<script> 
			console.log("Removing login document");
			function removeLogin(currentUsername, currentToken) {
			    // Send token to REST Service
			   $.ajax({
			       type: "POST",
			       url: "http://localhost:3000/logout",
			       data: {
			           username: currentUsername
			           },
			       datatype: "json",
			       success : function(data, status){
			               console.log("Logging out");
			       },
			       error: function(err) {
			           console.log(err);
			       }
			   });
			}
			removeLogin("<%= profile.getUsername() %>");
		    window.location = "http://localhost:8080/login.jsp";
			</script> 
			<% 
		} else {
		    %> <script> alert("Logout failed, try again") </script> <%
		}  
		conn.disconnect();

%>
</html>