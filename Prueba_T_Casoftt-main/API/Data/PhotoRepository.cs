using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class PhotoRepository(DataContext context, IMapper mapper) : IPhotoRepository
{
    public void Add(Photo photo) => context.Photos.Remove(photo);

    public void Delete(Photo photo) => context.Photos.Remove(photo);

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.Vehicles.AnyAsync(x => x.Id == id);

    public async Task<Photo?> GetAsNoTrackingByIdAsync(int id) =>
        await context.Photos
            .AsNoTracking()
            .Include(x => x.VehiclePhoto.Vehicle)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<Photo?> GetByIdAsync(int id) =>
        await context.Photos
        .Include(x => x.VehiclePhoto.Vehicle)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<PhotoDto?> GetDtoByIdAsync(int id) =>
        await context.Photos
            .Include(x => x.VehiclePhoto.Vehicle)
            .ProjectTo<PhotoDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<PagedList<PhotoDto>> GetPagedListAsync(PhotoParams param)
    {
        IQueryable<Photo>? query = context.Photos
            .AsNoTracking()
            .AsQueryable()
        ;

        PagedList<PhotoDto> pagedList = await PagedList<PhotoDto>.CreateAsync(
            query.ProjectTo<PhotoDto>(mapper.ConfigurationProvider), param.PageNumber, param.PageSize)
        ;

        return pagedList;
    }

    public async Task<List<Photo>> GetListAsync(PhotoParams param)
    {
        IQueryable<Photo>? query = context.Photos
            .AsNoTracking()
            .AsQueryable()
        ;

        if(param.VehicleId.HasValue)
        {   
            query = query.Where(x => x.VehiclePhoto.VehicleId == param.VehicleId.Value);
        }

        List<Photo> list = await query.ToListAsync();

        return list;
    }
}