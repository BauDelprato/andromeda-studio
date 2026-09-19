using Andromeda.Api.Data;
using Andromeda.Api.DTOs.Charges;
using Andromeda.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Andromeda.Api.Services
{
    public class ChargeGenerationService
    {
        private readonly ApplicationDbContext _context;
        private readonly ChargeService _chargeService;

        public ChargeGenerationService(
            ApplicationDbContext context,
            ChargeService chargeService)
        {
            _context = context;
            _chargeService = chargeService;
        }

        public async Task<ChargeResponse> GenerateRegistrationChargeAsync(
            int studentId,
            DateOnly billingPeriod)
        {
            var alreadyExists = await _context.Charges.AnyAsync(c =>
                c.StudentId == studentId &&
                c.Type == ChargeType.Registration &&
                c.BillingPeriod == billingPeriod);

            if (alreadyExists)
            {
                throw new InvalidOperationException(
                    "El estudiante ya tiene un cargo de Registration para este período.");
            }

            return await _chargeService.CreateAsync(
                new CreateChargeRequest
                {
                    StudentId = studentId,
                    Type = ChargeType.Registration,
                    DiscountAmount = 0,
                    BillingPeriod = billingPeriod
                });
        }

        public async Task<int> GenerateAnnualRegistrationChargesAsync(
            DateOnly billingPeriod)
        {
            var students = await _context.Students
                .Where(s => s.IsActive)
                .ToListAsync();

            var generated = 0;

            foreach (var student in students)
            {
                var alreadyExists = await _context.Charges.AnyAsync(c =>
                    c.StudentId == student.Id &&
                    c.Type == ChargeType.Registration &&
                    c.BillingPeriod == billingPeriod);

                if (alreadyExists)
                {
                    continue;
                }

                await _chargeService.CreateAsync(
                    new CreateChargeRequest
                    {
                        StudentId = student.Id,
                        Type = ChargeType.Registration,
                        DiscountAmount = 0,
                        BillingPeriod = billingPeriod
                    });

                generated++;
            }

            return generated;
        }

        public async Task<int> GenerateMonthlyCrewChargesAsync(
            DateOnly billingPeriod)
        {
            var studentCrews = await _context.StudentCrew
                .Include(sc => sc.Crew)
                .Include(sc => sc.Student)
                .Where(sc =>
                    sc.Student.IsActive)
                .ToListAsync();

            var generated = 0;

            foreach (var studentCrew in studentCrews)
            {
                var alreadyExists = await _context.Charges.AnyAsync(c =>
                    c.StudentCrewId == studentCrew.Id &&
                    c.Type == ChargeType.Crew &&
                    c.BillingPeriod == billingPeriod);

                if (alreadyExists)
                {
                    continue;
                }

                await _chargeService.CreateAsync(
                    new CreateChargeRequest
                    {
                        StudentId = studentCrew.StudentId,
                        Type = ChargeType.Crew,
                        DiscountAmount = 0,
                        BillingPeriod = billingPeriod,
                        StudentCrewId = studentCrew.Id
                    });

                generated++;
            }

            return generated;
        }
    }
}