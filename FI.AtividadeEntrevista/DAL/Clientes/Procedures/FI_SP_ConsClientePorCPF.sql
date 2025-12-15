CREATE PROCEDURE FI_SP_ConsClientePorCPF
    @CPF VARCHAR(14)
AS
BEGIN
    SELECT *
    FROM CLIENTES
    WHERE REPLACE(REPLACE(CPF, '.', ''), '-', '') =
          REPLACE(REPLACE(@CPF, '.', ''), '-', '')
END
