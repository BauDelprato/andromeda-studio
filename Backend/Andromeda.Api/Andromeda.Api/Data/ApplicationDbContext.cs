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

            // DNI único por estudiante.
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.DNI)
                .IsUnique();

            // Permite historial de inscripciones, pero solo una activa por estudiante y Crew.
            modelBuilder.Entity<StudentCrew>()
                .HasIndex(sc => new { sc.StudentId, sc.CrewId })
                .IsUnique();

            // Clave compuesta de ChargePayment.
            modelBuilder.Entity<ChargePayment>()
                .HasKey(cp => new { cp.ChargeId, cp.PaymentId });

            // Evita eliminar registros relacionados con información histórica o financiera.
            modelBuilder.Entity<Payment>()
                .HasOne<Student>()
                .WithMany()
                .HasForeignKey(p => p.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Charge>()
                .HasOne(c => c.Student)
                .WithMany()
                .HasForeignKey(c => c.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Charge>()
                .HasOne(c => c.StudentCrew)
                .WithMany()
                .HasForeignKey(c => c.StudentCrewId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}