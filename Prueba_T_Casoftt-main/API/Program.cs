using API.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();

app.UseCors("AllowLocalhost");

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();
