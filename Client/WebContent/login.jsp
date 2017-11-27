<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import = "java.net.*, java.io.*, org.json.JSONObject" %>

<%@ page import = "java.sql.* , com.mysql.jdbc.Statement" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Ngo-Jek - Ojek Online Clone Website">
    <meta name="author" content="Taufan Mahaputra, Erfandi Suryo Putra, Gianfranco F.H">
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	
	 <!-- Properties Title -->
    <link rel="shortcut icon" href="" />
    <title>Ngo-Jek</title>
    
    <!-- Custom CSS -->
    <link href="style/main.css" rel="stylesheet" type='text/css'/>
    <!-- Custom Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Oswald:400,500,600" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet">
    <!-- Script -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script src="javascript/login.js"></script>
    
  <link rel="manifest" href="javascript/manifest.json">
</head>
<body>
	<%
	String token = null;
	final long serialVersionUID = 1L;
	// JDBC driver name and database URL
	final String JDBC_DRIVER = "com.mysql.jdbc.Driver";  
	final String DB_URL = "jdbc:mysql://localhost:3306/ojekaccount";

	//  Database credentials
	final String USER = "root";
	final String PASS = "";
	
	if (request.getHeader("Error") != null) {
		out.println("errorWTFFFFFFFFFFFFFFFFFFFF");
	}
	
	if (request.getParameter("username") != null) {
		

	        
		//retrieve data
		//get ip address 
		InetAddress addr = InetAddress.getLocalHost();
		String ipAddress = addr.getHostAddress();
		
		//get browser
		String browser = request.getHeader("User-Agent");
		
		//get username, password, tokenFCM
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		String tokenFCM = request.getParameter("tokenFCM");
		
		Statement stmt = null;
		Connection conn = null;
		try {
	    	// Register JDBC driver
	        Class.forName("com.mysql.jdbc.Driver");
	          
	      	// Open a connection
	        System.out.println("trying to connect");
	        conn = DriverManager.getConnection(DB_URL, USER, PASS);
	        System.out.println("successul connected to database");
	          
	        stmt = (Statement) conn.createStatement();
	        String sql;
	        
	        //GET ID User
	        sql = "SELECT id_user FROM userdata WHERE username = '" + username + "' and password = '" + password + "'";
	        ResultSet rs =stmt.executeQuery(sql);
	        if (!rs.next()) { //No 
	        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	        	response.addHeader("message", "not found");
	        	return;
	        }
	        
	        System.out.println("validate browser");
	        String id = rs.getString("id_user");
	        System.out.println(id);
	        sql = "SELECT token FROM accesstoken WHERE id_user = " + id + "";
	        rs = stmt.executeQuery(sql);
	        if (rs.next()) { //token exist 
	        	response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
	        	response.addHeader("Error", "Duplicate Token");
	        	response.setContentType("text/html");  
	        	out.println("<script type=\"text/javascript\">");  
	        	out.println("alert('Please log out first on another browser/network!');");
	        	out.println("window.location = \"http://localhost:8080/login.jsp\";");
	        	out.println("</script>");
	        	return;
	        }
	        
	    } 
	    catch(SQLException se) {
	    	//Handle errors for JDBC
	    	response.setStatus(HttpServletResponse.SC_BAD_REQUEST );
	    	se.printStackTrace();
	    } 
	    catch(Exception e) {
	      	//Handle errors for Class.forName
	      	e.printStackTrace();
	    } 
	    finally {
	    	//finally block used to close resources
	        try {
	           if(stmt!=null)
	              stmt.close();
	        } catch(SQLException se2) {
	        } // nothing we can do
	        try {
	           if(conn!=null)
	        	   conn.close();
	        } catch(SQLException se) {
	             se.printStackTrace();
	        } //end finally try
	    }
       
		//make json object
		JSONObject account = new JSONObject();
		account.put("username", username);
		account.put("password", password);
		account.put("browser", browser);
		account.put("ip", ipAddress);
		
		String sendme = account.toString();
	
		//send post request
		String query = "http://localhost:8081/IdentityService/login";
		URL url = new URL(query);
		HttpURLConnection conns = (HttpURLConnection) url.openConnection();
		conns.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
		conns.setDoOutput(true);
		conns.setDoInput(true);
		conns.setRequestMethod("POST");
		OutputStream os = conns.getOutputStream();
		os.write(sendme.getBytes("UTF-8"));
		os.close();
		
		// read the response
		StringBuilder sb = new StringBuilder();  
		int HttpResult = conns.getResponseCode(); 
		if (HttpResult == HttpURLConnection.HTTP_OK) {
		    BufferedReader br = new BufferedReader(
		            new InputStreamReader(conns.getInputStream(), "utf-8"));
		    String line = null;  
		    while ((line = br.readLine()) != null) {  
		        sb.append(line + "\n");  
		    }
		    br.close();
		    System.out.println("" + sb.toString());  
		    JSONObject jsonObject = new JSONObject(sb.toString());
		    
		    //extract token
			token = jsonObject.getString("token");
			String expiry_time = jsonObject.getString("expiry_time");
			session.setAttribute("token", token);
			session.setAttribute("tokenFCM", tokenFCM);
			session.setAttribute("expiry_time", expiry_time);	
			session.setAttribute("ip", ipAddress);
			session.setAttribute("browser", browser);
			//redirect
	        response.setStatus(response.SC_MOVED_TEMPORARILY);
	        response.setHeader("Location", "http://localhost:8080/loginredirect.jsp");
		} else {
		    %> <script> alert("Wrong password / username") </script> <%
		}  
		conns.disconnect();
	}
	%>

 	<div class="login" id="form-login">
 		<h2 class="title">---LOGIN---</h2>
    <form method="POST" action="login.jsp" name="form-login" enctype='application/json'>
    	<input type="hidden" id="tokenFCM" value="" name="tokenFCM">
   		<div class="input-form">
   			<div class="label">
   				<p style="width: 120px;">Username</p>
  	 			<input id="username-field" type="text" name="username" placeholder="   your username">
  	 		</div>
  	 		<div class="label">
  	 			<p style="width: 120px;">Password</p>
  	 			<input id="password-field" type="password" name="password" placeholder="   password">
  	 		</div>
  	 	</div>
   		<div class="submit-form"> 
   			<p class="no-acc"><a href="register.jsp"> Don't have an account?</a></p>
   			<input type="submit" value="GO!" onclick=" return submitForm(this,event)">
   		</div>
    </form>
 	</div>
 	
 	<script src="https://www.gstatic.com/firebasejs/4.6.2/firebase.js"></script>
	<script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-messaging.js"></script>
 	<script src="javascript/firebase.js"></script>
</body>
</html>