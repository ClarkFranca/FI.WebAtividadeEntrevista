CREATE PROC FI_SP_AltBeneficiario
(
    @ID          BIGINT,
    @NOME        VARCHAR(100),
    @CPF         VARCHAR(14)
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE BENEFICIARIOS
    SET
        NOME = @NOME,
        CPF  = @CPF
    WHERE ID = @ID;
END
