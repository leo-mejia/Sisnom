package servlet;

import config.Conexion;
import java.io.IOException;
import java.sql.*;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/registrar")
public class RegistroServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        Connection con = null;
        try {
            con = Conexion.getConnection();
            con.setAutoCommit(false); 

            String primerNombre = request.getParameter("nombres").split(" ")[0].toLowerCase();
            int randomNum = (int)(Math.random() * 899) + 100; 
            String userGenerado = primerNombre + randomNum;
            
            String email = request.getParameter("email").trim().toLowerCase();

            String sqlUser = "INSERT INTO usuario (nombre_usuario, correo, contraseña, rol) VALUES (?, ?, ?, ?)";
            PreparedStatement psUser = con.prepareStatement(sqlUser, Statement.RETURN_GENERATED_KEYS);
            psUser.setString(1, userGenerado);
            psUser.setString(2, email);
            psUser.setString(3, request.getParameter("password"));
            psUser.setString(4, request.getParameter("rol"));
            psUser.executeUpdate();

            ResultSet rs = psUser.getGeneratedKeys();
            int idGenerado = 0;
            if (rs.next()) idGenerado = rs.getInt(1);

            String sqlEmp = "INSERT INTO empleado (id_usuario, nombres, apellidos, tipo_documento, numero_documento, correo_personal, telefono, direccion, cargo, fecha_inicio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement psEmp = con.prepareStatement(sqlEmp);
            psEmp.setInt(1, idGenerado);
            psEmp.setString(2, request.getParameter("nombres"));
            psEmp.setString(3, request.getParameter("apellidos"));
            psEmp.setString(4, request.getParameter("tipo_doc"));
            psEmp.setString(5, request.getParameter("numero_doc"));
            psEmp.setString(6, email);
            psEmp.setString(7, request.getParameter("telefono"));
            psEmp.setString(8, request.getParameter("direccion"));
            psEmp.setString(9, request.getParameter("cargo"));
            psEmp.setString(10, request.getParameter("fecha_inicio"));
            
            psEmp.executeUpdate();
            
            con.commit(); 
            
            response.sendRedirect("index.jsp?registro=exitoso&usuarioCreado=" + userGenerado);

        } catch (Exception e) {
            try { if(con != null) con.rollback(); } catch (SQLException ex) {}
            e.printStackTrace();
            response.getWriter().println("Error detallado: " + e.getMessage());
        } finally {
            try { if(con != null) con.close(); } catch (SQLException ex) {}
        }
    }
}