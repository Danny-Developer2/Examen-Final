using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class VehiclesController(IUnitOfWork uow) : BaseApiController
    {


        [HttpGet]
        public async Task<ActionResult<PagedList<VehicleDto>>> GetPagedListAsync([FromQuery] VehicleParams param)
        {
            PagedList<VehicleDto> pagedList = await uow.VehicleRepository.GetPagedListAsync(param);

            // Asegúrate de especificar el tipo genérico de PagedList al agregar el encabezado de paginación
            Response.AddPaginationHeader<VehicleDto>(pagedList);

            return pagedList;
        }



        [HttpPost]
        public async Task<ActionResult<VehicleDto?>> CreateAsync([FromBody] VehicleCreateDto request)
        {
            if (request.Brand == null) return BadRequest("La marca del vehículo es requerida.");

            if (!request.Brand.Id.HasValue) return BadRequest("El ID de la marca no fue proporcionado.");

            int brandId = request.Brand.Id.Value;

            if (!await uow.BrandRepository.ExistsByIdAsync(brandId)) return NotFound($"La marca con ID {brandId} no fue encontrada.");

            Vehicle vehicleToCreate = new();

            vehicleToCreate.VehicleBrand = new(brandId);

            vehicleToCreate.Model = request.Model;
            vehicleToCreate.Year = request.Year;
            vehicleToCreate.Color = request.Color;

            if (request.Photos.Count == 0) return BadRequest("Debe agregar al menos una foto.");

            foreach (VehiclePhotoCreateDto photo in request.Photos)
            {
                if (string.IsNullOrWhiteSpace(photo.Url)) return BadRequest("Las fotos deben tener un URL");

                vehicleToCreate.VehiclePhotos.Add(new(photo.Url));
            }

            uow.VehicleRepository.Add(vehicleToCreate);

            if (!await uow.CompleteAsync()) return BadRequest("Errores al guardar el vehículo.");

            return await uow.VehicleRepository.GetDtoByIdAsync(vehicleToCreate.Id);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleDto?>> GetDtoByIdAsync([FromRoute] int id)
        {
            if (!await uow.VehicleRepository.ExistsByIdAsync(id)) return NotFound($"El vehículo con ID {id} no fue encontrado.");

            return await uow.VehicleRepository.GetDtoByIdAsync(id);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteVehicle(int id)
        {
            // Verificar si el vehículo existe
            var vehicle = await uow.VehicleRepository.GetByIdAsync(id);
            if (vehicle == null)
            {
                // Si no existe, devolver un error 404
                return NotFound(new { message = "Vehicle not found." });
            }

            // Eliminar el vehículo
            uow.VehicleRepository.Delete(vehicle);

            // Guardar los cambios en la base de datos
            if (await uow.CompleteAsync())
            {
                // Si la eliminación fue exitosa, devolver un 200 OK
                return StatusCode(200, new { message = "Vehicle deleted successfully." });

            }
            else
            {
                // Si hubo un error al guardar los cambios, devolver un error 500
                return StatusCode(500, new { message = "An error occurred while deleting the vehicle." });
            }
        }


        [HttpPut("{id}/edit")]
        public async Task<ActionResult<VehicleDto?>> UpdateAsync(int id, [FromBody] VehicleCreateDto request)
        {
            if (request.Brand == null) return BadRequest("La marca del vehículo es requerida.");

            if (!request.Brand.Id.HasValue) return BadRequest("El ID de la marca no fue proporcionado.");

            int brandId = request.Brand.Id.Value;

            if (!await uow.BrandRepository.ExistsByIdAsync(brandId)) return NotFound($"La marca con ID {brandId} no fue encontrada.");

            Vehicle? itemToUpdate = await uow.VehicleRepository.GetByIdAsync(id);

            if (itemToUpdate == null) return NotFound($"El vehículo con ID {id} no fue encontrado.");

            foreach (VehiclePhoto photoToRemove in itemToUpdate.VehiclePhotos)
            {
                uow.PhotoRepository.Delete(photoToRemove.Photo);
            }

            itemToUpdate.VehicleBrand = new(brandId);
            itemToUpdate.Color = request.Color;
            itemToUpdate.Year = request.Year;
            itemToUpdate.Model = request.Model;

            foreach (VehiclePhotoCreateDto photo in request.Photos)
            {
                if (string.IsNullOrWhiteSpace(photo.Url)) return BadRequest("Las fotos deben tener un URL");

                itemToUpdate.VehiclePhotos.Add(new(photo.Url));
            }

            uow.VehicleRepository.Update(itemToUpdate);

            if (!await uow.CompleteAsync()) return BadRequest("Errores al guardar el vehículo.");

            return await uow.VehicleRepository.GetDtoByIdAsync(itemToUpdate.Id);
        }
    }
}
