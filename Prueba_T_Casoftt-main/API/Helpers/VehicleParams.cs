namespace API.Helpers;

public class VehicleParams : PaginationParams {
    public int? Year { get; set; } = null;
    public string? Term { get; set; } = null;
}
