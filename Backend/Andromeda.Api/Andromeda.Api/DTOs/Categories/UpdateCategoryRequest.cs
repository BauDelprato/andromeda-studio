namespace Andromeda.Api.DTOs.Categories
{
    public class UpdateCategoryRequest
    {
        public string? Name { get; set; }

        public bool? IsActive { get; set; }

        public string? Description { get; set; }
    }
}
