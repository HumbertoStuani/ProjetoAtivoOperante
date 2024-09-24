package br.unoeste.ativooperante.db.repository;

import br.unoeste.ativooperante.db.entities.Tipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TipoRepository extends JpaRepository<Tipo,Long>
{
}
