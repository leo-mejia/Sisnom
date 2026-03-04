package servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.JSONObject;

import config.Conexion;

@WebServlet(urlPatterns = {"/perfil"})
public class PerfilServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JSONObject json = new JSONObject();
        
        HttpSession session = request.getSession();
        String usuarioEmail = (String) session.getAttribute("usuario");
        
        if (usuarioEmail == null) {
            json.put("success", false);
            json.put("mensaje", "Usuario no autenticado");
            response.getWriter().write(json.toString());
            return;
        }
        
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try {
            con = Conexion.getConnection();
            
            String sql = "SELECT e.id_empleado, e.nombres, e.apellidos, " +
                         "e.correo_personal, e.telefono, e.direccion, e.cargo, " +
                         "e.departamento, e.fecha_inicio, e.estado, u.rol " +
                         "FROM empleado e " +
                         "INNER JOIN usuario u ON e.id_usuario = u.id_usuario " +
                         "WHERE u.correo = ? AND e.estado = 'activo' " +
                         "LIMIT 1";
            ps = con.prepareStatement(sql);
            ps.setString(1, usuarioEmail);
            
            rs = ps.executeQuery();
            
            if (rs.next()) {
                json.put("success", true);
                json.put("idEmpleado", rs.getString("id_empleado"));
                json.put("nombres", rs.getString("nombres") != null ? rs.getString("nombres") : "");
                json.put("apellidos", rs.getString("apellidos") != null ? rs.getString("apellidos") : "");
                json.put("correo", rs.getString("correo_personal"));
                json.put("telefono", rs.getString("telefono") != null ? rs.getString("telefono") : "");
                json.put("direccion", rs.getString("direccion") != null ? rs.getString("direccion") : "");
                json.put("cargo", rs.getString("cargo") != null ? rs.getString("cargo") : "");
                json.put("departamento", rs.getString("departamento") != null ? rs.getString("departamento") : "");
                json.put("fechaInicio", rs.getString("fecha_inicio") != null ? rs.getString("fecha_inicio") : "");
                json.put("rol", rs.getString("rol") != null ? rs.getString("rol") : "");
            } else {
                json.put("success", false);
                json.put("mensaje", "Empleado no encontrado");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            json.put("success", false);
            json.put("mensaje", "Error al obtener datos: " + e.getMessage());
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (ps != null) ps.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (con != null) con.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        
        response.getWriter().write(json.toString());
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JSONObject json = new JSONObject();
        
        HttpSession session = request.getSession();
        String usuarioEmail = (String) session.getAttribute("usuario");
        
        if (usuarioEmail == null) {
            json.put("success", false);
            json.put("mensaje", "Usuario no autenticado");
            response.getWriter().write(json.toString());
            return;
        }
        
        StringBuilder jsonBody = new StringBuilder();
        String line;
        try (java.io.BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonBody.append(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        
        JSONObject reqBody = new JSONObject(jsonBody.toString());
        String nombres = reqBody.optString("nombres", "").trim();
        String apellidos = reqBody.optString("apellidos", "").trim();
        String correoPersonal = reqBody.optString("correo", "").trim();
        String telefono = reqBody.optString("telefono", "").trim();
        String direccion = reqBody.optString("direccion", "").trim();
        String cargo = reqBody.optString("cargo", "").trim();
        String departamento = reqBody.optString("departamento", "").trim();
        
        if (nombres.isEmpty() || apellidos.isEmpty() || correoPersonal.isEmpty()) {
            json.put("success", false);
            json.put("mensaje", "Nombres, apellidos y correo son requeridos");
            response.getWriter().write(json.toString());
            return;
        }
        
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try {
            con = Conexion.getConnection();
            
            // Primero obtener el id_empleado del usuario autenticado
            String sqlGetId = "SELECT e.id_empleado FROM empleado e " +
                             "INNER JOIN usuario u ON e.id_usuario = u.id_usuario " +
                             "WHERE u.correo = ?";
            ps = con.prepareStatement(sqlGetId);
            ps.setString(1, usuarioEmail);
            rs = ps.executeQuery();
            
            int idEmpleado = -1;
            if (rs.next()) {
                idEmpleado = rs.getInt("id_empleado");
            } else {
                json.put("success", false);
                json.put("mensaje", "No se encontró el registro del empleado");
                response.getWriter().write(json.toString());
                return;
            }
            
            String sqlUpdate = "UPDATE empleado SET nombres = ?, apellidos = ?, correo_personal = ?, " +
                              "telefono = ?, direccion = ?, cargo = ?, departamento = ? WHERE id_empleado = ?";
            ps = con.prepareStatement(sqlUpdate);
            ps.setString(1, nombres);
            ps.setString(2, apellidos);
            ps.setString(3, correoPersonal);
            ps.setString(4, telefono);
            ps.setString(5, direccion);
            ps.setString(6, cargo);
            ps.setString(7, departamento);
            ps.setInt(8, idEmpleado);
            
            int filasActualizadas = ps.executeUpdate();
            
            if (filasActualizadas > 0) {
                json.put("success", true);
                json.put("mensaje", "Perfil actualizado correctamente");
                System.out.println("✅ Perfil actualizado para empleado ID: " + idEmpleado);
            } else {
                json.put("success", false);
                json.put("mensaje", "No se pudo actualizar el perfil");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            json.put("success", false);
            json.put("mensaje", "Error al actualizar: " + e.getMessage());
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (ps != null) ps.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (con != null) con.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        
        response.getWriter().write(json.toString());
    }
    
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JSONObject json = new JSONObject();
        
        HttpSession session = request.getSession();
        String usuarioEmail = (String) session.getAttribute("usuario");
        
        if (usuarioEmail == null) {
            json.put("success", false);
            json.put("mensaje", "Usuario no autenticado");
            response.getWriter().write(json.toString());
            return;
        }
        
        Connection con = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        
        try {
            con = Conexion.getConnection();
            
            // Primero obtener el id_empleado
            String sqlGetId = "SELECT e.id_empleado FROM empleado e " +
                             "INNER JOIN usuario u ON e.id_usuario = u.id_usuario " +
                             "WHERE u.correo = ?";
            ps = con.prepareStatement(sqlGetId);
            ps.setString(1, usuarioEmail);
            rs = ps.executeQuery();
            
            int idEmpleado = -1;
            if (rs.next()) {
                idEmpleado = rs.getInt("id_empleado");
            } else {
                json.put("success", false);
                json.put("mensaje", "No se encontró el registro del empleado");
                response.getWriter().write(json.toString());
                return;
            }
            
            // Marcar empleado como inactivo (soft delete)
            String sqlUpdate = "UPDATE empleado SET estado = 'inactivo' WHERE id_empleado = ?";
            ps = con.prepareStatement(sqlUpdate);
            ps.setInt(1, idEmpleado);
            
            int filasActualizadas = ps.executeUpdate();
            
            if (filasActualizadas > 0) {
                // Invalidar sesión
                session.invalidate();
                
                json.put("success", true);
                json.put("mensaje", "Perfil eliminado correctamente");
                System.out.println("⚠️ Empleado desactivado - ID: " + idEmpleado + " | Email: " + usuarioEmail);
            } else {
                json.put("success", false);
                json.put("mensaje", "No se encontró el empleado");
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            json.put("success", false);
            json.put("mensaje", "Error al eliminar: " + e.getMessage());
        } finally {
            try { if (rs != null) rs.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (ps != null) ps.close(); } catch (SQLException e) { e.printStackTrace(); }
            try { if (con != null) con.close(); } catch (SQLException e) { e.printStackTrace(); }
        }
        
        response.getWriter().write(json.toString());
    }
}
