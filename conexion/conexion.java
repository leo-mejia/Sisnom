package conexion;
import java.sql.*;

public class conexion {
    public static void main(String[] args) {
        try {
            // Cargar Driver y Conectar (Pasos 4 y 5)
            Class.forName("com.mysql.cj.jdbc.Driver");
            String url = "jdbc:mysql://localhost:3306/sisnom?useSSL=false&allowPublicKeyRetrieval=true";
            Connection cn = DriverManager.getConnection(url, "root", "1919");
            System.out.println("¡Conexión establecida! 🔌");

            // Crear el Statement (Paso 6)
            Statement st = cn.createStatement();

            // Definir y ejecutar el INSERT (Pasos 7 y 8)
            String sql = "INSERT INTO usuario (nombre_usuario, contraseña, rol) VALUES ('AdminPrueba', 'pass123', 'empleado')";
            int filas = st.executeUpdate(sql);

            if (filas > 0) {
                System.out.println("¡Registro insertado con éxito! ✨");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}