package br.unoeste.ativooperante.utils;

import br.unoeste.ativooperante.db.Conexao;
import net.sf.jasperreports.engine.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;

import java.io.IOException;
import java.sql.ResultSet;


public class ReportGenerator {
    private static final String sql = "select * from denuncia, orgaos, tipo where denuncia.org_id = orgaos.org_id and denuncia.tip_id = tipo.tip_id order by den_data";
    public static byte[] gerarRelatorioPDF() throws IOException {
        String path = "src/main/resources/reports/AtivoOperante.jasper";
        byte[] pdf;
        try { //sql para obter os dados para o relatorio
            JasperPrint jasperprint=null;
            ResultSet rs = new Conexao().consultar(sql);
            JRResultSetDataSource jrRS = new JRResultSetDataSource(rs);
            jasperprint = JasperFillManager.fillReport(path, null, jrRS);
            pdf= JasperExportManager.exportReportToPdf(jasperprint);

        } catch (JRException erro) {
            pdf=null;
        }
        return pdf;
    }
}
