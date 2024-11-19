using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IBrandRepository {
    Task<PagedList<BrandDto>> GetPagedListAsync(BrandParams param);
    Task<BrandDto?> GetDtoByIdAsync(int id);
    Task<Brand?> GetByIdAsync(int id);
    Task<Brand?> GetAsNoTrackingByIdAsync(int id);
    void Add(Brand item);
    void Delete(Brand item);
    Task<bool> ExistsByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
}
