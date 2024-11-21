using System;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers

{
    public class BuggyController : BaseApiController
    {
        private readonly DataContext _context;
        public BuggyController(DataContext context)
        {
            _context = context;
        }
        [HttpGet("not-found")]
        public ActionResult<string> GetNotFound()
        {
            return NotFound(new { message = "El recurso solicitado no existe." });
        }

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            throw new Exception("Simulación de un error en el servidor.");
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest(new { message = "Solicitud incorrecta." });
        }

    }
}