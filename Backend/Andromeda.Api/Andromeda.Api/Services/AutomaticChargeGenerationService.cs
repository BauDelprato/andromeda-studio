using Andromeda.Api.Data;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class AutomaticChargeGenerationService
    {
        private readonly ApplicationDbContext _context;

        public AutomaticChargeGenerationService(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task GenerateRegistrationChargeIfMissingAsync(
            int studentId)
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null)
                return;

            var registrationDate =
                DateOnly.FromDateTime(student.CreatedAt);

            var price = await GetValidPriceAsync(
                PriceType.Registration,
                registrationDate);

            if (price == null)
                return;

            var billingPeriod = new DateOnly(
                registrationDate.Year, 1, 1);

            var alreadyExists = await _context.Charges.AnyAsync(c =>
                c.StudentId == studentId &&
                c.Type == ChargeType.Registration &&
                c.BillingPeriod == billingPeriod);

            if (alreadyExists)
                return;

            _context.Charges.Add(new Charge
            {
                StudentId = studentId,
                Type = ChargeType.Registration,
                Amount = price.Amount,
                PriceId = price.Id,
                BillingPeriod = billingPeriod,
                Status = ChargeStatus.Pending,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }

        public async Task GenerateCrewChargeIfMissingAsync(
            int studentCrewId)
        {
            var studentCrew = await _context.StudentCrew
                .Include(sc => sc.Crew)
                .FirstOrDefaultAsync(sc => sc.Id == studentCrewId);

            if (studentCrew == null)
                return;

            var enrollmentDate =
                DateOnly.FromDateTime(studentCrew.CreatedAt);

            var price = await GetValidPriceAsync(
                PriceType.Crew,
                enrollmentDate,
                studentCrew.Crew.Level);

            if (price == null)
                return;

            var billingPeriod = new DateOnly(
                enrollmentDate.Year,
                enrollmentDate.Month,
                1);

            var alreadyExists = await _context.Charges.AnyAsync(c =>
                c.StudentCrewId == studentCrewId &&
                c.Type == ChargeType.Crew &&
                c.BillingPeriod == billingPeriod);

            if (alreadyExists)
                return;

            _context.Charges.Add(new Charge
            {
                StudentId = studentCrew.StudentId,
                Type = ChargeType.Crew,
                Amount = price.Amount,
                PriceId = price.Id,
                BillingPeriod = billingPeriod,
                Status = ChargeStatus.Pending,
                StudentCrewId = studentCrew.Id,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }

        public async Task GenerateMissingChargesForPriceAsync(
            Price price)
        {
            if (price.Type == PriceType.Registration)
            {
                await GenerateMissingRegistrationChargesAsync(price);
            }
            else if (price.Type == PriceType.Crew &&
                     price.CrewLevel.HasValue)
            {
                await GenerateMissingCrewChargesAsync(price);
            }
        }

        private async Task GenerateMissingRegistrationChargesAsync(
            Price price)
        {
            var startDate = price.ValidFrom.ToDateTime(
                TimeOnly.MinValue, DateTimeKind.Utc);

            DateTime? endDate = price.ValidTo?.ToDateTime(
                TimeOnly.MinValue, DateTimeKind.Utc);

            var students = await _context.Students
                .Where(s =>
                    s.CreatedAt >= startDate &&
                    (!endDate.HasValue ||
                     s.CreatedAt < endDate.Value))
                .ToListAsync();

            if (students.Count == 0)
                return;

            var studentIds = students.Select(s => s.Id).ToList();

            var existingCharges = await _context.Charges
                .Where(c =>
                    c.Type == ChargeType.Registration &&
                    studentIds.Contains(c.StudentId) &&
                    c.BillingPeriod.HasValue)
                .Select(c => new
                {
                    c.StudentId,
                    BillingPeriod = c.BillingPeriod!.Value
                })
                .ToListAsync();

            var existingKeys = existingCharges
                .Select(c => (c.StudentId, c.BillingPeriod))
                .ToHashSet();

            var charges = new List<Charge>();

            foreach (var student in students)
            {
                var billingPeriod = new DateOnly(
                    student.CreatedAt.Year, 1, 1);

                if (!existingKeys.Add(
                    (student.Id, billingPeriod)))
                    continue;

                charges.Add(new Charge
                {
                    StudentId = student.Id,
                    Type = ChargeType.Registration,
                    Amount = price.Amount,
                    PriceId = price.Id,
                    BillingPeriod = billingPeriod,
                    Status = ChargeStatus.Pending,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (charges.Count == 0)
                return;

            _context.Charges.AddRange(charges);
            await _context.SaveChangesAsync();
        }

        private async Task GenerateMissingCrewChargesAsync(
            Price price)
        {
            var crewLevel = price.CrewLevel!.Value;

            var startDate = price.ValidFrom.ToDateTime(
                TimeOnly.MinValue, DateTimeKind.Utc);

            DateTime? endDate = price.ValidTo?.ToDateTime(
                TimeOnly.MinValue, DateTimeKind.Utc);

            var studentCrews = await _context.StudentCrew
                .Include(sc => sc.Crew)
                .Where(sc =>
                    sc.Crew.Level == crewLevel &&
                    sc.CreatedAt >= startDate &&
                    (!endDate.HasValue ||
                     sc.CreatedAt < endDate.Value))
                .ToListAsync();

            if (studentCrews.Count == 0)
                return;

            var studentCrewIds = studentCrews
                .Select(sc => sc.Id)
                .ToList();

            var existingCharges = await _context.Charges
                .Where(c =>
                    c.Type == ChargeType.Crew &&
                    c.StudentCrewId.HasValue &&
                    studentCrewIds.Contains(c.StudentCrewId.Value) &&
                    c.BillingPeriod.HasValue)
                .Select(c => new
                {
                    StudentCrewId = c.StudentCrewId!.Value,
                    BillingPeriod = c.BillingPeriod!.Value
                })
                .ToListAsync();

            var existingKeys = existingCharges
                .Select(c => (c.StudentCrewId, c.BillingPeriod))
                .ToHashSet();

            var charges = new List<Charge>();

            foreach (var studentCrew in studentCrews)
            {
                var enrollmentDate =
                    DateOnly.FromDateTime(studentCrew.CreatedAt);

                var billingPeriod = new DateOnly(
                    enrollmentDate.Year,
                    enrollmentDate.Month,
                    1);

                if (!existingKeys.Add(
                    (studentCrew.Id, billingPeriod)))
                    continue;

                charges.Add(new Charge
                {
                    StudentId = studentCrew.StudentId,
                    Type = ChargeType.Crew,
                    Amount = price.Amount,
                    PriceId = price.Id,
                    BillingPeriod = billingPeriod,
                    Status = ChargeStatus.Pending,
                    StudentCrewId = studentCrew.Id,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (charges.Count == 0)
                return;

            _context.Charges.AddRange(charges);
            await _context.SaveChangesAsync();
        }

        private async Task<Price?> GetValidPriceAsync(
            PriceType type,
            DateOnly date,
            CrewLevel? crewLevel = null)
        {
            return await _context.Prices
                .Where(p =>
                    p.Type == type &&
                    p.CrewLevel == crewLevel &&
                    p.ValidFrom <= date &&
                    (!p.ValidTo.HasValue ||
                     date < p.ValidTo.Value))
                .OrderByDescending(p => p.ValidFrom)
                .FirstOrDefaultAsync();
        }
    }
}