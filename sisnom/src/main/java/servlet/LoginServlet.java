package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import config.Conexion;

@WebServlet(urlPatterns = {"/login", "/Login"})
public class LoginServlet extends HttpServlet {
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        

        System.out.println("=== DEPURACIÓN DE ENTRADA (LOGIN) ===");
        Enumeration<String> parameterNames = request.getParameterNames();
        boolean hayParams = false;
        while (parameterNames.hasMoreElements()) {
            String paramName = parameterNames.nextElement();
            System.out.println(" -> Input recibido: name='" + paramName + "' | valor='" + request.getParameter(paramName) + "'");
            hayParams = true;
        }
        if (!hayParams) {
            System.out.println("⚠️ ALERTA: No llegó NINGÚN dato.");
        }
        System.out.println("=====================================");

        String emailInput = request.getParameter("email"); 
        String passwordInput = request.getParameter("password");
        

        if (emailInput != null) {
            emailInput = emailInput.trim().toLowerCase();
        } else {
            System.out.println("❌ ERROR CRÍTICO: 'email' es NULL. ");
        }
        
        if (passwordInput == null) {
            System.out.println("❌ ERROR CRÍTICO: 'password' es NULL.");
        }
        

        System.out.println("INTENTO LOGIN -> Email: [" + emailInput + "]");
        
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try {
            con = Conexion.getConnection();
            

            String sql = "SELECT u.rol, e.estado FROM usuario u " +
                        "LEFT JOIN empleado e ON u.id_usuario = e.id_usuario " +
                        "WHERE u.correo = ? AND u.contraseña = ?";
            ps = con.prepareStatement(sql);
            ps.setString(1, emailInput);
            ps.setString(2, passwordInput);
            
            rs = ps.executeQuery();

            if (rs.next()) {
                String rolStr = rs.getString("rol");
                String estadoEmpleado = rs.getString("estado");
                
                if (rolStr == null) {
                    System.out.println("❌ ERROR: rol es NULL en la BD");
                    response.sendRedirect("index.jsp?error=db");
                    return;
                }
                
                String rol = rolStr.trim().toLowerCase();
                
                // Verificar si empleado está activo (solo para rol empleado)
                if (rol.equals("empleado")) {
                    if (estadoEmpleado == null || estadoEmpleado.equals("inactivo")) {
                        System.out.println("❌ LOGIN BLOQUEADO -> Empleado inactivo o eliminado.");
                        response.sendRedirect("index.jsp?error=empleado_inactivo");
                        return;
                    }
                }
                
                System.out.println("✅ LOGIN EXITOSO -> Rol detectado: [" + rol + "]");


                HttpSession session = request.getSession();
                session.setAttribute("usuario", emailInput);
                session.setAttribute("rol", rol);


                String baseUrl = request.getContextPath();
                String urlDestino = "";
                
                switch (rol) {
                    case "admin":
                        urlDestino = baseUrl + "/administrador/administrador.html";
                        break;
                    case "empleado":
                        urlDestino = baseUrl + "/empleado/empleado.html";
                        break;
                    case "contador":
                        urlDestino = baseUrl + "/contador/contador.html";
                        break;
                    case "recursos_humanos":
                        urlDestino = baseUrl + "/recursos_humanos/recursos_humanos.html";
                        break;
                    default:
                        System.out.println("ERROR: Rol desconocido -> " + rol);
                        response.sendRedirect("index.jsp?error=rol_invalido");
                        return;
                }
                
                response.sendRedirect(urlDestino);
                
            } else {

                System.out.println("LOGIN FALLIDO -> Correo o contraseña incorrectos.");
                response.sendRedirect("index.jsp?error=autenticacion");
            }

        } catch (Exception e) {
            e.printStackTrace();

            response.sendRedirect("index.jsp?error=db");
        } finally {

            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (ps != null) ps.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (con != null) con.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
    }
}