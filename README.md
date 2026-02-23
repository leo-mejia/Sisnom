# 🚀 Sisnom - Sistema de Nómina Web

Proyecto web full-stack para la gestión de nóminas de empleados, desarrollado con Java en el backend y tecnologías web estándar en el frontend.

## 🎯 Objetivo
Crear una aplicación web funcional e intuitiva para administrar el registro de empleados, usuarios y la generación de su nómina.

## 🛠️ Tecnologías usadas
*   **Backend:** Java (Servlets), Jakarta EE
*   **Frontend:** JSP, HTML, CSS, JavaScript
*   **Base de Datos:** MySQL (o el gestor que estés usando)
*   **Servidor de Aplicaciones:** Apache Tomcat
*   **Gestión de Dependencias:** Apache Maven

## 📋 Requisitos Técnicos

Para que el proyecto funcione correctamente, el entorno debe cumplir con:
*   **Java:** JDK 17 LTS (o superior).
*   **Maven:** Versión 3.8 o superior.
*   **Servidor:** Apache Tomcat 9.0 o superior.
*   **Base de Datos:** Un servidor de MySQL.
*   **IDE Recomendado:** VS Code con el "Extension Pack for Java" 

## 🚀 Configuración del Entorno

1. **Clonación y Preparación:**
   Al descargar el proyecto, abre la terminal en la carpeta raíz y ejecuta:
   En la consola de bash
   mvn clean install

2. **Para ejecutar el proyecto:**
   -mvn clean
   -mvn package
   -start server

3. **Base de datos:**
   Cambiar el usuario y contraseña en el archivo sisnom/src/main/java/config/conexion.java
   en la linea 7-8.
