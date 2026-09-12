namespace Andromeda.Api.DTOs.Students
{
    public class CreateStudentRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string DNI { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool FitnessCertificate { get; set; }
        public string? Notes { get; set; }
    }
}