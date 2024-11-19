namespace API.Helpers;

public class VehicleParams : PaginationParams {
    public int? Year { get; set; } = 0;
    public string? Term { get; set; } = null;
}
