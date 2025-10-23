CREATE OR REPLACE VIEW vw_agenda_medico AS
SELECT c.id AS consulta_id, m.nome AS medico, p.nome AS paciente,
       c.data_hora, c.status
FROM consulta c
JOIN medico m   ON m.id = c.medico_id
JOIN paciente p ON p.id = c.paciente_id
ORDER BY c.data_hora DESC;