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
            // Aplica primero la configuración predeterminada de EF Core.
            base.OnModelCreating(modelBuilder);

            //Indexación (unicidad) de DNI para estudiante
            modelBuilder.Entity<Student>()
                .HasIndex(s => s.DNI)
                .IsUnique();

            // Clave compuesta de StudentCrew.
            modelBuilder.Entity<StudentCrew>()
                .HasKey(sc => new { sc.StudentId, sc.CrewId });

            // Clave compuesta de ChargePayment.
            modelBuilder.Entity<ChargePayment>()
                .HasKey(cp => new { cp.ChargeId, cp.PaymentId });

            // Relación entre Payment y Student.
            modelBuilder.Entity<Payment>()
                .HasOne<Student>()
                .WithMany()
                .HasForeignKey(p => p.StudentId)

                .OnDelete(DeleteBehavior.Restrict);

            // Relación entre Charge y Student.
            modelBuilder.Entity<Charge>()
                .HasOne<Student>()
                .WithMany()
                .HasForeignKey(c => c.StudentId)

                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}