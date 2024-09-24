package br.unoeste.ativooperante.db.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "AtivoOperante")
public class Imagem {

    @Id
    private String id;
    private long id_denuncia;
    private byte[] dados;

    public Imagem(long id_denuncia, byte[] dados) {
        this.id_denuncia = id_denuncia;
        this.dados = dados;
    }

    public Imagem() {
        this(0L,null);
    }

    public Imagem(String id) {
        this();
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public long getIdDenuncia() {
        return id_denuncia;
    }

    public void setIdDenuncia(long id_denuncia) {
        this.id_denuncia = id_denuncia;
    }

    public byte[] getDados() {
        return dados;
    }

    public void setDados(byte[] dados) {
        this.dados = dados;
    }
}