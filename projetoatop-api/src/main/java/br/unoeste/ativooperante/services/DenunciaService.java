package br.unoeste.ativooperante.services;

import br.unoeste.ativooperante.db.entities.Denuncia;
import br.unoeste.ativooperante.db.entities.Feedback;
import br.unoeste.ativooperante.db.entities.Usuario;
import br.unoeste.ativooperante.db.mongo.Imagem;
import br.unoeste.ativooperante.db.repository.DenunciaRepository;
import br.unoeste.ativooperante.db.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
public class DenunciaService {

    @Autowired
    private ImagemService imagemService;
    @Autowired
    private DenunciaRepository denunciaRepository;
    @Autowired
    private FeedbackRepository feedbackRepository;
    @Autowired
    private UsuarioService usuarioService;

    public List<Denuncia> findAll() {
        return this.denunciaRepository.findAll();
    }

    public Denuncia findById(Long id) {
        return this.denunciaRepository.findById(id).orElse(null);
    }

    public Denuncia save(Denuncia denuncia) {
        return this.denunciaRepository.save(denuncia);
    }

    public boolean delete(Denuncia denuncia) {
        try {
            this.denunciaRepository.delete(denuncia);
            Imagem imagem = this.imagemService.findByDenuncia(denuncia.getId());
            if(imagem != null)
                this.imagemService.deleteById(imagem.getId());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Denuncia update(Long id, Denuncia denunciaUpdate) {
        Denuncia denuncia =  this.denunciaRepository.findById(id).orElse(null);
        if (denuncia != null) {
            denuncia.setOrgao(denunciaUpdate.getOrgao());
            denuncia.setTipo(denunciaUpdate.getTipo());
            denuncia.setTexto(denunciaUpdate.getTexto());
            denuncia.setTitulo(denunciaUpdate.getTitulo());
            if(denunciaUpdate.getFeedback() != null) {
                denuncia.setFeedback(denunciaUpdate.getFeedback());
            }
            return this.denunciaRepository.save(denuncia);
        }
        return null;
    }

    public Denuncia addFeedback(Long id, Feedback feedbackupdate) {
        Denuncia denuncia = this.denunciaRepository.findById(id).orElse(null);
        if(denuncia != null) {
            if(denuncia.getFeedback() != null) {
                Feedback feedback = this.feedbackRepository.findById(denuncia.getFeedback().getId()).orElse(null);
                feedback.setTexto(feedbackupdate.getTexto());
                this.feedbackRepository.save(feedback);
            }
            else {
                feedbackupdate.setDenuncia(denuncia);
                Feedback novoFeedback = this.feedbackRepository.save(feedbackupdate);
                denuncia.setFeedback(novoFeedback);
            }
            return this.denunciaRepository.save(denuncia);
        }
        return null;
    }

    public List<Denuncia> findByUsuario(long id) {
        Usuario usuario = this.usuarioService.findById(id);
        if(usuario != null)
            return this.denunciaRepository.findAllByUsuario(usuario);
        return null;
    }

    public List<Feedback> getFeedbacks() {
        return this.feedbackRepository.findAll();
    }
}
