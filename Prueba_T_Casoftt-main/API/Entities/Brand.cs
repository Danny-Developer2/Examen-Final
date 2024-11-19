namespace API.Entities
{
    public class Brand
    {
        public int Id { get; set; }
        public string? Name { get; set; } = null;

        public List<VehicleBrand> VehicleBrands { get; set; } = [];
    }
}
