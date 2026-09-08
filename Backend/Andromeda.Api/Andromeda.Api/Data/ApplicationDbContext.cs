using Microsoft.EntityFrameworkCore;
using Andromeda.Api.Models;

namespace Andromeda.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Student> Students { get; set; }
        public DbSet<Crew> Crews { get; set; }
        public DbSet<StudentCrew> StudentCrew { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Charge> Charges { get; set; }
        public DbSet<ChargePayment> ChargePayments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Clave compuesta de StudentCrew
            modelBuilder.Entity<StudentCrew>()
                .HasKey(sc => new { sc.StudentId, sc.CrewId });

            // Clave compuesta de ChargePayment
            modelBuilder.Entity<ChargePayment>()
                .HasKey(cp => new { cp.ChargeId, cp.PaymentId });
        }
    }
}