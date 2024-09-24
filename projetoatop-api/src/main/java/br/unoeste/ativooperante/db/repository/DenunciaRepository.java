package br.unoeste.ativooperante.db.repository;

import br.unoeste.ativooperante.db.entities.Denuncia;
import br.unoeste.ativooperante.db.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DenunciaRepository extends JpaRepository<Denuncia,Long> {

    public List<Denuncia> findAllByUsuario (Usuario usuario);
}
