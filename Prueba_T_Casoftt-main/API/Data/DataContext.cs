using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data {
    public class DataContext : DbContext
    {
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Photo> Photos { get; set; } 
        public DbSet<Brand> Brands { get; set; }  

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<VehicleBrand>()
                .HasKey(x => new { x.VehicleId, x.BrandId, })
               
            ;

            builder.Entity<VehicleBrand>()
                .HasOne(x => x.Vehicle)
                .WithOne(x => x.VehicleBrand)
                .HasForeignKey<VehicleBrand>(x => x.VehicleId)
                .OnDelete(DeleteBehavior.NoAction)
                .OnDelete(DeleteBehavior.Cascade); 
            ;

            builder.Entity<VehicleBrand>()
                .HasOne(x => x.Brand)
                .WithMany(x => x.VehicleBrands)
                .HasForeignKey(x => x.BrandId)
                .OnDelete(DeleteBehavior.NoAction)
                .OnDelete(DeleteBehavior.Cascade); 
            ;

            builder.Entity<VehiclePhoto>()
                .HasKey(x => new { x.VehicleId, x.PhotoId, })
                 
            ;

            builder.Entity<VehiclePhoto>()
                .HasOne(x => x.Vehicle)
                .WithMany(x => x.VehiclePhotos)
                .HasForeignKey(x => x.VehicleId)
                .OnDelete(DeleteBehavior.NoAction)
                .OnDelete(DeleteBehavior.Cascade); 
            ;

            builder.Entity<VehiclePhoto>()
                .HasOne(x => x.Photo)
                .WithOne(x => x.VehiclePhoto)
                .HasForeignKey<VehiclePhoto>(x => x.PhotoId)
                .OnDelete(DeleteBehavior.Cascade)
                
            ;
             builder.Entity<Vehicle>()
                .HasOne(x => x.VehicleBrand)  // Si tienes una relación OneToOne con VehicleBrand
                .WithOne(x => x.Vehicle)
                .OnDelete(DeleteBehavior.Cascade); // Esto asegura que el Vehicle sea eliminado en cascada si tiene una relación One-to-One
        
        }
        
    }
}
