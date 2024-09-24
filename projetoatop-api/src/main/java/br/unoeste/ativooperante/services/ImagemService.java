package br.unoeste.ativooperante.services;

import br.unoeste.ativooperante.db.mongo.Imagem;
import br.unoeste.ativooperante.db.repository.ImagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class ImagemService {

    @Autowired
    private ImagemRepository imagemRepository;
    @Autowired
    private MongoTemplate mongoTemplate;

    public Imagem findByDenuncia(long id) {
        Query query = new Query(Criteria.where("id_denuncia").is(id));
        Imagem imagem = mongoTemplate.findOne(query, Imagem.class);
        if (imagem != null && imagem.getDados() != null)
            return imagem;
        return null;
    }

    public Imagem findById(String id) {
        return this.imagemRepository.findById(id).orElse(null);
    }

    public boolean save(Imagem imagem) {
        try {
            this.imagemRepository.save(imagem);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Boolean deleteById(String id) {
        try {
            this.imagemRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Imagem update(Long id, byte[] dados) {
        Imagem imagem = this.findByDenuncia(id);
        if (imagem != null)
            imagem.setDados(dados);
        else
            imagem = new Imagem(id, dados);
        return this.imagemRepository.save(imagem);
    }
}
