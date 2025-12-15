CREATE PROC FI_SP_IncBeneficiario
(
    @NOME        VARCHAR(50),
    @CPF         VARCHAR(11),
    @IDCLIENTE   BIGINT
)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM CLIENTES WHERE ID = @IDCLIENTE)
    BEGIN
        RAISERROR('Cliente não encontrado.', 16, 1);
        RETURN;
    END

    INSERT INTO BENEFICIARIOS
    (
        NOME,
        CPF,
        IDCLIENTE
    )
    VALUES
    (
        @NOME,
        @CPF,
        @IDCLIENTE
    );
END
