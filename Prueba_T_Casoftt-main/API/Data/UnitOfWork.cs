using API.Interfaces;
using AutoMapper;

namespace API.Data;

public class UnitOfWork(DataContext context, IMapper mapper) : IUnitOfWork
{
    public IVehicleRepository VehicleRepository => new VehicleRepository(context, mapper);

    public IBrandRepository BrandRepository => new BrandRepository(context, mapper);
    public IPhotoRepository PhotoRepository => new PhotoRepository(context, mapper);

    public async Task<bool> CompleteAsync() =>
        await context.SaveChangesAsync() > 0;

    public bool HasChanges() => context.ChangeTracker.HasChanges();

}
