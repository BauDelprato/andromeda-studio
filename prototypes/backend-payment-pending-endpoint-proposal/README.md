# Propuesta para el endpoint de cargos pendientes

El backend ya tiene `GET /api/Charge/student/{studentId}/pending`. Actualmente incluye cargos `Pending` y `PartiallyPaid`, pero su respuesta no contiene `StudentCrewId` ni el saldo que falta pagar.

Los archivos de este directorio muestran una propuesta aislada para ampliar la respuesta existente:

- `PendingChargeResponse.proposed.cs`: agregar `OutstandingAmount` y `StudentCrewId` al DTO que ya existe en `Backend/Andromeda.Api/Andromeda.Api/DTOs/Charges/PendingChargeResponse.cs`.
- `ChargeService.GetPendingByStudentIdAsync.proposed.cs`: reemplazar el método actual de `Backend/Andromeda.Api/Andromeda.Api/Services/ChargeService.cs` para calcular el saldo restando pagos y descuentos ya aplicados.

No hace falta agregar una ruta ni una acción al controlador: `ChargeController` ya expone ese endpoint. Estos archivos son solo una referencia; no forman parte del proyecto ejecutable y no se modificó ningún archivo del backend.

La pantalla de registro implementada aquí tampoco depende de la propuesta: consulta `GET /api/Charge/student/{studentId}` y filtra los cargos cuyo estado es `Pending`. No muestra cargos parcialmente pagados.
