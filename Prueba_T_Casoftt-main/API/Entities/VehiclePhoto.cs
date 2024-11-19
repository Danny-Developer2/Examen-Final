namespace API.Entities;

public class VehiclePhoto {
    public VehiclePhoto() {}
    public VehiclePhoto(string url) {
        Photo = new(url);
    }
    
    public int VehicleId { get; set; } public Vehicle Vehicle { get; set; } = null!;
    public int PhotoId { get; set; } public Photo Photo { get; set; } = null!;
}
