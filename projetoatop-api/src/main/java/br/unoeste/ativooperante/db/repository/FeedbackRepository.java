package br.unoeste.ativooperante.db.repository;

import br.unoeste.ativooperante.db.entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback,Long> {
}
