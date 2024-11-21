
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class VehicleRepository(DataContext context, IMapper mapper) : IVehicleRepository
{
    public void Add(Vehicle item) => context.Vehicles.Add(item);
    public void Delete(Vehicle item) => context.Vehicles.Remove(item);

    public void Update(Vehicle vehicle) => context.Vehicles.Update(vehicle);

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.Vehicles.AnyAsync(x => x.Id == id);

    public async Task<Vehicle?> GetAsNoTrackingByIdAsync(int id) =>
        await context.Vehicles
            .Include(x => x.VehicleBrand.Brand)
            .Include(x => x.VehiclePhotos).ThenInclude(x => x.Photo)
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<Vehicle?> GetByIdAsync(int id) =>
        await context.Vehicles
            .Include(x => x.VehicleBrand.Brand)
            .Include(x => x.VehiclePhotos).ThenInclude(x => x.Photo)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<VehicleDto?> GetDtoByIdAsync(int id) =>
        await context.Vehicles
            .Include(x => x.VehicleBrand.Brand)
            .Include(x => x.VehiclePhotos).ThenInclude(x => x.Photo)
            .ProjectTo<VehicleDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<List<OptionDto>> GetOptionsAsync() =>
        await context.Vehicles
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync()
        ;

    public async Task<PagedList<VehicleDto>> GetPagedListAsync(VehicleParams param)
    {
        IQueryable<Vehicle> query = context.Vehicles
            .Include(v => v.VehicleBrand.Brand)
            .Include(x => x.VehiclePhotos).ThenInclude(x => x.Photo)
            .AsNoTracking();

        // Aplicar filtros según los parámetros
        if (!string.IsNullOrEmpty(param.Term))
        {
            string termLower = param.Term.ToLower();
            query = query.Where(x =>
                (!string.IsNullOrEmpty(x.Model) && x.Model.ToLower().Contains(termLower)) ||
                (x.Year.HasValue && x.Year.ToString() == param.Term) ||
                (x.VehicleBrand.Brand != null && x.VehicleBrand.Brand.Name!.ToLower().Contains(termLower))
            );
        }

        if (param.Year.HasValue && param.Year > 0)
        {
            query = query.Where(x => x.Year == param.Year);
        }

    
        var filteredQuery = query.ToList(); 
        foreach (var item in filteredQuery)
        {
            Console.WriteLine($"Model: {item.Model}, Year: {item.Year}"); 
        }

        
        var pagedList = await PagedList<VehicleDto>.CreateAsync(
            query.ProjectTo<VehicleDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize
        );

        return pagedList;
    }


}
