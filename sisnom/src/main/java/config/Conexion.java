package config;

import java.sql.Connection;
import java.sql.DriverManager;

public class Conexion {
    private static final String URL = "jdbc:mysql://localhost:3306/sisnom?serverTimezone=UTC";
    private static final String USER = "root"; 
    private static final String PASS = "1919"; 

    public static Connection getConnection() {
        Connection con = null;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(URL, USER, PASS);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
        return con;
    }
}
