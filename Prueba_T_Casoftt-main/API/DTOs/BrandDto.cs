using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class BrandDto
    {
        public int Id { get; set; }
        public string? Name { get; set; } = null;
    }

    public class BrandCreateDto {
        [Required(ErrorMessage = "El nombre de la marca es requerido.")]
        public string? Name { get; set; } = null;
    }

}

