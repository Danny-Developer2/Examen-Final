using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

public class MappingProfiles : Profile {
    public MappingProfiles() {
        CreateMap<Vehicle, VehicleDto>()
            .ForMember(dest => dest.Brand, opt => opt.MapFrom(src => src.VehicleBrand))
            .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.VehiclePhotos.Select(x => x.Photo)))
        ;

        CreateMap<VehicleBrand, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Brand.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Brand.Name))
        ;

        CreateMap<Photo, PhotoDto>()

        ;

        CreateMap<Vehicle, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => $"{src.Model} {src.Color} | ({src.Year})"))
        ;

        CreateMap<Brand, OptionDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
        ;

        CreateMap<Brand, BrandDto>()

        ;
    }
}
