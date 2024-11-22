using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BrandsController(IUnitOfWork uow) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<PagedList<BrandDto>>> GetPagedListAsync([FromQuery] BrandParams param)
        {
            
            PagedList<BrandDto> pagedList = await uow.BrandRepository.GetPagedListAsync(param);

            
            Response.AddPaginationHeader<BrandDto>(pagedList);

            return pagedList;
        }


        [HttpPost]
        public async Task<ActionResult<BrandDto?>> CreateAsync([FromBody] BrandCreateDto request)
        {
            Brand itemToCreate = new();

            itemToCreate.Name = request.Name;

            uow.BrandRepository.Add(itemToCreate);

            if (!await uow.CompleteAsync()) return BadRequest("Errores al agregar la marca.");

            return await uow.BrandRepository.GetDtoByIdAsync(itemToCreate.Id);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BrandDto?>> GetDtoByIdAsync([FromRoute] int id)
        {
            if (!await uow.BrandRepository.ExistsByIdAsync(id)) return NotFound($"La marca con ID {id} no fue encontrado.");

            return await uow.BrandRepository.GetDtoByIdAsync(id);
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteByIdAsync(int id)
        {
            await Task.Delay(0);

            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAsync([FromRoute] int id, [FromBody] BrandCreateDto request)
        {
            await Task.Delay(0);

            return Ok();
        }


        [HttpGet("options")]
        public async Task<ActionResult<List<OptionDto>>> GetOptionsAsync() =>
        await uow.BrandRepository.GetOptionsAsync();
    }


}
