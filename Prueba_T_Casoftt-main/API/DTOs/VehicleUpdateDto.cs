namespace API.DTOs;

public class VehicleUpdateDto
{
    public int Id { get; set; }

    public string? Model { get; set; } = null;
    public int? Year { get; set; } = null;
    public string? Color { get; set; } = null;
    
}
