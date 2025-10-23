-- Quando cria/encerra internação, atualiza flag de ocupação do leito
CREATE OR REPLACE FUNCTION trg_atualiza_ocupacao()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE leito SET ocupado = TRUE WHERE id = NEW.leito_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.alta IS NOT NULL AND OLD.alta IS NULL THEN
    UPDATE leito SET ocupado = FALSE WHERE id = NEW.leito_id;
  END IF;
  RETURN NEW;
END;$$ LANGUAGE plpgsql;

CREATE TRIGGER internacao_ocupacao
AFTER INSERT OR UPDATE ON internacao
FOR EACH ROW EXECUTE FUNCTION trg_atualiza_ocupacao();