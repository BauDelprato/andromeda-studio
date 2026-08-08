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

        //método para crear la key de StudentCrew = StudentId + CrewId
        protected override void OnModelCreating(ModelBuilder modelBuilder) 
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<StudentCrew>()
                .HasKey(sc => new { sc.StudentId, sc.CrewId });
        }
    }
}