package br.unoeste.ativooperante.db.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "orgaos")
public class Orgao {
    @Id
    @Column(name = "org_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "org_nome")
    private String nome;

    public Orgao(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public Orgao()
    {
        this(0L,"");
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
