public async Task<List<PendingChargeResponse>> GetPendingByStudentIdAsync(int studentId)
{
    var charges = await _context.Charges
        .AsNoTracking()
        .Where(charge => charge.StudentId == studentId &&
            (charge.Status == ChargeStatus.Pending ||
             charge.Status == ChargeStatus.PartiallyPaid))
        .OrderBy(charge => charge.CreatedAt)
        .Select(charge => new
        {
            Charge = charge,
            PaidAmount = _context.ChargePayments
                .Where(link => link.ChargeId == charge.Id)
                .Sum(link => (decimal?)link.Amount) ?? 0m,
            DiscountAmount = _context.ChargePayments
                .Where(link => link.ChargeId == charge.Id)
                .Sum(link => (decimal?)link.DiscountAmount) ?? 0m
        })
        .ToListAsync();

    return charges
        .Select(item => new PendingChargeResponse
        {
            Id = item.Charge.Id,
            StudentId = item.Charge.StudentId,
            Type = item.Charge.Type,
            Amount = item.Charge.Amount,
            OutstandingAmount = Math.Max(
                0m,
                item.Charge.Amount - item.PaidAmount - item.DiscountAmount),
            BillingPeriod = item.Charge.BillingPeriod,
            Status = item.Charge.Status,
            CreatedAt = item.Charge.CreatedAt,
            StudentCrewId = item.Charge.StudentCrewId
        })
        .Where(charge => charge.OutstandingAmount > 0m)
        .ToList();
}
