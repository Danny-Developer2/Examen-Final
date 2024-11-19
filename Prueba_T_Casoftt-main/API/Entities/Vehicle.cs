namespace API.Entities
{
    public class Vehicle 
    {
        public int Id { get; set; }
        
        public string? Model { get; set; } = null;
        public int? Year { get; set; } = null;
        public string? Color { get; set; } = null;

        public VehicleBrand VehicleBrand { get; set; } = null!;
        public List<VehiclePhoto> VehiclePhotos { get; set; } = [];
        

    }
}