using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Agregar servicios a la colección de dependencias
builder.Services.AddApplicationServices(builder.Configuration);

// Agregar Swagger para la documentación de la API
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Habilitar Swagger en la aplicación
app.UseSwagger();

// Configurar la interfaz de usuario de Swagger (Swagger UI)
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Mi API v1");
    options.RoutePrefix = string.Empty; // Esto permite acceder a Swagger UI desde la raíz del servidor
});

app.UseCors("AllowLocalhost");

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();
