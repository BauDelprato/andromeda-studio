namespace Andromeda.Api.DTOs.Students
{
    public class UpdateStudentRequest
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? DNI { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool? FitnessCertificate { get; set; }
        public string? Notes { get; set; }
    }
}