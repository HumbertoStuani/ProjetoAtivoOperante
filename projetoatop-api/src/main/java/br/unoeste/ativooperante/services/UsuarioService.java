package br.unoeste.ativooperante.services;

import br.unoeste.ativooperante.db.entities.Usuario;
import br.unoeste.ativooperante.db.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario save(Usuario usuario) {
        return this.usuarioRepository.save(usuario);
    }

    public boolean delete(Long id) {
        try {
            this.usuarioRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    public Usuario findById(Long id) {
        return this.usuarioRepository.findById(id).orElse(null);
    }
    public Usuario findByEmail(String email) {
        return this.usuarioRepository.findByEmail(email).orElse(null);
    }
}
