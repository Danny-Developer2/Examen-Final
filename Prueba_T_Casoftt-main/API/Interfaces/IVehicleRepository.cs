using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IVehicleRepository
{
    Task<PagedList<VehicleDto>> GetPagedListAsync(VehicleParams param);
    Task<VehicleDto?> GetDtoByIdAsync(int id);
    Task<Vehicle?> GetByIdAsync(int id);
    Task<Vehicle?> GetAsNoTrackingByIdAsync(int id);
    void Add(Vehicle item);
    void Delete(Vehicle item);
    void Update(Vehicle vehicle);
    Task<bool> ExistsByIdAsync(int id);
    Task<List<OptionDto>> GetOptionsAsync();
}
