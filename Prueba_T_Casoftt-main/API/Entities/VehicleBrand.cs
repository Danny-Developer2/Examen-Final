namespace API.Entities;

public class VehicleBrand {
    public VehicleBrand() {}
    public VehicleBrand(int brandId) => BrandId = brandId;
    
    public int VehicleId { get; set; } public Vehicle Vehicle { get; set; } = null!;
    public int BrandId { get; set; } public Brand Brand { get; set; } = null!;
}
