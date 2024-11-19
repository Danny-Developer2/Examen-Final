using System.Collections.ObjectModel;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IPhotoRepository {
    Task<List<Photo>> GetListAsync(PhotoParams param);
    Task<PagedList<PhotoDto>> GetPagedListAsync(PhotoParams param);
    Task<Photo?> GetByIdAsync(int id);
    Task<Photo?> GetAsNoTrackingByIdAsync(int id);
    Task<PhotoDto?> GetDtoByIdAsync(int id);
    void Delete(Photo vehicle);
    void Add(Photo vehicle);
    Task<bool> ExistsByIdAsync(int id);
}
