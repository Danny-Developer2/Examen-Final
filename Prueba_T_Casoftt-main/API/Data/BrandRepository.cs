using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class BrandRepository(DataContext context, IMapper mapper) : IBrandRepository
{
    public void Add(Brand item) => context.Brands.Add(item);
    public void Delete(Brand item) => context.Brands.Remove(item);

    public async Task<bool> ExistsByIdAsync(int id) =>
        await context.Brands.AnyAsync(x => x.Id == id);

    public async Task<Brand?> GetAsNoTrackingByIdAsync(int id) =>
        await context.Brands
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<Brand?> GetByIdAsync(int id) =>
        await context.Brands
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<BrandDto?> GetDtoByIdAsync(int id) =>
        await context.Brands
            .ProjectTo<BrandDto>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id)
        ;

    public async Task<List<OptionDto>> GetOptionsAsync() => 
        await context.Brands
            .ProjectTo<OptionDto>(mapper.ConfigurationProvider)
            .ToListAsync()
        ;

    public async Task<PagedList<BrandDto>> GetPagedListAsync(BrandParams param)
    {
        IQueryable<Brand> query = context.Brands.AsQueryable();

        return await PagedList<BrandDto>.CreateAsync(
            query.ProjectTo<BrandDto>(mapper.ConfigurationProvider),
            param.PageNumber,
            param.PageSize
        );
    }
}
