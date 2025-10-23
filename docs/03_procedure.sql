-- Verifica conflito de agenda antes de inserir consulta
CREATE OR REPLACE FUNCTION agendar_consulta(_paciente BIGINT, _medico BIGINT, _data TIMESTAMP)
RETURNS BIGINT AS $$
DECLARE novo_id BIGINT;
BEGIN
  IF EXISTS (
    SELECT 1 FROM consulta
    WHERE medico_id=_medico AND data_hora=_data AND status <> 'CANCELADA'
  ) THEN
    RAISE EXCEPTION 'Conflito de agenda para este médico no horário %', _data;
  END IF;
  INSERT INTO consulta(paciente_id, medico_id, data_hora)
  VALUES (_paciente, _medico, _data)
  RETURNING id INTO novo_id;
  RETURN novo_id;
END;$$ LANGUAGE plpgsql;