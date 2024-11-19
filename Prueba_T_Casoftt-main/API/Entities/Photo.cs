namespace API.Entities
{
    public class Photo
    {
        public Photo() {}
        public Photo(string url) => Url = url;
        
        public int Id { get; set; }
        public string? Url { get; set; } = null;

        public VehiclePhoto VehiclePhoto { get; set; } = null!;
    }
}
