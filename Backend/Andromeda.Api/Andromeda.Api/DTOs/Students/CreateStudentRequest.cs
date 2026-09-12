namespace Andromeda.Api.DTOs.Students
{
    public class CreateStudentRequest
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string DNI { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool FitnessCertificate { get; set; }
        public string? Notes { get; set; }
        public bool IsActive { get; set; } = true;
    }
}