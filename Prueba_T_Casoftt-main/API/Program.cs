using API.Extensions;
using API.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build();


app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowLocalhost");

app.UseRouting();
app.UseAuthorization();
app.MapControllers();

app.Run();
