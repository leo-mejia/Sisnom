package com.sisnom.controller;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.font.PdfFont;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/api/nomina")
public class NominaController {

    @GetMapping("/pdf/{periodo}")
    public ResponseEntity<byte[]> generarDesprendible(@PathVariable String periodo) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            PdfFont boldFont = PdfFontFactory.createFont();

            document.add(new Paragraph("DESPRENDIBLE DE PAGO")
                .setFont(boldFont)
                .setFontSize(20)
                .setBold()
                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));

            document.add(new Paragraph("Sistema de Nómina SISNOM").setFontSize(14).setItalic());

            Table empresaTable = new Table(new float[]{1, 3});
            empresaTable.addCell(new Cell().add(new Paragraph("Empresa:").setBold()));
            empresaTable.addCell(new Cell().add(new Paragraph("Sisnom S.A.S")));
            empresaTable.addCell(new Cell().add(new Paragraph("NIT:").setBold()));
            empresaTable.addCell(new Cell().add(new Paragraph("900123456-7")));
            empresaTable.addCell(new Cell().add(new Paragraph("Periodo:").setBold()));
            empresaTable.addCell(new Cell().add(new Paragraph(periodo)));
            document.add(empresaTable);

            document.add(new Paragraph(" "));

            document.add(new Paragraph("DATOS DEL EMPLEADO").setBold().setFontSize(16));
            Table empleadoTable = new Table(new float[]{1, 3});
            empleadoTable.addCell(new Cell().add(new Paragraph("Nombre:").setBold()));
            empleadoTable.addCell(new Cell().add(new Paragraph("USUARIO LOGUEADO")));
            empleadoTable.addCell(new Cell().add(new Paragraph("Cargo:").setBold()));
            empleadoTable.addCell(new Cell().add(new Paragraph("Empleado")));
            empleadoTable.addCell(new Cell().add(new Paragraph("Departamento:").setBold()));
            empleadoTable.addCell(new Cell().add(new Paragraph("General")));
            document.add(empleadoTable);

            document.add(new Paragraph(" "));

            document.add(new Paragraph("DETALLE DE PAGO").setBold().setFontSize(16));
            Table nominaTable = new Table(new float[]{2, 1, 1});
            nominaTable.addHeaderCell(new Cell().add(new Paragraph("Concepto").setBold()));
            nominaTable.addHeaderCell(new Cell().add(new Paragraph("Devengos").setBold()).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT));
            nominaTable.addHeaderCell(new Cell().add(new Paragraph("Total").setBold()).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT));

            nominaTable.addCell(new Cell().add(new Paragraph("Salario Base")));
            nominaTable.addCell(new Cell().add(new Paragraph("$2,500,000").setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)));
            nominaTable.addCell(new Cell().add(new Paragraph("$2,500,000").setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)));

            nominaTable.addCell(new Cell().add(new Paragraph("Horas Extras")));
            nominaTable.addCell(new Cell().add(new Paragraph("$150,000").setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)));
            nominaTable.addCell(new Cell().add(new Paragraph("$150,000").setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)));

            nominaTable.addCell(new Cell().add(new Paragraph("Salud")));
            nominaTable.addCell(new Cell().add(new Paragraph("").setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)));
            nominaTable.addCell(new Cell().add(new Paragraph("($275,000)").setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)));

            nominaTable.addCell(new Cell().add(new Paragraph("Pensiones")));
            nominaTable.addCell(new Cell().add(new Paragraph("").setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)));
            nominaTable.addCell(new Cell().add(new Paragraph("($375,000)").setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT)));

            // Totales
            nominaTable.addCell(new Cell().add(new Paragraph("TOTAL DEVENGADO").setBold()));
            nominaTable.addCell(new Cell().add(new Paragraph("$2,650,000").setBold()).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT));
            nominaTable.addCell(new Cell().add(new Paragraph("$2,650,000").setBold()).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT));
            nominaTable.addCell(new Cell().add(new Paragraph("TOTAL DEDUCCIONES").setBold()));
            nominaTable.addCell(new Cell().add(new Paragraph("($650,000)").setBold()).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT));
            Table totalNetoTable = new Table(new float[]{4});
            totalNetoTable.addCell(new Cell(1, 4)
                .add(new Paragraph("NETO A PAGAR: $2,000,000").setBold().setFontSize(18))
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT));
            document.add(nominaTable);
            document.add(totalNetoTable);

            document.add(new Paragraph(" ")
                .setPaddingTop(20));
            document.add(new Paragraph("Firma Empleado: ___________________________")
                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.RIGHT));
            document.add(new Paragraph("Fecha: " + java.time.LocalDate.now()));

            document.close();

            byte[] pdfBytes = baos.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "desprendible_" + periodo + ".pdf");

            return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
