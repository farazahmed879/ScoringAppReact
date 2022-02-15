﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using ScoringAppReact.Authorization;
using Microsoft.EntityFrameworkCore;
using ScoringAppReact.Models;
using Abp;
using ScoringAppReact.Teams.Dto;

namespace ScoringAppReact.Teams
{
    [AbpAuthorize(PermissionNames.Pages_Roles)]
    public class TeamAppService : AbpServiceBase, ITeamAppService
    {
        private readonly IRepository<Team, long> _repository;

        public TeamAppService(IRepository<Team, long> repository)
        {
            _repository = repository;
        }

        public async Task<ResponseMessageDto> CreateOrEditAsync(CreateOrUpdateTeamDto teamDto)
        {
            ResponseMessageDto result;
            if (teamDto.Id == 0)
            {
                result = await CreateTeamAsync(teamDto);
            }
            else
            {
                result = await UpdateTeamAsync(teamDto);
            }
            return result;
        }

        private async Task<ResponseMessageDto> CreateTeamAsync(CreateOrUpdateTeamDto teamDto)
        {
            var result = await _repository.InsertAsync(new Team()
            {
                Name = teamDto.Name,
                City = teamDto.City,
                Contact = teamDto.Contact,
                IsRegistered = teamDto.IsRegistered,
                Place = teamDto.Place,
                FileName = teamDto.FileName,
                Zone = teamDto.Zone,
                TenantId = teamDto.TenantId
            });

            await UnitOfWorkManager.Current.SaveChangesAsync();

            if (result.Id != 0)
            {
                return new ResponseMessageDto()
                {
                    Id = result.Id,
                    SuccessMessage = AppConsts.SuccessfullyInserted,
                    Success = true,
                    Error = false,
                };
            }
            return new ResponseMessageDto()
            {
                Id = 0,
                ErrorMessage = AppConsts.InsertFailure,
                Success = false,
                Error = true,
            };
        }

        private async Task<ResponseMessageDto> UpdateTeamAsync(CreateOrUpdateTeamDto teamDto)
        {
            var result = await _repository.UpdateAsync(new Team()
            {
                Name = teamDto.Name,
                Contact = teamDto.Contact,
                FileName = teamDto.FileName,
                Zone = teamDto.Zone,
                IsRegistered = teamDto.IsRegistered,
                City = teamDto.City,
                Place = teamDto.Place
            });

            if (result != null)
            {
                return new ResponseMessageDto()
                {
                    Id = result.Id,
                    SuccessMessage = AppConsts.SuccessfullyUpdated,
                    Success = true,
                    Error = false,
                };
            }
            return new ResponseMessageDto()
            {
                Id = 0,
                ErrorMessage = AppConsts.UpdateFailure,
                Success = false,
                Error = true,
            };
        }

        public async Task<TeamDto> GetById(long productId)
        {
            var result = await _repository.GetAll()
                .Where(i => i.Id == productId)
                .Select(i =>
                new TeamDto()
                {
                    Id = i.Id,
                    Name = i.Name,
                    Contact = i.Contact,
                    FileName = i.FileName,
                    Zone = i.Zone,
                    IsRegistered = i.IsRegistered,
                    City = i.City,
                    Place = i.Place
                })
                .FirstOrDefaultAsync();
            return result;
        }

        public async Task<ResponseMessageDto> DeleteAsync(long playerId)
        {
            var model = await _repository.GetAll().Where(i => i.Id == playerId).FirstOrDefaultAsync();
            model.IsDeleted = true;
            var result = await _repository.UpdateAsync(model);

            return new ResponseMessageDto()
            {
                Id = playerId,
                SuccessMessage = AppConsts.SuccessfullyDeleted,
                Success = true,
                Error = false,
            };
        }

        public async Task<List<TeamDto>> GetAll(long? tenantId)
        {
            var result = await _repository.GetAll().Where(i => i.IsDeleted == false && i.TenantId == tenantId).Select(i => new TeamDto()
            {
                Id = i.Id,
                Name = i.Name
            }).ToListAsync();
            return result;
        }

        public async Task<PagedResultDto<TeamDto>> GetPaginatedAllAsync(PagedTeamResultRequestDto input)
        {
            var filteredPlayers = _repository.GetAll()
                .Where(i => i.IsDeleted == false && (!input.TenantId.HasValue || i.TenantId == input.TenantId))
                .WhereIf(!string.IsNullOrWhiteSpace(input.Name),
                    x => x.Name.Contains(input.Name));

            var pagedAndFilteredPlayers = filteredPlayers
                .OrderBy(i => i.Name)
                .PageBy(input);

            var totalCount = filteredPlayers.Count();

            return new PagedResultDto<TeamDto>(
                totalCount: totalCount,
                items: await pagedAndFilteredPlayers.Select(i => new TeamDto()
                {
                    Id = i.Id,
                    Name = i.Name,
                    Contact = i.Contact,
                    FileName = i.FileName,
                    Zone = i.Zone,
                    IsRegistered = i.IsRegistered,
                    City = i.City,
                    Place = i.Place
                }).ToListAsync());
        }
    }
}

