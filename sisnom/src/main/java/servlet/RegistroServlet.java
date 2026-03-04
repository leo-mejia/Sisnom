package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import config.Conexion;

@WebServlet({"/registrar", "/Registrar"})
public class RegistroServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        Connection con = null;
        try {
            con = Conexion.getConnection();
            con.setAutoCommit(false); 

            // 1. Captura de datos
            String nombres = request.getParameter("nombres");
            String departamento = request.getParameter("departamento");
            String email = (request.getParameter("email") != null) ? request.getParameter("email").trim().toLowerCase() : "";
            
            // Depuración en consola
            System.out.println("DEBUG - Departamento recibido: [" + departamento + "]");

            // Lógica de usuario
            String primerNombre = (nombres != null && !nombres.isEmpty()) ? nombres.split(" ")[0].toLowerCase() : "user";
            String userGenerado = primerNombre + ((int)(Math.random() * 899) + 100);

            // 2. Insertar Usuario
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

            // 3. Insertar Empleado (CRUD - Create)
            String sqlEmp = "INSERT INTO empleado (id_usuario, nombres, apellidos, tipo_documento, numero_documento, correo_personal, telefono, direccion, cargo, fecha_inicio, departamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            PreparedStatement psEmp = con.prepareStatement(sqlEmp);
            psEmp.setInt(1, idGenerado);
            psEmp.setString(2, nombres);
            psEmp.setString(3, request.getParameter("apellidos"));
            psEmp.setString(4, request.getParameter("tipo_doc"));
            psEmp.setString(5, request.getParameter("numero_doc"));
            psEmp.setString(6, email);
            psEmp.setString(7, request.getParameter("telefono"));
            psEmp.setString(8, request.getParameter("direccion"));
            psEmp.setString(9, request.getParameter("cargo"));
            psEmp.setString(10, request.getParameter("fecha_inicio"));
            psEmp.setString(11,request.getParameter("departamento"));
            System.out.println("=== DEBUG EMPLEADO ===");
System.out.println("1. id_usuario: " + idGenerado);
System.out.println("2. nombres: " + nombres);
System.out.println("3. apellidos: " + request.getParameter("apellidos"));
System.out.println("4. tipo_doc: " + request.getParameter("tipo_doc"));
System.out.println("5. numero_doc: " + request.getParameter("numero_doc"));
System.out.println("6. email: " + email);
System.out.println("7. telefono: " + request.getParameter("telefono"));
System.out.println("8. direccion: " + request.getParameter("direccion"));
System.out.println("9. cargo: " + request.getParameter("cargo"));
System.out.println("10. fecha_inicio: " + request.getParameter("fecha_inicio"));
System.out.println("11. departamento: " + request.getParameter("departamento"));
psEmp.executeUpdate();

            psEmp.executeUpdate();
            con.commit(); 
            
            response.sendRedirect("index.jsp?registro=exitoso&usuarioCreado=" + userGenerado);

        } catch (SQLException e) {
            if (con != null) {
                try { con.rollback(); } catch (SQLException ex) {}
            }
            response.getWriter().println("Error SQL: " + e.getMessage());
        } finally {
            try { if (con != null) con.close(); } catch (SQLException ex) {}
        }
    }
}