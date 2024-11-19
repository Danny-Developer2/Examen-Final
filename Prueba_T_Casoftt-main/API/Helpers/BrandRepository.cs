namespace API.Helpers;

public class BrandParams : PaginationParams {
    public int? Year { get; set; } = null;
    public string? Term { get; set; } = null;
}
